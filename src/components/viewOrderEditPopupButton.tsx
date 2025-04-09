"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";


interface ModalProps {
  open: boolean;
  onClose: () => void; // Add the onClose function prop
  orderDetails: any
}

const ViewOrderEditPopupButton: React.FC<ModalProps> = ({ open, onClose, orderDetails }) => {
  const router = useRouter();

  // console.log(orderDetails)

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 overflow-auto"
        onClick={onClose}
      >
        <div
          className="min-w-[400px] md:w-[500px] bg-white px-[45px] py-[25px] rounded-sm overflow-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-row justify-between mb-5">
            <h4 className="capitalize font-medium text-2xl">order details - {orderDetails.orderNo}</h4>

            <p
              className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-[1.3] hover:text-red-600 "
              onClick={onClose}
            >
              <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </p>
          </div>
          <hr className="border-t-2 border-gray-300 my-4" />
          <br />
          {/* Items Table */}
          <div className="flex justify-center" >
            <div className="overflow-auto max-h-[400px] p-2 rounded-sm">
              <table className="min-w-full rounded-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {orderDetails.itemDetails.map((item: any, index:any) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.itemName}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.unitPrice}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.discount}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {/* Generate Report Button */}
            <button
              onClick={() => router.push(`/report/${orderDetails.orderNo}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrderEditPopupButton;
