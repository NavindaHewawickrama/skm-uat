"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Alert from "../../../components/Alert";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface OrderItem {
  itemCode: string;
  description: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
}

interface CustomerOutstandingData {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoicedAmount: number;
  pdcAmount: number;
  dueAmount: number;
}

interface Customer {
  customerCode: string;
  customerName: string;
  dueAmount: number;
  creditAllowed: boolean;
  creditLimit: number;
  balanceCredit: number;
  paymentTermCode: string;
  outstandingData?: CustomerOutstandingData[]; // optional field for outstanding data
  // add more fields if necessary
}

interface SubstituteItem {
  itemCode: string;
  itemName: string;
  unitPrice: number;
}

interface Item {
  itemCode: string;
  itemName: string;
  substituteItems: SubstituteItem[];
  unitprice: string;
}

interface Location {
  locationCode: string;
  locationName: string;
}

interface Customer {
  customerCode: string;
  customerName: string;
}

// interface Payment {
//   code: string,
//   name: string,
// }

const CreateOrderPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [notes, setNotes] = useState("");
  const [total, setTotal] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedCustomerDueAmount, setSelectedCustomerDueAmount] =
    useState<number>(0);
  //const [selectedCustomerTotal, setSelectedCustomerTotal] = useState<number>(0);
  const [customer, setCustomer] = useState<string>("");
  //const [paymentTypes, setPaymentTypes] = useState<Payment[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedItemUnitPrice, setSelectedItemUnitPrice] = useState("");
  const [selectedItemQuantity, setSelectedItemQuantity] = useState(0);
  const [selectedItemDiscount, setSelectedItemDiscount] = useState(0);
  const [substitutedItemsList, setSubstitutedItemsList] = useState<
    SubstituteItem[]
  >([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [outstandingData, setOutstandingData] = useState<
    CustomerOutstandingData[]
  >([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // Add this in your component
  useEffect(() => {
    if (outstandingData.length > 0) {
      generatePDF();
    }
  }, [outstandingData]);

  // const outstandingData: CustomerOutstandingData[] = [
  //   {
  //     customerName: "ABC Corporation",
  //     invoiceNumber: "INV-001",
  //     invoiceDate: "2025-04-15",
  //     invoicedAmount: 5000,
  //     pdcAmount: 3200,
  //     dueAmount: 5000,
  //   },
  //   {
  //     customerName: "ABC Corporation",
  //     invoiceNumber: "INV-002",
  //     invoiceDate: "2025-04-25",
  //     invoicedAmount: 3500,
  //     pdcAmount: 1800,
  //     dueAmount: 3500,
  //   },
  //   {
  //     customerName: "XYZ Industries",
  //     invoiceNumber: "INV-003",
  //     invoiceDate: "2025-05-01",
  //     invoicedAmount: 7500,
  //     pdcAmount: 5200,
  //     dueAmount: 7500,
  //   },
  //   {
  //     customerName: "Smith Enterprises",
  //     invoiceNumber: "INV-004",
  //     invoiceDate: "2025-05-10",
  //     invoicedAmount: 2200,
  //     pdcAmount: 7100,
  //     dueAmount: 2200,
  //   },
  // ];

  useEffect(() => {
    fetchUserCustomerDetails();
    setUserRoleType(
      sessionStorage.getItem("userRoleName")
        ? sessionStorage.getItem("userRoleName")
        : ""
    );
  }, []);

  const handleShowAlert = (type: string, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

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
        setLocations(data.locations);
        setCustomers(data.customers);
        // setPaymentTypes(data.paymentTypes);
        setItemsList(data.items);
      }
    } catch (err) {
      console.error("Error fetching pending order data:", err);
    }
  };

  const fetchCustomerInvoices = async (customerCode: string) => {
    setIsLoadingInvoices(true);
    try {
      const response = await fetch(`/api/customerInvoice?customerId=${customerCode}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customer invoices');
      }

      const transformedInvoices = await response.json();

      // Transform the array to match your CustomerOutstandingData interface
      const transformedData: CustomerOutstandingData[] = transformedInvoices.map(
        (invoice: any) => ({
          customerName: selectedCustomer?.customerName || "",
          invoiceNumber: invoice.invoiceNumber || "",
          invoiceDate: invoice.invoiceDate
            ? new Date(invoice.invoiceDate).toLocaleDateString()
            : "",
          invoicedAmount: parseFloat(invoice.remainingAmount || 0),
          pdcAmount: parseFloat(invoice.pdcAmount || 0),
          dueAmount: parseFloat(invoice.dueAmount || 0),
        })
      );

      setOutstandingData(transformedData);

      const totalDueAmount = transformedData.reduce(
        (sum, item) => sum + item.dueAmount,
        0
      );
      setSelectedCustomerDueAmount(totalDueAmount);

    } catch (error) {
      console.error("Error fetching customer invoices:", error);
      handleShowAlert("error", "Failed to fetch customer invoice data");
      setOutstandingData([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  // Calculate item total
  const calculateItemTotal = () => {
    const totalFull = parseFloat(selectedItemUnitPrice) * selectedItemQuantity;
    const discount = totalFull * (selectedItemDiscount / 100);
    const total = totalFull - discount;
    return total;
  };

  // Add item to order list
  const addToList = () => {
    if (orderItems.length >= 14) {
    } else {
      if (
        !selectedItem ||
        !selectedItemQuantity ||
        !selectedCustomer ||
        //!paymentType ||
        !location
      ) {
        handleShowAlert("error", "Please fill in all required fields");
        return;
      }

      const newItem = {
        itemCode: selectedItem,
        description: selectedItemName,
        unitPrice: parseFloat(selectedItemUnitPrice),
        quantity: selectedItemQuantity,
        discount: selectedItemDiscount,
        total: calculateItemTotal(),
      };

      //const newItem = { ...currentItem, total: calculateItemTotal() };
      const updatedOrderItems = [...orderItems, newItem];
      setOrderItems(updatedOrderItems);

      const newOrderTotal = updatedOrderItems.reduce(
        (acc, item) => acc + item.total,
        0
      );
      setOrderTotal(newOrderTotal);

      // Update order totals
      const newTotal = total + newItem.total;
      setTotal(newTotal);

      // Reset current item
      setSelectedItem("");
      setSelectedItemName("");
      setSelectedItemUnitPrice("");
      setSelectedItemQuantity(0);
      setSelectedItemDiscount(0);
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Customer Outstanding Report", 105, 15, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(selectedCustomer?.customerName || "", 105, 22, {
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
    const tableRows = outstandingData.map((item) => [
      item.customerName,
      item.invoiceNumber,
      item.invoiceDate,
      `${item.invoicedAmount.toFixed(2)}`,
      `${item.pdcAmount.toFixed(2)}`,
      `${item.dueAmount.toFixed(2)}`,
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

    const totalDue = outstandingData.reduce(
      (sum, item) => sum + item.dueAmount,
      0
    );

    const totalPDC = outstandingData.reduce(
      (sum, item) => sum + item.pdcAmount,
      0
    );
    const totalInvoiced = outstandingData.reduce(
      (sum, item) => sum + item.invoicedAmount,
      0
    );

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

  const handleViewDetails = async () => {
    if (!selectedCustomer) {
      handleShowAlert("error", "Please select a customer first");
      return;
    }

    setIsLoadingInvoices(true);
    try {
      const response = await fetch(`/api/customerInvoice?customerCode=${selectedCustomer.customerCode}`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch customer invoices');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Transform the array to match your CustomerOutstandingData interface
      const transformedData: CustomerOutstandingData[] = data.map(
        (invoice: any) => ({
          customerName: selectedCustomer?.customerName || "",
          invoiceNumber: invoice.invoiceNumber || "",
          invoiceDate: invoice.invoiceDate
            ? new Date(invoice.invoiceDate).toLocaleDateString()
            : "",
          invoicedAmount: parseFloat(invoice.remainingAmount || 0),
          pdcAmount: parseFloat(invoice.pdcAmount || 0),
          dueAmount: parseFloat(invoice.dueAmount || 0),
        })
      );

      setOutstandingData(transformedData);

      const totalDueAmount = transformedData.reduce(
        (sum, item) => sum + item.dueAmount,
        0
      );
      setSelectedCustomerDueAmount(totalDueAmount);

      handleShowAlert("success", `Loaded ${transformedData.length} invoice records`);

    } catch (error) {
      console.error('Error:', error);
      handleShowAlert("error", "Failed to fetch customer invoice data");
      setOutstandingData([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const handleCustomerChange = (customerCode: string) => {
    //console.log(customerCode);
    setCustomer(customerCode);

    const selected = customers.find((c) => c.customerCode === customerCode);
    if (selected) {
      setSelectedCustomer(selected);
      setOutstandingData(selected.outstandingData || []);
      //     console.log(selected)
      setSelectedCustomerDueAmount(selected.dueAmount);

      const creditLimit = Number(selected.creditLimit) || 0;
      const balanceCredit = Number(selected.balanceCredit ?? 0);
      const customerTotal = creditLimit - balanceCredit;

      // setSelectedCustomerTotal(customerTotal);
      console.log(customerTotal);
    }
  };

  // Update current item field
  const updateCurrentItem = (field: keyof OrderItem, value: string) => {
    setSelectedItem(value);
    const selected = itemsList.find((item) => item.itemCode === value);
    if (selected) {
      setSelectedItemUnitPrice(selected.unitprice);
      setSelectedItemName(selected.itemName);
      console.log(selected.substituteItems);

      // Fix: Handle both single object and array cases
      if (selected.substituteItems) {
        if (Array.isArray(selected.substituteItems)) {
          setSubstitutedItemsList(selected.substituteItems);
        } else {
          // Convert single object to array
          setSubstitutedItemsList([selected.substituteItems]);
        }
      } else {
        setSubstitutedItemsList([]);
      }
    } else {
      setSubstitutedItemsList([]);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        body: JSON.stringify({
          customerCode: selectedCustomer?.customerCode,
          locationCode: location,
          paymentMethodCode: selectedCustomer?.paymentTermCode,
          totalAmount: orderTotal,
          items: orderItems,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Success case - show backend success message or generic success
        const successMessage = data.message || "Order created successfully";
        handleShowAlert("success", successMessage);

        // Reset form after successful save
        setSelectedCustomer(null);
        setCustomer("");
        setLocation("");
        setPaymentType("");
        setOrderItems([]);
        setOrderTotal(0);
        setTotal(0);
        setSelectedCustomerDueAmount(0);
      } else {
        // Error case - check for 403 status first
        if (response.status === 403) {
          handleShowAlert("error", "Not authorized to create order");
        } else {
          // Show backend error message for other errors
          let errorMessage = data.error || "Order creation failed";

          // If there are additional details from backend, try to extract them
          if (data.details) {
            try {
              const parsedDetails = JSON.parse(data.details);
              if (parsedDetails.message) {
                errorMessage = parsedDetails.message;
              } else if (typeof data.details === "string") {
                errorMessage = data.details;
              }
            } catch (e) {
              // If parsing fails, use details as string
              console.error("Error parsing details:", e);
              errorMessage = data.details;
            }
          }

          handleShowAlert("error", errorMessage);
        }
        console.error("Order creation failed:", data);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      handleShowAlert("error", "Network error occurred");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Order Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showAlert && (
            <Alert message={alertMessage} type={alertType} duration={5000} />
          )}
          <div className="flex-1 p-4 overflow-auto">
            {/* Order Form */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <h2 className="text-lg font-bold mb-4">Order</h2>
              {/*Location*/}
              <div className="mb-4 w-[250px]">
                <label className="block text-gray-700 font-medium mb-2">
                  Location:
                </label>
                <div className="relative">
                  <select
                    className="block w-full p-2 border border-gray-300 rounded appearance-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a Location
                    </option>
                    {locations.map((loc, index) => (
                      <option key={index} value={loc.locationCode}>
                        {loc.locationName}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Customer and Totals Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Customer:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-2 border border-gray-300 rounded appearance-none"
                      value={customer}
                      onChange={(e) => handleCustomerChange(e.target.value)} // pass the code
                    >
                      <option value="">Select a customer</option>
                      {customers.map((customer, index) => (
                        <option value={customer.customerCode} key={index}>
                          {customer.customerName}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total Due Amount:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-200 rounded bg-gray-100 focus:outline-none"
                    value={selectedCustomerDueAmount}
                    readOnly
                  />
                  <div className="flex justify-start mt-2">
                    <button
                      onClick={handleViewDetails}
                      className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 focus:outline-none cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-200 rounded bg-gray-100 focus:outline-none"
                    //value={selectedCustomerTotal}
                    value={orderTotal.toFixed(2)}
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Type and Notes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Payment Type:
                    </label>
                    <div className="relative">
                      <select
                        disabled
                        className="block w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-600 appearance-none"
                        value={paymentType}
                      >
                        <option>Default payment type</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Credit Allowed:
                        </span>
                        <span
                          className={
                            selectedCustomer?.creditAllowed
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {selectedCustomer?.creditAllowed ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Credit Limit:
                        </span>
                        <span className="text-gray-700">
                          {selectedCustomer?.creditLimit || "Not Set"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Note:
                  </label>
                  <textarea
                    className="block w-full p-2 border border-gray-300 rounded"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-bold mb-4">Order Items</h2>

              {/* Item Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Items by Code:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-2 border border-gray-300 rounded appearance-none"
                      value={selectedItem}
                      onChange={(e) =>
                        updateCurrentItem("itemCode", e.target.value)
                      }
                    >
                      <option value="">Select item code</option>
                      {itemsList.map((item, index) => (
                        <option key={index} value={item.itemCode}>
                          {item.itemCode}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Substitute Items:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-2 border border-gray-300 rounded appearance-none"
                    // value={currentItem.itemName}
                    // onChange={(e) => updateCurrentItem("itemName", e.target.value)}
                    >
                      {substitutedItemsList?.length === 0 ? (
                        <option value="" disabled>
                          No substitute items available
                        </option>
                      ) : (
                        substitutedItemsList?.map((item, index) => (
                          <option key={index} value={item.itemName}>
                            {item.itemName}
                          </option>
                        ))
                      )}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Unit Price:
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={selectedItemUnitPrice}
                    disabled
                  />
                </div>
              </div>

              {/* Quantity, Discount, Total Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={selectedItemQuantity}
                    onChange={(e) =>
                      setSelectedItemQuantity(parseInt(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Discount(%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={selectedItemDiscount}
                    onChange={(e) =>
                      setSelectedItemDiscount(parseInt(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-200 rounded bg-gray-100 focus:outline-none"
                    value={
                      calculateItemTotal() ? calculateItemTotal().toFixed(2) : 0
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none cursor-pointer"
                  onClick={addToList}
                >
                  Add To List
                </button>
              </div>

              {/* Order Items List */}
              {orderItems.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Order Items List
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">
                            Item Code
                          </th>
                          <th className="py-2 px-4 border-b text-left">
                            Item Name
                          </th>
                          <th className="py-2 px-4 border-b text-right">
                            Unit Price
                          </th>
                          <th className="py-2 px-4 border-b text-right">
                            Quantity
                          </th>
                          <th className="py-2 px-4 border-b text-right">
                            Discount(%)
                          </th>
                          <th className="py-2 px-4 border-b text-right">
                            Total
                          </th>
                          <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b">
                              {item.itemCode}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.description}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                              {item.unitPrice.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                              {item.quantity}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                              {item.discount.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                              {item.total.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              <button
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={() => {
                                  const newItems = [...orderItems];
                                  const removedItem = newItems.splice(
                                    index,
                                    1
                                  )[0];
                                  console.log(removedItem);
                                  setOrderItems(newItems);

                                  // Update totals
                                  const newOrderTotal = newItems.reduce(
                                    (acc, item) => acc + item.total,
                                    0
                                  );
                                  setOrderTotal(newOrderTotal);
                                  setTotal(newOrderTotal);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={3}
                            className="py-2 px-4 border-b text-center"
                          >
                            Total
                          </td>
                          <td className="py-2 px-4 border-b text-right"></td>
                          <td
                            colSpan={2}
                            className="py-2 px-4 border-b text-right"
                          >
                            {orderTotal.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Order Button */}
              {orderItems.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
