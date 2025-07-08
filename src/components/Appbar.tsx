"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NotificationPopup from "./NotificationPopup";
import { useRouter } from "next/navigation";

// Updated type to match your actual data structure
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
  specialNote: string;
  rejectReason: string | null;
  status: string;
  delivertPersonName: string | null;
  deliveryDate: string | null;
  invoicedItems: string | null;
  trackingNumber: string | null;
};

// Keep the original OrderType for backward compatibility if needed elsewhere
// type OrderType = {
//   orderNumber: string;
//   customerName: string;
//   salesPersonName: string;
//   orderDate: string;
//   paymentMethodType: string;
//   totalAmount: number;
//   items: string | { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }[];
//   specialNote: string;
//   rejectedReason: string;
//   status: string;
//   description?: string;
// };

interface AppBarProps {
  toggleSideNav: () => void;
  userRole: string | null;
  userName: string | null;
  notificationData?: OrderType[]; // Updated to use the correct type
}

const AppBar: React.FC<AppBarProps> = ({
  toggleSideNav,
  userRole,
  userName,
  notificationData,
}) => {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [alertDropdownOpen, setAlertDropdownOpen] = useState(false);
  const alertDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [openNotificationPopup, setOpenNotificationPopup] = useState(false);
  const [notificationDataState, setNotificationDataState] = useState<
    OrderType[]
  >([]);

  //console.log(userName);

  useEffect(() => {
    // Initialize notification data state if provided
    if (notificationData) {
      setNotificationDataState(notificationData);
    }
  }, [notificationData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        alertDropdownRef.current &&
        !alertDropdownRef.current.contains(target)
      ) {
        setAlertDropdownOpen(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAlertDropdown = () => {
    setAlertDropdownOpen(!alertDropdownOpen);
    setProfileDropdownOpen(false); // close the other
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setAlertDropdownOpen(false); // close the other
  };

  const handleNotificationPopupOpen = () => {
    setOpenNotificationPopup(true);
  };

  const handleLogoutClick = async () => {
    setProfileDropdownOpen(false);
    try {
      await fetch("/api/logout");
      // Optionally clear any local/session storage
      sessionStorage.clear();
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleReserPasswordClicked = () => {
    setProfileDropdownOpen(false);
    router.push("/user/ResetPassword");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get notification count
  const notificationCount = notificationDataState.length;

  // Filter notifications to show (e.g., only pending ones, or recent ones)
  const getDisplayNotifications = () => {
    return notificationDataState.slice(0, 3); // Show only first 3 notifications in dropdown
  };

  return (
    <div className="w-full bg-blue-900 text-white h-18 flex items-center justify-between px-4">
      {/* Mobile menu toggle */}
      <button className="lg:hidden p-2" onClick={toggleSideNav}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Division label */}
      <div className="p-4 flex justify-center">
        <Link href="/dashboard">
          <Image
            className="hidden lg:block cursor-pointer"
            src="/images/logo-d.png"
            alt="Sri Kanta Motors"
            width={130}
            height={50}
          />
        </Link>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* <div className="hidden lg:block lg:ml-4 font-bold">B & C DIVISION</div> */}
        {/* Notification bell */}
        <div className="relative" ref={alertDropdownRef}>
          <div className="cursor-pointer" onClick={toggleAlertDropdown}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Dynamic Notification Count Badge */}
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold rounded-sm w-4 h-4 flex items-center justify-center">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>

          {/* Alert Dropdown Menu */}
          {alertDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
              <div className="border-b border-gray-200 bg-gray-700">
                <div className="px-4 py-2 text-white font-medium">
                  Notifications ({notificationCount})
                </div>
              </div>
              <div className="p-1 max-h-64 overflow-y-auto">
                {notificationDataState.length === 0 ? (
                  <div className="text-gray-500 text-sm p-4 text-center">
                    No notifications
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {getDisplayNotifications().map((notification, index) => (
                      <li
                        key={`${notification.orderNumber}-${index}`}
                        className="text-gray-800 text-sm hover:bg-gray-200 p-3 border-b border-gray-100"
                      >
                        <div className="font-medium text-blue-800">
                          Order #{notification.orderNumber} -{" "}
                          {notification.status}
                        </div>
                        {/* <div className="text-gray-600 text-xs mt-1">
                          Customer: {notification.customerName}
                        </div> */}
                        {/* <div className="text-gray-600 text-xs">
                          Amount: ${notification.totalAmount.toLocaleString()}
                        </div> */}
                        <div className="text-gray-500 text-xs mt-1">
                          {formatDate(notification.orderDate)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-gray-200 p-2">
                <button
                  className="w-[50%] bg-blue-900 text-white rounded-md py-2 hover:bg-blue-700"
                  onClick={handleNotificationPopupOpen}
                  disabled={notificationCount === 0}
                >
                  View All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User name display
        <div className="font-bold">{userName ? userName : ""}</div>

        {/* Admin label */}
        {/* <div className="font-bold">{userRole ? userRole : ""}</div>  */}
        {/* User name display */}
        <div className="space-y-1">
          {/* User name display */}
          <div className="font-bold text-xl">{userName ? userName : ""}</div>

          {/* User role as subtitle */}
          <div className="text-xs text-gray-300 font-medium mt-[-5]">
            {userRole ? userRole : ""}
          </div>
        </div>

        {/* User profile icon with dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <div
            className="rounded-full bg-red-500 w-8 h-8 flex items-center justify-center text-white cursor-pointer"
            onClick={toggleProfileDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <div className="border-b border-gray-200 bg-gray-700">
                <div className="px-4 py-2 text-white font-medium">Welcome</div>
              </div>
              <div className="py-1">
                <button
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center cursor-pointer"
                  onClick={handleReserPasswordClicked}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  Reset Password
                </button>
                <button
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center cursor-pointer"
                  onClick={handleLogoutClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <NotificationPopup
          open={openNotificationPopup}
          onClose={() => setOpenNotificationPopup(false)}
          notificationData={notificationDataState} // Pass the notification data to popup
        />
      </div>
    </div>
  );
};

export default AppBar;
