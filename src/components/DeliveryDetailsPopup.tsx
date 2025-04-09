"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DeliveryDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  orderDetails: any;
}

const DeliveryDetailsPopup: React.FC<DeliveryDetailsPopupProps> = ({
  open,
  onClose,
  orderDetails,
}) => {
  const router = useRouter();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 overflow-auto p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-sm overflow-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-row justify-between mb-3 sm:mb-5">
            <h4 className="capitalize font-medium text-lg sm:text-xl md:text-2xl truncate">
              Delivery Details - {orderDetails.orderNo}
            </h4>

            <p
              className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 hover:text-red-600"
              onClick={onClose}
            >
              <button
                type="button"
                className="bg-white rounded-md p-1 sm:p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </p>
          </div>
          <hr className="border-t-2 border-gray-300 my-3 sm:my-4" />

          {/* Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-medium mb-2">Courier Service/Person:</p>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-sm bg-gray-50"
                placeholder="prompt"
                readOnly
                value={orderDetails.courierService || "prompt"}
              />
            </div>
            <div>
              <p className="font-medium mb-2">Tracking No:</p>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-sm bg-gray-50"
                placeholder="mct12859799"
                readOnly
                value={orderDetails.trackingNo || "mct12859799"}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium mb-2">Delivered Date:</p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-sm bg-gray-50"
              placeholder={orderDetails.orderDate}
              readOnly
              value={orderDetails.deliveredDate || orderDetails.orderDate}
            />
          </div>

          <div className="mb-4">
            <p className="font-medium mb-2">Description:</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-sm bg-gray-50 h-24"
              placeholder="Delivery description..."
              readOnly
              value={orderDetails.description || ""}
            />
          </div>

          {/* Order Summary */}
          {/* <div className="bg-gray-100 p-4 rounded-sm mb-4">
            <h5 className="font-medium mb-2">Order Summary</h5>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm">Customer:</p>
              <p className="text-sm font-medium">{orderDetails.customer}</p>
              
              <p className="text-sm">Sales Ref:</p>
              <p className="text-sm font-medium">{orderDetails.salesRef}</p>
              
              <p className="text-sm">Order Date:</p>
              <p className="text-sm font-medium">{orderDetails.orderDate}</p>
              
              <p className="text-sm">Type:</p>
              <p className="text-sm font-medium">{orderDetails.type}</p>
              
              <p className="text-sm">Total:</p>
              <p className="text-sm font-medium">
                {typeof orderDetails.total === "number"
                  ? orderDetails.total.toFixed(2)
                  : orderDetails.total}
              </p>
              
              <p className="text-sm">Status:</p>
              <p className="text-sm font-medium">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {orderDetails.status}
                </span>
              </p>
            </div>
          </div> */}

          <div className="flex gap-2 mt-4 sm:mt-6">
            {/* View Items Button */}
            {/* <button
              onClick={() => router.push(`/order/items/${orderDetails.orderNo}`)}
              className="bg-blue-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-950 text-xs sm:text-sm cursor-pointer"
            >
              View Items
            </button> */}
            
            {/* Generate Report Button */}
            <button
              onClick={() => router.push(`/report/${orderDetails.orderNo}`)}
              className="bg-blue-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-950 text-xs sm:text-sm cursor-pointer"
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetailsPopup;