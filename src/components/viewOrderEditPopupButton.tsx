"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";


interface ModalProps {
  open: boolean;
  onClose: () => void; // Add the onClose function prop
}

const ViewOrderEditPopupButton: React.FC<ModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  const [nextModel, setNextModel] = useState(true);
  const [changeModel, setChangeModel] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [resendAttempts, setResendAttempts] = useState(3); // Initialize resend attempts
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);



  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50"
        onClick={onClose}
      >
        <div
          className="min-w-[400px] md:w-[500px] bg-white px-[45px] py-[25px] rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-row justify-between">
            <h4 className="capitalize font-medium text-2xl">order details</h4>
            <p
              className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-[1.3] hover:text-red-600 "
              onClick={onClose}
            >
              <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrderEditPopupButton;
