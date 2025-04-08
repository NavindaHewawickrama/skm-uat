"use client";
import React, { useState } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import Footer from "@/components/Footer";
import ViewOrderEditPopupButton from "@/components/viewOrderEditPopupButton";

const PendingOrdersPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [listViewOpen, setListViewOpen] = useState(false);

  //#region
  // Sample pending orders data
  const pendingOrders = [
    {
      orderNo: "73511036",
      customer: "INTERLANKA AUTO SPARES COMPANY",
      salesRef: "manjula",
      orderDate: "4/5/2025, 4:39:15 PM",
      type: "credit",
      total: 91672.5,
      itemDetails: "",
      note: "",
      status: "Pending",
    },
    {
      orderNo: "73512892",
      customer: "INTERLANKA AUTO SPARES COMPANY",
      salesRef: "manjula",
      orderDate: "4/5/2025, 4:43:53 PM",
      type: "credit",
      total: 72547.5,
      itemDetails: "",
      note: "",
      status: "Pending",
    },
    {
      orderNo: "73518921",
      customer: "MAHA AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/6/2025, 10:12:30 AM",
      type: "credit",
      total: 56832.75,
      itemDetails: "",
      note: "Urgent delivery",
      status: "Processing",
    },
    {
      orderNo: "73523456",
      customer: "ROYAL MOTORS SUPPLIES",
      salesRef: "danushka",
      orderDate: "4/7/2025, 9:45:22 AM",
      type: "credit",
      total: 43250.0,
      itemDetails: "",
      note: "",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Processing",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
    {
      orderNo: "73526789",
      customer: "SUPREME AUTO PARTS",
      salesRef: "manjula",
      orderDate: "4/7/2025, 2:18:47 PM",
      type: "credit",
      total: 67895.25,
      itemDetails: "",
      note: "Confirm availability",
      status: "Pending",
    },
  ];

  //#endregion

  // Filter orders based on search query
  const filteredOrders = pendingOrders.filter(
    (order) =>
      order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.salesRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastOrder = currentPage * entriesPerPage;
  const indexOfFirstOrder = indexOfLastOrder - entriesPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleItemDetailsView = () => {
    setListViewOpen(true)
  }

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
            {/* Pending Orders Card */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <h2 className="text-lg font-bold mb-4">Pending Orders</h2>

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
                    className="border rounded px-2 py-1 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Order No
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Sales Ref
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Order Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Item Details
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Note
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border text-sm">
                          {order.orderNo}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.salesRef}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.orderDate}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.type}
                        </td>
                        <td className="px-4 py-3 border text-sm text-right">
                          {order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-indigo-600 text-white py-1 px-4 rounded hover:bg-indigo-700 focus:outline-none cursor-pointer" onClick={handleItemDetailsView}>
                            View
                          </button>
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.note}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded focus:outline-none cursor-pointer" >
                            Edit
                          </button>
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
                    Showing {indexOfFirstOrder + 1} to{" "}
                    {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                    {filteredOrders.length} entries
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
          <ViewOrderEditPopupButton open={listViewOpen} onClose={() => setListViewOpen(false)} />
          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersPage;
