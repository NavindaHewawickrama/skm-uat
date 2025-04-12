"use client";

import React from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

const NotificationPopup: React.FC<ModalProps> = ({ open, onClose }) => {

    if (!open) return null;


    return (
        <>
        <div
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 overflow-auto p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-sm overflow-auto"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="flex flex-row justify-between mb-3 sm:mb-5">
                        <h4 className="capitalize font-medium text-xl sm:text-2xl text-gray-500">
                            Notifications - April 14 2025
                        </h4>
                    </div>
                    <hr className="border-t-2 border-gray-300 my-3 sm:my-4" />
                </div>
            </div>
        </>
    );
};

export default NotificationPopup;
