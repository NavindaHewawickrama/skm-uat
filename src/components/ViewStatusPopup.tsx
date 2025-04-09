"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    status: any;
}

const ViewStatus: React.FC<ModalProps> = ({ open, onClose, status }) => {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState(status);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [deliveryPerson, setDeliveryPerson] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [specialNote, setSpecialNote] = useState("");

    if (!open) return null;

    const handleUpdate = () => {
        console.log("Updated status:", selectedStatus);
        onClose();
    };

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
                        <h4 className="capitalize font-medium text-2xl">Order Status</h4>

                        <p
                            className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-[1.3] hover:text-red-600"
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

                    {/* Dropdown for status selection */}
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Status
                        </label>
                        <select
                            id="status"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="block w-2xs border border-gray-300 rounded-md p-2"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Conditional Inputs for Delivered Status */}
                    {selectedStatus === "delivered" && (
                        <div className="space-y-4 mb-2">
                            <div>
                                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tracking Number
                                </label>
                                <input
                                    type="text"
                                    id="trackingNumber"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="deliveryPerson" className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Person Name
                                </label>
                                <input
                                    type="text"
                                    id="deliveryPerson"
                                    value={deliveryPerson}
                                    onChange={(e) => setDeliveryPerson(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Date
                                </label>
                                <input
                                    type="date"
                                    id="deliveryDate"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    className="block w-3xs border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Date
                                </label>
                                <textarea
                                    id="description"
                                    value={specialNote}
                                    onChange={(e) => setSpecialNote(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Update Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleUpdate}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewStatus;