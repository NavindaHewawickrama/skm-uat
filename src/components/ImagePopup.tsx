"use client";

import React from "react";


interface ModalProps {
    open: boolean;
    onClose: () => void;
    image: { src: string; width: number; height: number };
}

const ImagePopup: React.FC<ModalProps> = ({ open, onClose, image }) => {

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
                        <h4 className="capitalize font-medium text-xl sm:text-2xl">
                            Product Image
                        </h4>

                        <p
                            className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-[1.3] hover:text-red-600"
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
                    {/* Display the image */}
                    <div className="flex justify-center">
                        <img
                            src={image.src}
                            alt="Product"
                            width={image.width}
                            height={image.height}
                            className="rounded-md"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImagePopup;
