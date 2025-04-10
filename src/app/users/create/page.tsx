"use client";
import React, { useState, useRef } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";

interface UserData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  posName: string;
  email: string;
  telephone: string;
  role: string;
  isActive: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
  posName?: string;
  email?: string;
  telephone?: string;
  role?: string;
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

const CreateUserPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    posName: "",
    email: "",
    telephone: "",
    role: "",
    isActive: false,
  });

  const [noticeData, setNoticeData] = useState<NoticeData>({
    title: "",
    description: "",
    documents: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleInputChange = (
    field: keyof UserData,
    value: string | boolean
  ) => {
    // Clear error when field is modified
    if (field in errors) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
    
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!userData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!userData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Re Type Password is required";
      isValid = false;
    }

    if (!userData.firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!userData.lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!userData.posName) {
      newErrors.posName = "POS Name is required";
      isValid = false;
    }

    if (!userData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!userData.telephone) {
      newErrors.telephone = "Telephone Number is required";
      isValid = false;
    }

    if (!userData.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateUser = () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Add user to list
    setUsersList([...usersList, userData]);

    // Reset form and errors
    setUserData({
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      posName: "",
      email: "",
      telephone: "",
      role: "",
      isActive: false,
    });
    setErrors({});
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

  const handleReset = () => {
    setUserData({
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      posName: "",
      email: "",
      telephone: "",
      role: "",
      isActive: false,
    });
    setErrors({});
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

  const toggleUsersList = () => {
    setShowUsersList(!showUsersList);
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
          <div className="bg-white p-6 rounded shadow lg:w-[75%]">
            <h2 className="text-xl font-bold mb-6">Create User</h2>

            {/* General error message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* User Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">User Name :</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Username"
                value={userData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password :</label>
              <input
                type="password"
                className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Password"
                value={userData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Re-Type Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Re-Type Password :
              </label>
              <input
                type="password"
                className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Re-Type Password"
                value={userData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">First Name :</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="First Name"
                value={userData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Last Name :</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Last Name"
                value={userData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* POS Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">POS Name :</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.posName ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Contact Name Of POS System"
                value={userData.posName}
                onChange={(e) => handleInputChange("posName", e.target.value)}
              />
              {errors.posName && (
                <p className="text-red-500 text-sm mt-1">{errors.posName}</p>
              )}
            </div>

            {/* E-Mail */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">E-Mail :</label>
              <input
                type="email"
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Enter a valid e-mail"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Telephone */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Telephone :</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} rounded`}
                placeholder="Enter a valid Number"
                value={userData.telephone}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Role :</label>
              <div className="relative">
                <select
                  className={`w-full p-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded appearance-none`}
                  value={userData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Is Active */}
            <div className="mb-6">
              <label className="flex items-center text-gray-700 font-semibold">
                <span className="mr-2">Is Active :</span>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={userData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-950 cursor-pointer"
                onClick={handleCreateUser}
              >
                Create User
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                onClick={toggleUsersList}
              >
                {showUsersList ? "Hide Users" : "View Users"}
              </button>
            </div>
          </div>

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

          {/* User List - Only shown when showUsersList is true */}
          {showUsersList && usersList.length > 0 && (
            <div className="bg-white p-6 rounded shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">User List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Username</th>
                      <th className="py-2 px-4 border-b text-left">
                        First Name
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        Last Name
                      </th>
                      <th className="py-2 px-4 border-b text-left">
                        POS Name
                      </th>
                      <th className="py-2 px-4 border-b text-left">Email</th>
                      <th className="py-2 px-4 border-b text-left">
                        Telephone
                      </th>
                      <th className="py-2 px-4 border-b text-left">Role</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{user.username}</td>
                        <td className="py-2 px-4 border-b">{user.firstName}</td>
                        <td className="py-2 px-4 border-b">{user.lastName}</td>
                        <td className="py-2 px-4 border-b">{user.posName}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.telephone}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                        <td className="py-2 px-4 border-b">
                          {user.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                            onClick={() => {
                              // Edit functionality would go here
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => {
                              const newUsers = [...usersList];
                              newUsers.splice(index, 1);
                              setUsersList(newUsers);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 inline"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Message when View Users is clicked but no users exist */}
          {showUsersList && usersList.length === 0 && (
            <div className="bg-white p-6 rounded shadow mt-6 text-center">
              <p className="text-gray-600">No users have been created yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default CreateUserPage;