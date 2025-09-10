"use client";
import React, { useState, useMemo, useEffect } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import ViewOrderEditPopupButton from "@/components/viewOrderEditPopupButton";
import Footer from "@/components/Footer";
import ViewOrderDeliveryStatus from "@/components/ViewOrderDeliveryStatus";
import { MessageCircle, X } from 'lucide-react';

type OrderType = {
  orderNumber: number;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  orderedItems: {
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: string;
    discountPercent: number;
    total: number;
  }[];
  items:
  | string
  | {
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: string;
    discountPercent: number;
    total: number;
  }[];
  specialNote: string;
  rejectReason: string | null;
  status: string;
  delivertPersonName: string | null;
  deliveryDate: string | null;
  invoicedItems: string | null;
  trackingNumber: string | null;
  invoiceNumber: string | null;
  location: string | null; // Optional field for order location
};

type ItemsType = {
  itemCode: string;
  description: string;
  unitPrice: number;
  quantity: string;
  discountPercent: number;
  total: number;
};

const DeliveredOrdersPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveredOrders, setDeliveredOrders] = useState<OrderType[]>([]);
  const [listViewOpen, setListViewOpen] = useState(false);
  const [deliverViewOpen, setDeliveryViewOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<ItemsType[]>([]);
  const [orderTrackingNumber, setOrderTrackingNumber] = useState("");
  const [orderDeliveryPersonName, setOrderDeliverPersonName] = useState("");
  const [orderDeliveryDate, setOrderDeliveryDate] = useState("");
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<number | null>(
    null
  );
  const [selectedOrderInvoiceNumber, setSelectedOrderInvoiceNumber] = useState<string | null>(null);
  const [selectedOrderCustomerName, setSelectedOrderCustomerName] = useState<
    string | null
  >(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  // Fetch pending order data from API
  useEffect(() => {
    const fetchPendingOrderData = async () => {
      try {
        const response = await fetch(`/api/orders/pending`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw Error("Failed to fetch pending order data");
        } else {
          const data = await response.json();
          //console.log(data);
          setPendingOrders(data);
          sessionStorage.setItem("notificationsData", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error fetching pending order data:", err);
      }
    };

    fetchPendingOrderData();
  }, []);

  useEffect(() => {
    setUserName(
      sessionStorage.getItem("userName")
        ? sessionStorage.getItem("userName")
        : ""
    );
    setUserRoleType(
      sessionStorage.getItem("userRoleName")
        ? sessionStorage.getItem("userRoleName")
        : ""
    );
    // const pendingOrderList = sessionStorage.getItem("notificationsData");
    // setPendingOrders(pendingOrderList ? JSON.parse(pendingOrderList) : []);
  }, []);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);



  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/orders/delivered`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw Error("Failed to fetch pending order data");
      } else {
        const data = await response.json();
        console.log(data);
        setDeliveredOrders(data);
      }
    } catch (err) {
      console.error("Error fetching pending order data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch pending order data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    return deliveredOrders.filter(
      (order) =>
        order.orderNumber ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.salesPersonName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredOrders.length / parseInt(entriesPerPage));
  }, [filteredOrders.length, entriesPerPage]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at edges
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleItemDetailsView = (order: OrderType, index: number) => {
    //  console.log(order);
    setSelectedRowIndex(index);
    if (Array.isArray(order.orderedItems)) {
      setSelectedOrderItems(order.orderedItems);
      setSelectedOrderNumber(order.orderNumber);
      setSelectedOrderCustomerName(order.customerName);
    } else {
      setSelectedOrderItems([]);
    }
    setListViewOpen(true);
  };

  const handleInvoicedItemDetailsView = (order: OrderType, index: number) => {
    //console.log(order.invoicedItems);
    setSelectedRowIndex(index);
    if (Array.isArray(order.invoicedItems)) {
      setSelectedOrderItems(order.invoicedItems);
      setSelectedOrderNumber(order.orderNumber);
      setSelectedOrderCustomerName(order.customerName);
      setSelectedOrderInvoiceNumber(order.invoiceNumber);
    } else {
      setSelectedOrderItems([]);
    }
    setListViewOpen(true);
  };

  const handleDeliveryDetailsView = (order: OrderType, index: number) => {
    // setSelectedDeliveryOrder(order);
    // setDeliveryDetailsOpen(true);

    //  console.log(order);
    setSelectedRowIndex(index);
    setOrderTrackingNumber(order.trackingNumber ? order.trackingNumber : "");
    setOrderDeliverPersonName(
      order.delivertPersonName ? order.delivertPersonName : ""
    );
    setOrderDeliveryDate(order.deliveryDate ? order.deliveryDate : "");
    setDeliveryViewOpen(true);
  };

  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };
  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
        <AppBar
          toggleSideNav={toggleSideNav}
          userRole={userRoleType}
          userName={userName}
          notificationData={pendingOrders}
        />
        <div className="flex flex-1 overflow-hidden">
          <SideNav isOpen={sideNavOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">
                Loading Delivered orders data...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
        <AppBar
          toggleSideNav={toggleSideNav}
          userRole={userRoleType}
          userName={userName}
          notificationData={pendingOrders}
        />
        <div className="flex flex-1 overflow-hidden">
          <SideNav isOpen={sideNavOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Error Loading Data
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar
        toggleSideNav={toggleSideNav}
        userRole={userRoleType}
        userName={userName}
        notificationData={pendingOrders}
      />

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
                    onChange={handleEntriesChange}
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

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Order No
                      </th>
                      {userRoleType?.toLowerCase() === "admin" && (
                        <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                          Order Location
                        </th>)}
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
                        Invoiced Item Details
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Note
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-black tracking-wider border">
                        Delivery Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveredOrders.map((order, index) => (
                      <tr key={index}
                        className={`${selectedRowIndex === index
                          ? "bg-blue-100 border-blue-300"
                          : "hover:bg-gray-200"
                          }`}
                      >
                        <td className="px-4 py-3 border text-sm">
                          {order.orderNumber}
                        </td>
                        {userRoleType?.toLowerCase() === "admin" && (
                          <td className="px-4 py-3 border text-sm">
                            {order.location ? order.location : "N/A"}
                          </td>
                        )}
                        <td className="px-4 py-3 border text-sm">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.salesPersonName}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {/* {order.paymentMethodType} */}
                          Default
                        </td>
                        <td className="px-4 py-3 border text-sm text-right">
                          {typeof order.totalAmount === "number"
                            ? Number(
                              order.totalAmount.toFixed(2)
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                            : order.totalAmount}
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button
                            className="bg-blue-900 text-white py-1 px-4 rounded hover:bg-blue-950 focus:outline-none cursor-pointer"
                            onClick={() => handleItemDetailsView(order, index)}
                          >
                            View
                          </button>
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button
                            className="bg-blue-900 text-white py-1 px-4 rounded hover:bg-blue-950 focus:outline-none cursor-pointer"
                            onClick={() => handleInvoicedItemDetailsView(order, index)}
                          >
                            View
                          </button>
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.specialNote && order.specialNote.trim() !== '' ? (
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => setSelectedOrderId(order.orderNumber)}
                                className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                title="View special note"
                              >
                                <MessageCircle size={18} />
                              </button>

                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}

                          {selectedOrderId === order.orderNumber && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50 overflow-auto">
                              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                                <button
                                  onClick={() => setSelectedOrderId(null)}
                                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                  <X size={20} />
                                </button>
                                <h3 className="text-lg font-semibold mb-3">Special Note</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {order.specialNote}
                                </p>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button
                            className="bg-blue-900 hover:bg-blue-950 text-white py-1 px-4 rounded focus:outline-none cursor-pointer"
                            onClick={() => handleDeliveryDetailsView(order, index)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white p-4 mt-4 flex flex-wrap justify-between items-center">
                <div className="text-sm">
                  Showing{" "}
                  {filteredOrders.length > 0
                    ? (currentPage - 1) * parseInt(entriesPerPage) + 1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * parseInt(entriesPerPage),
                    filteredOrders.length
                  )}{" "}
                  of {filteredOrders.length} entries
                </div>
                <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded cursor-pointer ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
                      }`}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === "number" && goToPage(page)}
                      className={`px-3 py-1 border rounded ${page === currentPage
                        ? "bg-blue-500 text-white"
                        : page === "..."
                          ? ""
                          : "hover:bg-gray-100"
                        }`}
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 border rounded cursor-pointer ${currentPage === totalPages || totalPages === 0
                      ? "text-gray-400"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <ViewOrderEditPopupButton open={listViewOpen} onClose={() => setListViewOpen(false)} orderDetails={selectedOrder} />
          <DeliveryDetailsPopup
            open={deliveryDetailsOpen}
            onClose={() => setDeliveryDetailsOpen(false)}
            orderDetails={selectedDeliveryOrder}
          /> */}
          {/* Footer Component */}
          <ViewOrderEditPopupButton
            open={listViewOpen}
            // onClose={() => {
            //   setListViewOpen(false),
            //     setSelectedOrderInvoiceNumber("")
            // }}
            onClose={() => {
              setListViewOpen(false);
              setSelectedOrderInvoiceNumber("");
            }}
            orderDetails={selectedOrderItems}
            orderNumber={selectedOrderNumber ?? 0}
            customerName={selectedOrderCustomerName ?? ""}
            invoiceNumber={selectedOrderInvoiceNumber ?? ""}
          />

          <ViewOrderDeliveryStatus
            open={deliverViewOpen}
            onClose={() => setDeliveryViewOpen(false)}
            orderDetails={selectedOrderItems}
            trackingNumber={orderTrackingNumber}
            deliveryPersonName={orderDeliveryPersonName}
            deliveryDate={orderDeliveryDate}
          />

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrdersPage;
