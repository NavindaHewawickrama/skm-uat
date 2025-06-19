"use client";

import React from "react";

interface OrderItem {
    description: string;
    unitPrice: string | number;
    quantity: string | number;
    discountPercent: string | number;
}

interface ModalProps {
    open: boolean;
    onClose: () => void;
    orderDetails: OrderItem[];
    trackingNumber?: string | null;
    deliveryPersonName?: string | null;
    deliveryDate?: string | null;
}

const ViewOrderDeliveryStatus: React.FC<ModalProps> = ({ open, onClose, trackingNumber = "", deliveryDate = "", deliveryPersonName = "" }) => {
    // const TrackingNumber = "123456ABC"
    // const DeliveryPerson = "John Doe"
    // const DeliveryDate = "06 / 18 / 2025"

    //console.log(orderDetails);
    console.log(trackingNumber);
    console.log(deliveryDate);

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
                            {/* order details - {orderDetails.orderNo} */}
                        </h4>

                        <p
                            className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-[1.3] hover:text-red-600"
                            onClick={onClose}
                        >
                            <button type="button" className="bg-white rounded-md p-1 sm:p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 cursor-pointer">
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </p>
                    </div>
                    <hr className="border-t-2 border-gray-300 my-3 sm:my-4" />
                    {/* Delivery Details Section */}
                    {/* Delivery Details Section */}
                    {(trackingNumber || deliveryPersonName || deliveryDate) ? (
                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4 shadow-sm">
                            <h5 className="text-md font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c.828 0 1.5-.672 1.5-1.5S12.828 5 12 5s-1.5.672-1.5 1.5S11.172 8 12 8zm0 1.5c-1.104 0-2 .672-2 1.5v.75a.75.75 0 001.5 0V11c0-.276.224-.5.5-.5s.5.224.5.5v.75a.75.75 0 001.5 0V11c0-.828-.896-1.5-2-1.5z" />
                                </svg>
                                Delivery Information
                            </h5>
                            <ul className="space-y-1 text-sm text-blue-900">
                                {trackingNumber && (
                                    <li><span className="font-medium">Tracking Number:</span> {trackingNumber}</li>
                                )}
                                {deliveryPersonName && (
                                    <li><span className="font-medium">Delivery Person:</span> {deliveryPersonName}</li>
                                )}
                                {deliveryDate && (
                                    <li><span className="font-medium">Delivery Date:</span> {new Date(deliveryDate).toLocaleDateString()}</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div className="mb-4 bg-gray-100 text-gray-500 text-sm px-4 py-3 rounded-md">
                            No delivery details available.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewOrderDeliveryStatus;