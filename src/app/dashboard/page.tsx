"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../components/Appbar";
import SideNav from "../../components/Sidenav";
import Footer from "../../components/Footer";
import SalesChart from "@/components/SalesChart";

interface Notices {
  originalName: string;
  type: string;
  url: string;
}

interface pieChartData {
  deliveredCount: number;
  rejectedCount: number;
  pendingCount: number;
}

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

const Dashboard = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [notices, setNotices] = useState<Notices[]>([]);
  const [user, setUser] = useState("");
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [dataPieChart, setDataPieChart] = useState<pieChartData>({
    deliveredCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
  });


  useEffect(() => {
    fetchUserDetails();
    fetchNotices();
    fetchPieChartDetails();
  }, [])
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

  const fetchPieChartDetails = async () => {
    try {
      const response = await fetch('/api/dashboard/pieChart', {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw Error("Failed to fetch data");
      } else {
        const data = await response.json();
        console.log("Pie Chart Data:", data);
        dataPieChart.deliveredCount = data.deliveredCount || 0;
        dataPieChart.rejectedCount = data.rejectedCount || 0;
        dataPieChart.pendingCount = data.pendingCount || 0;
        setDataPieChart(dataPieChart);
      }
    } catch (err) {
      console.error("Error fetching pie chart data:", err);
    }
  }

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/dashboard/userDetails', {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw Error("Failed to fetch data");
      } else {
        const data = await response.json();
        //    console.log("Welcome to SKM Sales App...", data.firstName);
        //  console.log(data);
        switch (data.userRoleId) {
          case 1:
            setUser("ADMIN");
            sessionStorage.setItem("userRoleName", "ADMIN");
            break;
          case 3:
            setUser("SALES USER")
            sessionStorage.setItem("userRoleName", "SALES USER");
            break;
          case 4:
            setUser("SALES CORDINATOR");
            sessionStorage.setItem("userRoleName", "SALES COORDINATOR");
            break;
          default:
            setUser("USER");
            sessionStorage.setItem("userRoleName", "USER");
            break;
        }
      }
    } catch (err) {
      console.error("Error fetching pending order data:", err);
    }
  }

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices/getNotice', {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw Error("Failed to fetch data");
      } else {
        const data = await response.json();
        //   console.log("Welcome to SKM Sales App...", data);
        setNotices(data || []);
      }
    } catch (err) {
      console.error("Error fetching pending order data:", err);
      setNotices([]);
    }
  }

  const getTodaysDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(`/api/notices/downloadNotice?documentUrl=${encodeURIComponent(url)}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition") || "";
      const fileNameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
      const fileName = fileNameMatch ? fileNameMatch[1] : "downloaded_file";

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up

    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed");
    }
  };

  // file type icon getter
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} userRole={user} notificationData={pendingOrders} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Dashboard Content */}
        <div className="flex flex-col flex-grow overflow-auto">
          <div className="flex-1 p-4 lg:p-6 md:flex gap-4">
            {/* Sales Order Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-full md:w-1/2 sm:w-full">
              <h2 className="text-xl font-semibold mb-2">Total Sales Order &apos; s</h2>
              <SalesChart pieChartData={dataPieChart} />
            </div>

            {/* Enhanced Notices card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-full md:w-1/2 sm:w-full">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📋</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Notices</h2>
                    <p className="text-sm text-gray-500">{getTodaysDate()}</p>
                  </div>
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-blue-600 text-sm font-medium">
                    {notices.length} {notices.length === 1 ? 'notice' : 'notices'}
                  </span>
                </div>
              </div>

              {/* Notices List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {/* File Icon */}
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-hover:border-blue-300 transition-colors">
                            <span className="text-xl">{getFileIcon(notice.originalName)}</span>
                          </div>

                          {/* Notice Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                Notice {index + 1}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 truncate">
                              {notice.originalName}
                            </h3>
                          </div>
                        </div>

                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(notice.url)}
                          className="ml-3 flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📋</span>
                    </div>
                    <h3 className="text-gray-600 font-medium mb-2">No notices available</h3>
                    <p className="text-gray-500 text-sm">
                      New notices will appear here when they become available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;