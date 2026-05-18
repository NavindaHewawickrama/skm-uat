"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../components/Appbar";
import SideNav from "../../components/Sidenav";
import Footer from "../../components/Footer";

const ReportsOutstandings = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : "");
    setUserRoleType(sessionStorage.getItem("userRoleName") ? sessionStorage.getItem("userRoleName") : "");
  }, []);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(e.target.value);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} userName={userName} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Reports Outstandings Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {/* Customer Filter Card - Matching the screenshot */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-base font-medium mb-4">Customer :</h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative">
                  <select
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                    className="block appearance-none w-full sm:w-[300px] bg-white border border-gray-300 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                    style={{ minWidth: "300px" }}
                  >
                    <option value="">Select Customer</option>
                    <option value="customer1">Customer 1</option>
                    <option value="customer2">Customer 2</option>
                    <option value="customer3">Customer 3</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center sm:ml-4">
                  <input
                    id="filter-all"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="filter-all"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    All
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer sm:ml-4"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Placeholder for additional content - keeping the page simple as in screenshot */}
            <div className="mt-6">
              {/* This space is empty in your screenshot */}
              {/* Add any additional content here if needed */}
            </div>
          </div>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ReportsOutstandings;
