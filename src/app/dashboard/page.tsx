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

const Dashboard = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [notices, setNotices] = useState<Notices[]>([]);

  useEffect(() => {
    fetchUserDetails();
    fetchNotices();
  }, [])

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
        console.log("Welcome to SKM Sales App...", data.firstName);
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
        console.log("Welcome to SKM Sales App...", data);
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

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} />

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
              <SalesChart deliveredCount={18898} />
            </div>

            {/* Notices card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-full md:w-1/2 sm:w-full">
              <h2 className="text-xl font-semibold mb-2">Notices [{getTodaysDate()}]</h2>
              <ul className="space-y-2">
                {notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <div key={index}>
                      <a
                        href={notice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        📄 <strong> Notice {index + 1}</strong> -  {notice.originalName}
                      </a>
                    </div>
                  ))
                ) : (
                  <div>No notices available</div>
                )}
              </ul>
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
