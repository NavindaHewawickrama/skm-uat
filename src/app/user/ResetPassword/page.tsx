"use client";
import React, { useState, useEffect } from "react";
import AppBar from "@/components/Appbar";
import SideNav from "@/components/Sidenav";
import Footer from "@/components/Footer";
import Alert from '../../../components/Alert';
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleShowAlert = (type: React.SetStateAction<string>, message: React.SetStateAction<string>) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  // Add validation state
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  useEffect(() => {
    // Validate passwords match when either field changes
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);

      // Clear the confirm password error if passwords match
      if (newPassword === confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  //validating the new password == confirm password
  const validateForm = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
//handling submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch('/api/login/userlogin', {
        method: 'POST',
        body: JSON.stringify({
          userId: 1,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        handleShowAlert('success', response.statusText);
        console.log(data);
        //sessionStorage.setItem('acctoken',response.)
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        console.log(response);
        handleShowAlert('error', response.statusText)
      }
    } catch (error) {
      console.error(error);
      handleShowAlert('error', 'Problem Loggin In...')
    }

  };

  const handleReset = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordsMatch(true);
    setFormSubmitted(false);
    setErrors({
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Reset Password Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 lg:p-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 lg:w-[75%]">
              <h2 className="text-xl font-bold mb-6 text-black">Reset Password</h2>

              {formSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p>Password reset successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.newPassword ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-red-400 cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-red-400 cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-950 focus:outline-none focus:ring-blue-500 cursor-pointer"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-red-500 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          {showAlert && (
            <Alert
              message={alertMessage}
              type={alertType}
              duration={5000}
            />
          )}

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

//created by Navinda Hewawickrama and Praveen Bimsara on 5/27/2025