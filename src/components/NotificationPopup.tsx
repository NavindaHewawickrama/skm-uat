"use client";

import React, { useEffect, useState } from "react";

type OrderedItem = {
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: string;
    discountPercent: number;
    total: number;
};

type NotificationDataType = {
    orderNumber: number;
    customerName: string;
    salesPersonName: string;
    orderDate: string;
    paymentMethodType: string;
    totalAmount: number;
    orderedItems: OrderedItem[];
    specialNote: string;
    rejectReason: string | null;
    status: string;
    delivertPersonName: string | null;
    deliveryDate: string | null;
    invoicedItems: any | null;
    trackingNumber: string | null;
};

interface ModalProps {
    open: boolean;
    onClose: () => void;
    notificationData?: NotificationDataType[];
}

const NotificationPopup: React.FC<ModalProps> = ({
    open,
    onClose,
    notificationData = [],
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !open) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        const lower = status.toLowerCase();
        if (lower === "pending") return "bg-yellow-100 text-yellow-800";
        if (lower === "approved") return "bg-green-100 text-green-800";
        if (lower === "rejected") return "bg-red-100 text-red-800";
        if (lower === "completed") return "bg-blue-100 text-blue-800";
        return "bg-gray-100 text-gray-800";
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 overflow-auto p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl bg-white rounded-xl p-6 shadow-2xl overflow-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold text-gray-800">Order Notifications</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {notificationData.length === 0 ? (
                    <p className="text-gray-500 text-center">No notifications available.</p>
                ) : (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        {notificationData.map((order, i) => (
                            <div
                                key={order.orderNumber}
                                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        Order #{order.orderNumber}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="space-y-1">
                                        <p>
                                            <strong>Customer:</strong> {order.customerName}
                                        </p>
                                        <p>
                                            <strong>Sales Person:</strong> {order.salesPersonName}
                                        </p>
                                        <p>
                                            <strong>Order Date:</strong> {formatDate(order.orderDate)}
                                        </p>
                                        <p>
                                            <strong>Payment Method:</strong> {order.paymentMethodType}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p>
                                            <strong>Total Amount:</strong>{" "}
                                            <span className="text-green-700 font-semibold">
                                                ${order.totalAmount.toLocaleString()}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Tracking Number:</strong>{" "}
                                            {order.trackingNumber || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}
                                        </p>
                                        <p>
                                            <strong>Delivery Person:</strong>{" "}
                                            {order.delivertPersonName || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-right mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
