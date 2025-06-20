"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import Footer from "@/components/Footer";
import CustomerSelectionPopup from "@/components/CustomerSelectionPopup";

const OutstandingsPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomerPopupOpen, setIsCustomerPopupOpen] = useState(false);
  const [userRoleType, setUserRoleType] = useState<string | null>(null);

  useEffect(() => {
    setUserRoleType(sessionStorage.getItem("userRoleName") ? sessionStorage.getItem("userRoleName") : "");
  }, []);
  // Sample outstandings data
  const outstandingInvoices = [
    {
      customer: "INTERLANKA AUTO SPARES COMPANY",
      invoiceNo: "INV73511036",
      invoiceDate: "3/10/2025, 10:15:22 AM",
      invoicedAmount: 91672.5,
      dueAmount: 46672.5,
    },
    {
      customer: "INTERLANKA AUTO SPARES COMPANY",
      invoiceNo: "INV73512892",
      invoiceDate: "3/12/2025, 2:30:15 PM",
      invoicedAmount: 72547.5,
      dueAmount: 72547.5,
    },
    {
      customer: "MAHA AUTO PARTS",
      invoiceNo: "INV73518921",
      invoiceDate: "3/15/2025, 9:45:30 AM",
      invoicedAmount: 56832.75,
      dueAmount: 36832.75,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
    {
      customer: "ROYAL MOTORS SUPPLIES",
      invoiceNo: "INV73523456",
      invoiceDate: "3/18/2025, 11:22:45 AM",
      invoicedAmount: 43250.0,
      dueAmount: 43250.0,
    },
  ];

  // Calculate total due amount
  const totalDueAmount = outstandingInvoices.reduce(
    (total, invoice) => total + invoice.dueAmount,
    0
  );

  // Filter invoices based on search query
  const filteredInvoices = outstandingInvoices.filter(
    (invoice) =>
      invoice.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleAddCustomers = (selectedCustomers: string[]) => {
    // Handle the selected customers
    console.log("Selected customers:", selectedCustomers);
    // You would typically fetch invoices for these customers here
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} />

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
                <h2 className="text-xl font-bold mb-6">Get Customer&apos;s</h2>
                <div className="flex justify-start mb-6">
                  <button
                    className="bg-green-500 w-[50%] md:w-[50%] sm:w-full text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none cursor-pointer"
                    onClick={handleOpenCustomerPopup}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Due Amount Display */}
              <div className="mb-4">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <span className="font-medium">Total Due Amount: </span>
                  <span className="font-bold text-blue-700">
                    {totalDueAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Table controls */}
              <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
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
                        Due Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentInvoices.map((invoice, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border text-sm">
                          {invoice.customer}
                        </td>

                        <td className="px-4 py-3 border text-sm">
                          {invoice.invoiceNo}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {invoice.invoiceDate}
                        </td>
                        <td className="px-4 py-3 border text-sm text-right">
                          {invoice.invoicedAmount.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 border text-sm text-right font-medium">
                          {invoice.dueAmount.toFixed(2)}
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
            </div>
          </div>
          {/* Customer Selection Popup */}
          <CustomerSelectionPopup
            open={isCustomerPopupOpen}
            onClose={handleCloseCustomerPopup}
            onAdd={handleAddCustomers}
          />
          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default OutstandingsPage;
