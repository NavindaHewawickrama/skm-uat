"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import Footer from "@/components/Footer";
import CustomerSelectionPopup from "@/components/CustomerSelectionPopup";
import Alert from "@/components/Alert";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type OrderType = {
  orderNumber: number;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  orderedItems: { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }[];
  specialNote: string;
  rejectReason: string | null;
  status: string;
  delivertPersonName: string | null;
  deliveryDate: string | null;
  invoicedItems: string | null;
  trackingNumber: string | null;
};

interface Customer {
  customerCode: string;
  customerName: string;
}

interface CustomerOutstandingData {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoicedAmount: number;
  pdcAmount: number;
  dueAmount: number;
  remainingAmount: number;
}

interface Invoice {
  invoiceNumber: string;
  orderNo: string;
  invoiceDate: string;
  pdcAmount: number;
  dueAmount: number;
  totalAmount: number;
  remainingAmount: number;
}


const OutstandingsPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomerPopupOpen, setIsCustomerPopupOpen] = useState(false);
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [outstandingInvoices, setOutstandingInvoices] = useState<CustomerOutstandingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUserRoleType(sessionStorage.getItem("userRoleName") ? sessionStorage.getItem("userRoleName") : "");
    const pendingOrderList = sessionStorage.getItem("notificationsData");
    setPendingOrders(pendingOrderList ? JSON.parse(pendingOrderList) : []);
    fetchUserCustomerDetails();
  }, []);

  const fetchUserCustomerDetails = async () => {
    try {
      const response = await fetch(`/api/userCustomerDetails`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw Error("Failed to fetch pending order data");
      } else {
        const data = await response.json();
        console.log(data);
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Error fetching pending order data:", err);
    }
  };

  // Calculate total due amount from actual data
  const totalDueAmount = outstandingInvoices.reduce(
    (total, invoice) => total + invoice.dueAmount,
    0
  );

  // Filter invoices based on search query
  const filteredInvoices = outstandingInvoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastInvoice = currentPage * entriesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - entriesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(filteredInvoices.length / entriesPerPage);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleOpenCustomerPopup = () => {
    setIsCustomerPopupOpen(true);
  };

  const handleCloseCustomerPopup = () => {
    setIsCustomerPopupOpen(false);
  };

  const handleAddCustomers = async (selectedCustomerCodes: string[]) => {
    console.log("Selected customer codes:", selectedCustomerCodes);

    if (selectedCustomerCodes.length === 0) {
      handleShowAlert("warning", "No customers selected");
      return;
    }

    setIsLoading(true);
    setOutstandingInvoices([]); // Clear existing data
    let allInvoiceData: CustomerOutstandingData[] = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      // Loop through each selected customer code
      for (const customerCode of selectedCustomerCodes) {
        try {
          // Find customer name from customers list
          const customer = customers.find(c => c.customerCode === customerCode);
          const customerName = customer?.customerName || `Customer ${customerCode}`;

          console.log(`Fetching invoices for customer: ${customerCode} (${customerName})`);

          const response = await fetch(`/api/customerInvoice?customerCode=${customerCode}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch invoices for customer ${customerCode}`);
          }

          const data = await response.json();
          console.log(`Fetched data for ${customerCode}:`, data);

          // Transform the data for this customer - now accessing the nested invoices array
          const transformedData: CustomerOutstandingData[] = data.map((invoice: Invoice) => ({
            customerName: customerName,
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate
              ? new Date(invoice.invoiceDate).toLocaleDateString("en-US")
              : "",
            invoicedAmount: parseFloat(invoice.totalAmount?.toString() || "0"),
            pdcAmount: parseFloat(invoice.pdcAmount?.toString() || "0"),
            dueAmount: parseFloat(invoice.dueAmount?.toString() || "0"),
          }));

          // Add to the accumulated data
          allInvoiceData = [...allInvoiceData, ...transformedData];
          successCount++;

          console.log(`Successfully processed ${transformedData.length} invoices for ${customerName}`);

        } catch (customerError) {
          console.error(`Error fetching data for customer ${customerCode}:`, customerError);
          errorCount++;
        }
      }
      // console.log(allInvoiceData);
      // Update the state with all collected invoice data
      setOutstandingInvoices(allInvoiceData);
      setCurrentPage(1); // Reset to first page

      // Show success/error message
      if (successCount > 0 && errorCount === 0) {
        handleShowAlert("success", `Successfully loaded ${allInvoiceData.length} invoice records from ${successCount} customer(s)`);
      } else if (successCount > 0 && errorCount > 0) {
        handleShowAlert("warning", `Loaded ${allInvoiceData.length} invoice records from ${successCount} customer(s). Failed to load data for ${errorCount} customer(s)... This may be due to missing invoices for that customer`);
      } else {
        handleShowAlert("error", `Failed to load data for all ${errorCount} selected customer(s)... This may be due to missing invoices for that customer`);
      }

    } catch (error) {
      console.error('Error in handleAddCustomers:', error);
      handleShowAlert("error", "Failed to fetch customer invoice data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAlert = (type: string, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const generatePDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Customer Outstanding Report", 105, 15, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("All Selected Customers", 105, 22, {
      align: "center",
    });
    // pdf.setFontSize(12);
    // pdf.text(selectedCustomer?.customerName || "", 105, 22, { align: "center" });

    const currentDate = new Date().toLocaleDateString("en-US");
    pdf.setFontSize(10);
    pdf.text(currentDate, 195, 15, { align: "right" });

    const tableColumn = [
      "Customer Name",
      "Invoice Number",
      "Invoice Date",
      "Invoiced Amount",
      "PDC Amount",
      "Due Amount",
    ];
    const tableRows = outstandingInvoices.map((item) => [
      item.customerName,
      item.invoiceNumber,
      item.invoiceDate,
      `${item.invoicedAmount.toFixed(2)}`,
      `${item.pdcAmount.toFixed(2)}`,
      `${(item.dueAmount - item.invoicedAmount) > 0 ? (item.dueAmount - item.invoicedAmount).toFixed(2) : "0.00"}`,
    ]);

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const totalDue = outstandingInvoices.reduce(
      (sum, item) => sum + item.dueAmount,
      0
    );

    const totalPDC = outstandingInvoices.reduce(
      (sum, item) => sum + item.pdcAmount,
      0
    );
    // const totalInvoiced = outstandingData.reduce(
    //   (sum, item) => sum + item.invoicedAmount,
    //   0
    // );

    const finalY = pdf.lastAutoTable?.finalY || 60;
    pdf.setFontSize(12);
    pdf.text(`Total Outstanding: ${totalDue.toFixed(2)}`, 195, finalY + 10, {
      align: "right",
    });
    pdf.setFontSize(12);
    pdf.text(`PDC Total: ${totalPDC.toFixed(2)}`, 195, finalY + 20, {
      align: "right",
    });

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} notificationData={pendingOrders} />

      {/* Alert Component */}
      {showAlert && (
        <Alert message={alertMessage} type={alertType} duration={5000} />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Outstandings Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            {/* Outstandings Card */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <div className="bg-gray-100 rounded-lg shadow-sm p-6 mb-6 w-full md:w-1/2 sm:w-full h-[50%]">
                <h2 className="text-xl font-bold mb-6">Get Customer Outstanding Invoices</h2>
                <div className="flex justify-start mb-6">
                  <button
                    className={`bg-green-500 w-[50%] md:w-[50%] sm:w-full text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleOpenCustomerPopup}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : '+ Select Customers'}
                  </button>
                </div>
                {isLoading && (
                  <div className="text-sm text-blue-600">
                    Fetching invoice data for selected customers...
                  </div>
                )}
              </div>

              {/* Total Due Amount Display - Moved above table controls and always visible when data exists */}
              {outstandingInvoices.length > 0 && (
                <div className="mb-6 sticky top-0 z-10">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-700">Outstanding Summary</span>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div>
                            <span className="text-sm text-gray-600">Total Due Amount: </span>
                            <span className="font-bold text-blue-700 text-lg">
                              LKR {totalDueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total Invoices: </span>
                            <span className="font-semibold text-indigo-700">
                              {outstandingInvoices.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Unique Customers: </span>
                            <span className="font-semibold text-indigo-700">
                              {new Set(outstandingInvoices.map(inv => inv.customerName)).size}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setOutstandingInvoices([]);
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Clear Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Show table only if there's data */}
              {outstandingInvoices.length > 0 && (
                <>
                  {/* Table controls */}
                  <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
                    <div className="mb-4 flex justify-end">
                      <button
                        onClick={generatePDF}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 focus:outline-none cursor-pointer"
                      >
                        Export PDF
                      </button>
                    </div>

                    <div className="flex items-center">
                      <span className="mr-2">Show</span>
                      <select
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        className="border rounded px-2 py-1"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span className="ml-2">entries</span>
                    </div>

                    <div className="flex items-center">
                      <span className="mr-2">Search:</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type Here..."
                        className="border rounded px-2 py-1 w-full md:w-auto focus:outline-none focus:ring-1"
                      />
                    </div>
                  </div>

                  {/* Outstandings Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                            Customer
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                            Invoice No
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                            Invoice Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                            Invoiced Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                            PDC Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                            Due Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentInvoices.map((invoice, index) => (
                          <tr key={`${invoice.customerName}-${invoice.invoiceNumber}-${index}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 border text-sm">
                              {invoice.customerName}
                            </td>
                            <td className="px-4 py-3 border text-sm">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="px-4 py-3 border text-sm">
                              {invoice.invoiceDate}
                            </td>
                            <td className="px-4 py-3 border text-sm text-right">
                              {invoice.invoicedAmount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 border text-sm text-right">
                              {invoice.pdcAmount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 border text-sm text-right font-medium">
                              {(invoice.dueAmount - invoice.invoicedAmount) > 0 ? (invoice.dueAmount - invoice.invoicedAmount).toFixed(2) : 0.00}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 0 && (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Showing {indexOfFirstInvoice + 1} to{" "}
                        {Math.min(indexOfLastInvoice, filteredInvoices.length)} of{" "}
                        {filteredInvoices.length} entries
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded ${currentPage === 1
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (pageNumber) => (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-3 py-1 rounded ${currentPage === pageNumber
                                ? "bg-blue-700 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                              {pageNumber}
                            </button>
                          )
                        )}
                        <button
                          onClick={() =>
                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded ${currentPage === totalPages
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* No data message */}
              {outstandingInvoices.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <p>No outstanding invoices loaded. Please select customers to view their invoice data.</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Selection Popup */}
          <CustomerSelectionPopup
            open={isCustomerPopupOpen}
            onClose={handleCloseCustomerPopup}
            onAdd={handleAddCustomers}
            customersList={customers}
          />

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default OutstandingsPage;