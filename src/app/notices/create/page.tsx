"use client";
import React, { useState, useRef } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";


interface FormErrors {
  notice?: string;
}

interface NoticeData {
  title: string;
  description: string;
  documents: File[];
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const CreateNoticePage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [noticeData, setNoticeData] = useState<NoticeData>({
    title: "",
    description: "",
    documents: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleNoticeInputChange = (
    field: keyof NoticeData,
    value: string | File[]
  ) => {
    if (field === "documents" && Array.isArray(value)) {
      setNoticeData(prev => ({
        ...prev,
        documents: [...prev.documents, ...value]
      }));

      // Also update the uploadedFiles state for display
      const newFiles = Array.from(value).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } else {
      setNoticeData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear notice error if it exists
    if (errors.notice) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.notice;
        return newErrors;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Filter for only PDF and Word documents
      const validFiles = files.filter(file => 
        file.type === "application/pdf" || 
        file.type === "application/msword" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      
      if (validFiles.length !== files.length) {
        setErrors(prev => ({
          ...prev,
          notice: "Only PDF and Word documents are allowed"
        }));
      }
      
      if (validFiles.length > 0) {
        handleNoticeInputChange("documents", validFiles);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setNoticeData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleCreateNotice = () => {
    if (!noticeData.title) {
      setErrors(prev => ({
        ...prev,
        notice: "Notice title is required"
      }));
      return;
    }

    // Here you would handle the notice creation logic
    // For now, we'll just reset the form
    alert(`Notice "${noticeData.title}" created with ${noticeData.documents.length} document(s)`);
    
    // Reset notice form
    setNoticeData({
      title: "",
      description: "",
      documents: [],
    });
    setUploadedFiles([]);
  };

  const handleNoticeReset = () => {
    setNoticeData({
      title: "",
      description: "",
      documents: [],
    });
    setUploadedFiles([]);
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors.notice;
      return newErrors;
    });
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-auto">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

          {/* Notice Area with Document Upload */}
          <div className="bg-white p-6 rounded shadow lg:w-[75%] mt-4">
            <h2 className="text-xl font-bold mb-6">Create Notices</h2>

            {/* Document Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Upload Documents :</label>
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  multiple
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 flex items-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Files
                </button>
                <span className="ml-3 text-sm text-gray-500">Only PDF and Word documents (.pdf, .doc, .docx)</span>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Uploaded Documents:</h3>
                <ul className="bg-gray-50 rounded border border-gray-200 p-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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