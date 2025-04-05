"use client";
import React, { useState } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import Footer from "@/components/Footer";

const DeliveredOrdersPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample delivered orders data based on the screenshot
  const deliveredOrders = [
    {
      orderNo: "4821",
      customer: "ROYAL MOTORS(G)",
      salesRef: "manjula",
      orderDate: "9/15/2020, 8:58:38 PM",
      type: "credit",
      total: 327225,
      itemDetails: "",
      note: "",
      status: "Delivered",
    },
    {
      orderNo: "6476",
      customer: "GUNASEKARA BATTERY SHOP",
      salesRef: "mahesh",
      orderDate: "9/15/2020, 9:34:08 PM",
      type: "credit",
      total: 7290,
      itemDetails: "",
      note: "",
      status: "Delivered",
    },
    {
      orderNo: "7327",
      customer: "NAMOMARIYANI AUTO SPARES",
      salesRef: "mahesh",
      orderDate: "9/15/2020, 9:40:42 PM",
      type: "credit",
      total: 17572.5,
      itemDetails: "",
      note: "",
      status: "Delivered",
    },
    {
      orderNo: "9577",
      customer: "PERERA MOTORS (MAKANDURA)",
      salesRef: "mahesh",
      orderDate: "9/15/2020, 9:54:32 PM",
      type: "credit",
      total: 25950,
      itemDetails: "",
      note: "aluthiun b...",
      status: "Delivered",
    },
    {
      orderNo: "10264",
      customer: "PERERA MOTORS (MAKANDURA)",
      salesRef: "mahesh",
      orderDate: "9/15/2020, 9:58:37 PM",
      type: "credit",
      total: 17295,
      itemDetails: "",
      note: "meka adama danna hadissi",
      status: "Delivered",
    },
    {
      orderNo: "12329",
      customer: "JAYAN MOTORS",
      salesRef: "manjula",
      orderDate: "9/15/2020, 11:37:23 PM",
      type: "credit",
      total: 44175,
      itemDetails: "",
      note: "",
      status: "Delivered",
    },
    {
      orderNo: "13820",
      customer: "JAYAN MOTORS",
      salesRef: "manjula",
      orderDate: "9/15/2020, 11:52:03 PM",
      type: "credit",
      total: 36795,
      itemDetails: "",
      note: "",
      status: "Delivered",
    },
    // Additional dummy data to demonstrate pagination
    ...Array(30)
      .fill(0)
      .map((_, i) => ({
        orderNo: `${20000 + i}`,
        customer: [
          "SUPREME AUTO PARTS",
          "LATHIKA MOTORS",
          "NEW VISION SPARES",
          "AUTO WORLD",
          "SRI LANKA MOTORS",
        ][i % 5],
        salesRef: ["manjula", "mahesh", "danushka"][i % 3],
        orderDate: "9/16/2020, 10:30:00 AM",
        type: "credit",
        total: 15000 + i * 1000,
        itemDetails: "",
        note: i % 5 === 0 ? "Urgent delivery completed" : "",
        status: "Delivered",
      })),
  ];

  // Filter orders based on search query
  const filteredOrders = deliveredOrders.filter(
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
            {/* Delivered Orders Card */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <h2 className="text-lg font-bold mb-4">Delivered Orders</h2>

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
                          {typeof order.total === "number"
                            ? order.total.toFixed(2)
                            : order.total}
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-indigo-600 text-white py-1 px-4 rounded hover:bg-indigo-700 focus:outline-none cursor-pointer">
                            View
                          </button>
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.note && order.note.length > 15 ? (
                            <div className="flex items-center">
                              <span>{order.note.substring(0, 15)}...</span>
                              <button className="ml-2 bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs">
                                See
                              </button>
                            </div>
                          ) : (
                            order.note
                          )}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded focus:outline-none cursor-pointer">
                            View
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
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-1 rounded ${
                            currentPage === pageNumber
                              ? "bg-blue-700 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
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

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrdersPage;
