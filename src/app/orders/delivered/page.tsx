"use client";
import React, { useState, useMemo, useEffect } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import ViewOrderEditPopupButton from "@/components/viewOrderEditPopupButton";
import Footer from "@/components/Footer";
// import ViewOrderEditPopupButton from "@/components/viewOrderEditPopupButton";
// import DeliveryDetailsPopup from "@/components/DeliveryDetailsPopup";

type OrderType = {
  orderNumber: string;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  items: string | { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }[];
  specialNote: string;
  rejectedReason: string;
  status: string;
  description?: string;
};

type ItemsType = { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }


const DeliveredOrdersPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);
  // const [listViewOpen, setListViewOpen] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  // const [deliveryDetailsOpen, setDeliveryDetailsOpen] = useState(false);
  // const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveredOrders, setDeliveredOrders] = useState<OrderType[]>([]);
  const [listViewOpen, setListViewOpen] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<ItemsType[]>([]);

  // Sample delivered orders data based on the screenshot
  // const deliveredOrders = [
  //   {
  //     orderNo: "4821",
  //     customer: "ROYAL MOTORS(G)",
  //     salesRef: "manjula",
  //     orderDate: "9/15/2020, 8:58:38 PM",
  //     type: "credit",
  //     total: 327225,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "",
  //     status: "Delivered",
  //     courierService: "prompt",
  //     trackingNo: "mct12859799",
  //     deliveredDate: "9/16/2020",
  //     description: "Delivered on time"
  //   },
  //   {
  //     orderNo: "6476",
  //     customer: "GUNASEKARA BATTERY SHOP",
  //     salesRef: "mahesh",
  //     orderDate: "9/15/2020, 9:34:08 PM",
  //     type: "credit",
  //     total: 7290,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "",
  //     status: "Delivered",
  //     courierService: "prompt",
  //     trackingNo: "mct12859799",
  //     deliveredDate: "9/16/2020",
  //     description: "Delivered on time"
  //   },
  //   {
  //     orderNo: "7327",
  //     customer: "NAMOMARIYANI AUTO SPARES",
  //     salesRef: "mahesh",
  //     orderDate: "9/15/2020, 9:40:42 PM",
  //     type: "credit",
  //     total: 17572.5,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "",
  //     status: "Delivered",
  //     courierService: "prompt",
  //     trackingNo: "mct12859799",
  //     deliveredDate: "9/16/2020",
  //     description: "Delivered on time"
  //   },
  //   {
  //     orderNo: "9577",
  //     customer: "PERERA MOTORS (MAKANDURA)",
  //     salesRef: "mahesh",
  //     orderDate: "9/15/2020, 9:54:32 PM",
  //     type: "credit",
  //     total: 25950,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "aluthiun b...",
  //     status: "Delivered",
  //     courierService: "prompt",
  //     trackingNo: "mct12859799",
  //     deliveredDate: "9/16/2020",
  //     description: "Delivered on time"
  //   },
  //   {
  //     orderNo: "10264",
  //     customer: "PERERA MOTORS (MAKANDURA)",
  //     salesRef: "mahesh",
  //     orderDate: "9/15/2020, 9:58:37 PM",
  //     type: "credit",
  //     total: 17295,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "meka adama danna hadissi",
  //     status: "Delivered",
  //     courierService: "prompt",
  //     trackingNo: "mct12859799",
  //     deliveredDate: "9/16/2020",
  //     description: "Delivered on time"
  //   },
  //   {
  //     orderNo: "12329",
  //     customer: "JAYAN MOTORS",
  //     salesRef: "manjula",
  //     orderDate: "9/15/2020, 11:37:23 PM",
  //     type: "credit",
  //     total: 44175,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "",
  //     status: "Delivered",
  //     courierService: "DHL",
  //     trackingNo: "dhl4529871",
  //     deliveredDate: "9/16/2020",
  //     description: "Left at reception"
  //   },
  //   {
  //     orderNo: "13820",
  //     customer: "JAYAN MOTORS",
  //     salesRef: "manjula",
  //     orderDate: "9/15/2020, 11:52:03 PM",
  //     type: "credit",
  //     total: 36795,
  //     itemDetails: [{ itemName: "Gel Pump", unitPrice: "500", quantity: "500", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "8", discount: "12", total: "250.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Tires", unitPrice: "100", quantity: "5", discount: "12", total: "2500.00" }, { itemName: "Oil Pump", unitPrice: "500", quantity: "5", discount: "12", total: "2500.00" }],
  //     note: "",
  //     status: "Delivered",
  //     courierService: "prompt",
  //     trackingNo: "mct12859799",
  //     deliveredDate: "9/16/2020",
  //     description: "Delivered on time"
  //   },
  //   // Additional dummy data to demonstrate pagination
  //   ...Array(30)
  //     .fill(0)
  //     .map((_, i) => ({
  //       orderNo: `${20000 + i}`,
  //       customer: [
  //         "SUPREME AUTO PARTS",
  //         "LATHIKA MOTORS",
  //         "NEW VISION SPARES",
  //         "AUTO WORLD",
  //         "SRI LANKA MOTORS",
  //       ][i % 5],
  //       salesRef: ["manjula", "mahesh", "danushka"][i % 3],
  //       orderDate: "9/16/2020, 10:30:00 AM",
  //       type: "credit",
  //       total: 15000 + i * 1000,
  //       itemDetails: "",
  //       note: i % 5 === 0 ? "Urgent delivery completed" : "",
  //       status: "Delivered",
  //     })),
  // ];

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

  const handleItemDetailsView = (order: OrderType) => {
    console.log(order);

    if (Array.isArray(order.items)) {
      setSelectedOrderItems(order.items);
    } else {
      setSelectedOrderItems([]);
    }
    setListViewOpen(true);
  };

  const handleDeliveryDetailsView = (order: OrderType) => {
    // setSelectedDeliveryOrder(order);
    // setDeliveryDetailsOpen(true);
    console.log(order);
  };

  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };
  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
        <AppBar toggleSideNav={toggleSideNav} />
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
        <AppBar toggleSideNav={toggleSideNav} />
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
                        Delivery Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveredOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border text-sm">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.salesPersonName}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.orderDate}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.paymentMethodType}
                        </td>
                        <td className="px-4 py-3 border text-sm text-right">
                          {typeof order.totalAmount === "number"
                            ? order.totalAmount.toFixed(2)
                            : order.totalAmount}
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-blue-900 text-white py-1 px-4 rounded hover:bg-blue-950 focus:outline-none cursor-pointer" onClick={() => handleItemDetailsView(order)}>
                            View
                          </button>
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          {order.specialNote && order.specialNote.length > 15 ? (
                            <div className="flex items-center">
                              <span>{order.specialNote.substring(0, 15)}...</span>
                              <button className="ml-2 bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs">
                                See
                              </button>
                            </div>
                          ) : (
                            order.specialNote
                          )}
                        </td>
                        <td className="px-4 py-3 border text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border text-sm text-center">
                          <button className="bg-blue-900 hover:bg-blue-950 text-white py-1 px-4 rounded focus:outline-none cursor-pointer" onClick={() => handleDeliveryDetailsView(order)}>
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
            onClose={() => setListViewOpen(false)}
            orderDetails={selectedOrderItems}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrdersPage;
