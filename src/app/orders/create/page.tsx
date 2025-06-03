"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  itemCode: string;
  itemName: string;
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
  dueAmount: number;
}

const CreateOrderPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [notes, setNotes] = useState("");
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedCustomerDueAmount, setSelectedCustomerDueAmount] = useState(0);
  const [selectedCustomerTotal, setSelectedCustomerTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current item being added
  const [currentItem, setCurrentItem] = useState<OrderItem>({
    itemCode: "",
    itemName: "",
    unitPrice: 0,
    quantity: 0,
    discount: 0,
    total: 0,
  });

  const outstandingData: CustomerOutstandingData[] = [
    {
      customerName: "ABC Corporation",
      invoiceNumber: "INV-001",
      invoiceDate: "2025-04-15",
      invoicedAmount: 5000,
      dueAmount: 5000,
    },
    {
      customerName: "ABC Corporation",
      invoiceNumber: "INV-002",
      invoiceDate: "2025-04-25",
      invoicedAmount: 3500,
      dueAmount: 3500,
    },
    {
      customerName: "XYZ Industries",
      invoiceNumber: "INV-003",
      invoiceDate: "2025-05-01",
      invoicedAmount: 7500,
      dueAmount: 7500,
    },
    {
      customerName: "Smith Enterprises",
      invoiceNumber: "INV-004",
      invoiceDate: "2025-05-10",
      invoicedAmount: 2200,
      dueAmount: 2200,
    },
  ];

  useEffect(() => {
    fetchUserCustomerDetails();
  }, [])

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
      }
    } catch (err) {
      console.error("Error fetching pending order data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch pending order data"
      );
    }
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  // Calculate item total
  const calculateItemTotal = () => {
    const totalBeforeDiscount = currentItem.unitPrice * currentItem.quantity;
    const discountAmount = totalBeforeDiscount * (currentItem.discount / 100);
    return totalBeforeDiscount - discountAmount;
  };

  // Update current item field
  const updateCurrentItem = (
    field: keyof OrderItem,
    value: string | number
  ) => {
    setCurrentItem((prev) => {
      const updated = { ...prev, [field]: value };
      // Recalculate total
      updated.total =
        updated.unitPrice * updated.quantity * (1 - updated.discount / 100);
      return updated;
    });
  };

  // Add item to order list
  const addToList = () => {
    if (
      !currentItem.itemCode ||
      !currentItem.itemName ||
      currentItem.quantity <= 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem = { ...currentItem, total: calculateItemTotal() };
    setOrderItems([...orderItems, newItem]);

    // Update order totals
    const newTotal = total + newItem.total;
    setTotal(newTotal);
    setTotalDueAmount(newTotal);

    // Reset current item
    setCurrentItem({
      itemCode: "",
      itemName: "",
      unitPrice: 0,
      quantity: 0,
      discount: 0,
      total: 0,
    });
  };

  const generatePDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Customer Outstanding Report", 105, 15, { align: "center" });

    const currentDate = new Date().toLocaleDateString("en-US");
    pdf.setFontSize(10);
    pdf.text(currentDate, 195, 15, { align: "right" });

    const tableColumn = [
      "Customer Name",
      "Invoice Number",
      "Invoice Date",
      "Invoiced Amount",
      "Due Amount",
    ];
    const tableRows = outstandingData.map((item) => [
      item.customerName,
      item.invoiceNumber,
      item.invoiceDate,
      `${item.invoicedAmount.toFixed(2)}`,
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

    const finalY = pdf.lastAutoTable?.finalY || 60;
    pdf.setFontSize(12);
    pdf.text(
      `Total Outstanding: ${totalDue.toFixed(2)}`,
      195,
      finalY + 10,
      { align: "right" }
    );

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleViewDetails = () => {
    generatePDF();
  };

  const handleCustomerChange = (customerCode: string) => {
    setCustomer(customerCode);

    const selected = customers.find((c: any) => c.customerCode === customerCode);
    if (selected) {
      setSelectedCustomer(selected);
      setSelectedCustomerDueAmount(selected.dueAmount);

      const creditLimit = Number(selected.creditLimit) || 0;
      const balanceCredit = Number(selected.balanceCredit ?? 0);
      const customerTotal = creditLimit - balanceCredit;

      setSelectedCustomerTotal(customerTotal);
    }
  };





  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Order Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
                    <option value="" disabled>Select a Location</option>
                    {locations.map((loc: any, index) => (
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
                      {customers.map((customer: any, index) => (
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
                    <button onClick={handleViewDetails} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 focus:outline-none cursor-pointer">
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
                    value={selectedCustomerTotal}
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Type and Notes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Payment Type:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-2 border border-gray-300 rounded appearance-none"
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                    >
                      <option value="">Select payment type</option>
                      <option value="cash">Cash</option>
                      <option value="credit">Credit Card</option>
                      <option value="bank">Bank Transfer</option>
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
                      value={currentItem.itemCode}
                      onChange={(e) =>
                        updateCurrentItem("itemCode", e.target.value)
                      }
                    >
                      <option value="">Select item code</option>
                      <option value="item001">ITEM001 / 40+</option>
                      <option value="item002">ITEM002 / 40+</option>
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
                      value={currentItem.itemName}
                      onChange={(e) =>
                        updateCurrentItem("itemName", e.target.value)
                      }
                    >
                      <option value="">Select substitute item name</option>
                      <option value="Product A">Product A</option>
                      <option value="Product B">Product B</option>
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
                    value={currentItem.unitPrice || ""}
                    onChange={(e) =>
                      updateCurrentItem(
                        "unitPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
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
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={currentItem.quantity || ""}
                    onChange={(e) =>
                      updateCurrentItem(
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Discount(%):
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={currentItem.discount || ""}
                    onChange={(e) =>
                      updateCurrentItem(
                        "discount",
                        parseFloat(e.target.value) || 0
                      )
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
                    value={calculateItemTotal().toFixed(2)}
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
                              {item.itemName}
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
                                  setOrderItems(newItems);

                                  // Update totals
                                  setTotal((prev) => prev - removedItem.total);
                                  setTotalDueAmount(
                                    (prev) => prev - removedItem.total
                                  );
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
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Order Button */}
              {orderItems.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none cursor-pointer">
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Order Form */}
            {/* <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <h2 className="text-lg font-bold mb-4">Listed Order Items</h2> */}
            {/* Customer and Totals Row */}
            {/* <div className="bg-white overflow-x-auto overflow-y-auto shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        Discount (%)
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
              </div> */}
            {/* </div> */}
          </div>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
