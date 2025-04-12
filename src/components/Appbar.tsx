"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface AppBarProps {
  toggleSideNav: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ toggleSideNav }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [alertDropdownOpen, setAlertDropdownOpen] = useState(false);
  const alertDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);


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
        <div className="hidden lg:block lg:ml-4 font-bold">B & C DIVISION</div>
        {/* Notification bell */}
        <div className="relative" ref={alertDropdownRef}>
          <div
            className="cursor-pointer"
            onClick={toggleAlertDropdown}
          >
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
            <span className="absolute top-0 right-0 bg-green-500 rounded-full w-2 h-2"></span>
          </div>

          {/* Alert Dropdown Menu */}
          {alertDropdownOpen && (
            <div className="absolute right-0 mt-2 w-55 bg-white rounded-md shadow-lg z-50">
              <div className="border-b border-gray-200 bg-gray-700">
                <div className="px-4 py-2 text-white font-medium">
                  Notifications
                </div>
              </div>
              <div className="py-1">
                <Link href="/user/ResetPassword">
                  <button
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center cursor-pointer"
                    onClick={() => {
                      setAlertDropdownOpen(false);
                      // Add reset password logic here
                    }}
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
                    Hi
                  </button>
                </Link>
                <Link href="/">
                  <button
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center cursor-pointer"
                    onClick={() => {
                      setAlertDropdownOpen(false);
                    }}
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
                    Hi Hi
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin label */}
        <div className="font-bold">ADMIN</div>

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
                <div className="px-4 py-2 text-white font-medium">
                  Welcome
                </div>
              </div>
              <div className="py-1">
                <Link href="/user/ResetPassword">
                  <button
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center cursor-pointer"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      // Add reset password logic here
                    }}
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
                </Link>
                <Link href="/">
                  <button
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left flex items-center cursor-pointer"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                    }}
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
                </Link>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default AppBar;
