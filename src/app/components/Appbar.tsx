"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";


interface AppBarProps {
  toggleSideNav: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ toggleSideNav }) => {
  return (
    <div className="w-full bg-blue-900 text-white h-18 flex items-center justify-between px-4">
      {/* Mobile menu toggle */}
      <button 
        className="lg:hidden p-2" 
        onClick={toggleSideNav}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Division label */}
      <div className="p-4 flex justify-center">
        <Image
        className="hidden lg:block"
          src="/images/logo-d.png"
          alt="Sri Kanta Motors"
          width={130}
          height={50}
        />
      </div>

      
      {/* Right side icons */}
      <div className="flex items-center space-x-4">
      <div className="hidden lg:block lg:ml-4">B & C DIVISION</div>
        {/* Notification bell */}
        <div className="relative">


          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 bg-green-500 rounded-full w-2 h-2"></span>
        </div>
        
        {/* Admin label */}
        <div>ADMIN</div>
        
        {/* User profile icon */}
        <div className="rounded-full bg-red-500 w-8 h-8 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AppBar;