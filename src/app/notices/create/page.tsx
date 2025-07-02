"use client";
import React, { useState, useRef, useEffect } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import Alert from "../../../components/Alert";

interface FormErrors {
  notice?: string;
}

interface NoticeData {
  title: string;
  description: string;
  document: File | null;
}

// interface UploadedFile {
//   name: string;
//   size: number;
//   type: string;
// }

type OrderType = {
  orderNumber: number;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  orderedItems: { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }[];
  items: string | { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }[];
  specialNote: string;
  rejectReason: string | null;
  status: string;
  delivertPersonName: string | null;
  deliveryDate: string | null;
  invoicedItems: string | null;
  trackingNumber: string | null;
  rejectedReason: string;
  description?: string;
};

const CreateNoticePage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [noticeData, setNoticeData] = useState<NoticeData>({
    title: "",
    description: "",
    document: null,
  });

  console.log(noticeData);

  //const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userRoleType, setUserRoleType] = useState<string | null>(null);

  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : "");
    setUserRoleType(sessionStorage.getItem("userRoleName") ? sessionStorage.getItem("userRoleName") : "");
    const pendingOrderList = sessionStorage.getItem("notificationsData");
    setPendingOrders(pendingOrderList ? JSON.parse(pendingOrderList) : []);
  }, []);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleShowAlert = (
    type: React.SetStateAction<string>,
    message: React.SetStateAction<string>
  ) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      // Filter for only PDF and Word documents
      const isValidFile =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      if (!isValidFile) {
        setErrors((prev) => ({
          ...prev,
          notice: "Only PDF and Word documents are allowed",
        }));
        return;
      }
      setUploadedFile(file);
      // handleNoticeInputChange("document", file);
      //   console.log(noticeData);
      setNoticeData((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setNoticeData((prev) => ({
      ...prev,
      document: null,
    }));
  };

  const handleCreateNotice = async () => {
    if (!uploadedFile) {
      setErrors((prev) => ({
        ...prev,
        notice: "Document is required",
      }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Document", uploadedFile); // Use uploadedFile (the actual File object)

      const response = await fetch("/api/notices/saveNotice", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        handleShowAlert("success", "Document uploaded successfully!");

        // Reset form
        setNoticeData({
          title: "",
          description: "",
          document: null,
        });
        setUploadedFile(null);
        setErrors({});
      } else {
        setTimeout(() => {
          setErrors((prev) => ({
            ...prev,
            notice: result.error || "Failed to upload document",
          }));
        }, 2000);
        handleShowAlert("error", "Failed to upload document!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          notice: "Failed to upload document. Please try again.",
        }));
      }, 2000);
      handleShowAlert("error", "Falied to upload document!");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} userName={userName} notificationData={pendingOrders} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-auto">
        {showAlert && (
          <Alert message={alertMessage} type={alertType} duration={5000} />
        )}
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Content Area */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Notice Area with Document Upload */}
          <div className="bg-white p-6 rounded shadow lg:w-[75%] mt-4">
            <h2 className="text-xl font-bold mb-6">Create Notices</h2>

            {/* Document Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Documents :
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  // multiple
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 flex items-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Files
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  Only PDF and Word documents (.pdf, .doc, .docx)
                </span>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFile && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">
                  Uploaded Document:
                </h3>
                <div className="bg-gray-50 rounded border border-gray-200 p-2">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm">{uploadedFile.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({(uploadedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div>
              {errors.notice && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.notice}
                </div>
              )}
            </div>

            {/* Notice Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 cursor-pointer"
                onClick={handleCreateNotice}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default CreateNoticePage;
