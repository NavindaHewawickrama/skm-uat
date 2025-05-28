"use client";
import React, { useState } from "react";
import AppBar from "../../components/Appbar";
import SideNav from "../../components/Sidenav";
import Footer from "../../components/Footer";
import SalesChart from "@/components/SalesChart";

const Dashboard = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);

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
          <div className="flex-1 p-4 lg:p-6">
            {/* Sales Order Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-full md:w-1/2 sm:w-full">
              <h2 className="text-xl font-semibold mb-2">Total Sales Order &apos s</h2>
              <SalesChart deliveredCount={18898} />
            </div>

            {/* Notices card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-full md:w-1/2 sm:w-full">
              <h2 className="text-xl font-semibold mb-2">Notices [March 14 2024 - April 14 2025]</h2>
              <ul className="space-y-2">
                {/* Replace these URLs with your API response or static links */}
                {[
                  { name: "Notice 1 - Holiday Schedule", file: "/documents/nutrients-15-00155.pdf" },
                  { name: "Notice 2 - Meeting Agenda", file: "/documents/s41598-025-88963-9 (1).pdf" },
                ].map((doc, index) => (
                  <li key={index}>
                    <a
                     // href={`/view-pdf?file=${encodeURIComponent(doc.file)}`}
                     href={doc.file}
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      📄 {doc.name}
                    </a>
                  </li>
                ))}
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
