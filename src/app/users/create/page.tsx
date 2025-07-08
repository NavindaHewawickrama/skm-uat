"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import Alert from "../../../components/Alert";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";

interface UserData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  //posName: string;
  salesPersonCode: string;
  email: string;
  telephone: string;
  userRoleId: string;
  location: string[];
  locationCodes: [];
  isActive: boolean;
  phoneNumber: string;
  userId: number;
}

interface SalesPerson {
  salesPersonCode: string;
  salesPersonName: string;
  email: string;
  phone: string;
}

interface Role {
  roleId: number;
  roleName: string;
}

interface Location {
  locationCode: string;
  locationName: string;
}

interface UserCreationDetails {
  salesPersons: SalesPerson[];
  roles: Role[];
  locations: Location[];
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
  location?: string;
  notice?: string;
}

type OrderType = {
  orderNumber: number;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  orderedItems: {
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: string;
    discountPercent: number;
    total: number;
  }[];
  items:
  | string
  | {
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: string;
    discountPercent: number;
    total: number;
  }[];
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

const CreateUserPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  // const [userData, setUserData] = useState<UserData>({
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  //   firstName: "",
  //   lastName: "",
  //   posName: "",
  //   email: "",
  //   telephone: "",
  //   role: "",
  //   location: [],
  //   isActive: false,
  // });

  const [errors, setErrors] = useState<FormErrors>({});
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState(0);
  const [location, setLocation] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [mfaType, setMfaType] = useState("");
  const [selectedForUpdatingUser, setSelectedForUpdatingUser] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [editingUser, setEditingUser] = useState(false);
  const [viewpw, setViewPw] = useState(false);
  const [viewpw1, setViewPw1] = useState(false);
  const [userRoleId, setUserRoleId] = useState(0);
  // const userNameAppbar = sessionStorage.getItem("userName") || "Guest";
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [userNameAppbar, setUserNameAppbar] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    setUserNameAppbar(
      sessionStorage.getItem("userName")
        ? sessionStorage.getItem("userName")
        : ""
    );
    setUserRoleType(
      sessionStorage.getItem("userRoleName")
        ? sessionStorage.getItem("userRoleName")
        : ""
    );
    const pendingOrderList = sessionStorage.getItem("notificationsData");
    setPendingOrders(pendingOrderList ? JSON.parse(pendingOrderList) : []);
  }, []);
  const handleShowAlert = (
    type: React.SetStateAction<string>,
    message: React.SetStateAction<string>
  ) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  console.log(isMfaEnabled);
  console.log(mfaType);

  // API data states
  const [userCreationDetails, setUserCreationDetails] =
    useState<UserCreationDetails>({
      salesPersons: [],
      roles: [],
      locations: [],
    });
  //const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch user creation details on component mount
  useEffect(() => {
    fetchUserCreationDetails();
  }, []);

  const fetchUsers = async () => {
    try {
      //setLoading(true);
      const response = await fetch("/api/user/fetchUserList"); // Using relative path to your API route

      if (!response.ok) {
        throw new Error("Failed to fetch user list");
      }

      const data = await response.json();
      //  console.log(data);
      setShowUsersList(true);
      setUsersList(data);
    } catch (error) {
      console.error("Error fetching user creation details:", error);
      setApiError("Failed to fetch user list details. Please try again.");
    }
  };

  const fetchUserCreationDetails = async () => {
    try {
      //setLoading(true);
      const response = await fetch("/api/user-creation-details"); // Using relative path to your API route

      if (!response.ok) {
        throw new Error("Failed to fetch user creation details");
      }

      const data = await response.json();
      //  console.log(data);

      setUserCreationDetails(data.creationDetails);
      //console.log(data.userDetails);
      if (data.userDetails.userRoleId === 1) {
        //setUsersList(data.creationDetails.salesPersons);
        setUserRoleId(data.userDetails.userRoleId);
        fetchUsers();
      }
      setApiError(null);
    } catch (error) {
      console.error("Error fetching user creation details:", error);
      setApiError("Failed to load user creation details. Please try again.");
    }
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };
  const handleReset = () => {
    setErrors({}); // Clear all errors on reset

    setUserName("");
    setPassword("");
    setReTypePassword("");
    setFirstName("");
    setLastName("");
    setRole(0);
    setSelectedSalesPerson("");
    setLocation([]);
    setEmail("");
    setTelephone("");
    setIsActive(false);
    setEditingUser(false);
  };


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!userName) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!reTypePassword) {
      newErrors.confirmPassword = "Re Type Password is required";
      isValid = false;
    }

    if (!firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (password !== reTypePassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!selectedSalesPerson) {
      newErrors.posName = "Sales Person is required";
      isValid = false;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    // Basic telephone validation (e.g., just check if it's not empty)
    // You might want to add more robust regex for phone numbers
    if (!telephone) {
      newErrors.telephone = "Telephone Number is required";
      isValid = false;
    }

    if (!role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    if (!location || location.length === 0) {
      newErrors.location = "At least one location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateUser = async () => {
    if (userRoleId === 1) {
      // Validate form
      if (!validateForm()) {
        // Scroll to the first error if needed
        return;
      }

      // setIsLoading(true);

      try {
        setIsSaving(true);
        const response = await fetch("/api/user/addNewUser", {
          method: "POST",
          body: JSON.stringify({
            username: userName,
            password: password,
            reEnteredPassword: reTypePassword,
            firstName: firstName,
            lastName: lastName,
            userRoleId: role,
            salesPersonCode: selectedSalesPerson,
            locationCodes: location,
            email: email,
            phoneNumber: telephone,
            isActive: isActive,
            isMfaEnabled: false,
            mfaType: "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          handleShowAlert("success", "User Created successfully!");
          fetchUsers();
          handleReset();
        } else {
          //handleShowAlert('error', data.error || 'User Creating failed');
          let errorMessage = "User Creating  failed. Please try again.";

          if (data.error) {
            errorMessage = data.error;

            if (data.details) {
              try {
                const parsedDetails = JSON.parse(data.details);
                if (parsedDetails.message) {
                  errorMessage = `${data.error}: ${parsedDetails.message}`;
                }
              } catch (e) {
                // If parsing fails, just use the error field
                console.warn("Could not parse error details:", e);
              } finally {
                setIsSaving(false);
              }
            }
          }

          handleShowAlert("error", errorMessage);
          console.error("User Creating  failed:", data);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      } catch (error) {
        console.error("User Createing error:", error);
        handleShowAlert("error", "Network error. Please try again.");
      }
    } else {
      handleShowAlert("error", "No permission to create a user");
    }
  };

  const handleUpdateUser = async () => {
    if (userRoleId === 1) {
      try {
        // const apiBody = {
        //   updatingUserId: selectedForUpdatingUser,
        //   username: userName,
        //   password: password,
        //   reEnteredPassword: reTypePassword,
        //   firstName: firstName,
        //   lastName: lastName,
        //   userRoleId: role,
        //   salesPersonCode: selectedSalesPerson,
        //   locationCode: location,
        //   email: email,
        //   phoneNumber: telephone,
        //   isActive: isActive,
        //   isMfaEnabled: isMfaEnabled,
        //   mfaType: mfaType
        // }
        // console.log(apiBody);
        const response = await fetch("/api/user/updateUser", {
          method: "PUT",
          body: JSON.stringify({
            updatingUserId: selectedForUpdatingUser,
            username: userName,
            password: password,
            reEnteredPassword: reTypePassword,
            firstName: firstName,
            lastName: lastName,
            userRoleId: role,
            salesPersonCode: selectedSalesPerson,
            locationCodes: location,
            email: email,
            phoneNumber: telephone,
            isActive: isActive,
            isMfaEnabled: false,
            mfaType: "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          handleShowAlert("success", "User Updated successfully!");
          handleReset();
          fetchUsers();
          setEditingUser(false);
        } else {
          //handleShowAlert('error', data.error || 'User Creating failed');
          let errorMessage = "User Updating  failed. Please try again.";

          if (data.error) {
            errorMessage = data.error;

            if (data.details) {
              try {
                const parsedDetails = JSON.parse(data.details);
                if (parsedDetails.message) {
                  errorMessage = `${data.error}: ${parsedDetails.message}`;
                }
              } catch (e) {
                // If parsing fails, just use the error field
                console.warn("Could not parse error details:", e);
              }
            }
          }

          handleShowAlert("error", errorMessage);
          console.error("User Updating  failed:", data);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      } catch (error) {
        console.error("User Updating error:", error);
        handleShowAlert("error", "Network error. Please try again.");
      }
    } else {
      handleShowAlert("error", "No Permisison to update users");
    }
  };

  const toggleUsersList = () => {
    setShowUsersList(!showUsersList);
  };

  const handleEditUser = async (user: UserData) => {
    //  console.log(user);
    if (userRoleId === 1) {
      setEditingUser(true);
      setSelectedForUpdatingUser(user.userId);
      setUserName(user.username);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setSelectedSalesPerson(user.salesPersonCode);
      setIsActive(user.isActive);
      setRole(parseInt(user.userRoleId));
      setPassword(user.password);
      setReTypePassword(user.password);
      setEmail(user.email);
      setTelephone(user.phoneNumber);
      setLocation(user.locationCodes);

      // Remove the currently selected user from the list
      setUsersList(usersList.filter((item) => item.username !== user.username));
    } else {
      handleShowAlert("error", "You do not have permission to edit users.");
    }
    //console.log(user);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* App Bar */}
      <AppBar
        toggleSideNav={toggleSideNav}
        userRole={userRoleType}
        userName={userNameAppbar}
        notificationData={pendingOrders}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-auto">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Content Area */}
        <div
          className="flex-1 overflow-auto p-6 h-screen"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="bg-white p-6 rounded shadow lg:w-[75%]">
            <h2 className="text-xl font-bold mb-6">Create User</h2>

            {/* API Error message */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                {apiError}
              </div>
            )}

            {/* General error message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* User Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                User Name :
              </label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.username ? "border-red-500" : "border-gray-300"
                  } rounded`}
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="flex flex-row">
                <label className="block text-gray-700 font-semibold mb-2">
                  Password :
                </label>
                <div className="p-1 mt-1">
                  <div className="relative group">
                    <svg
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                      />
                    </svg>
                    <div className="absolute z-20 w-64 p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 left-5 top-0">
                      <ul className="list-disc list-inside">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                        {/* <li>One special character (!@#$...)</li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  disabled={editingUser ? true : false}
                  type={viewpw1 ? "text" : "password"}
                  className={`w-full p-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                    } ${editingUser ? "bg-gray-300" : "bg-white"} rounded`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setViewPw1(!viewpw1)}
                >
                  {viewpw1 ? (
                    // Eye slash icon (hide password)
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    // Eye icon (show password)
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Re-Type Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Re-Type Password :
              </label>
              <div className="relative">
                <input
                  disabled={editingUser ? true : false}
                  type={viewpw ? "text" : "password"}
                  className={`w-full p-2 border ${errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                    } ${editingUser ? "bg-gray-300" : "bg-white"} rounded`}
                  placeholder="Re-Type Password"
                  value={reTypePassword}
                  onChange={(e) => setReTypePassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setViewPw(!viewpw)}
                >
                  {viewpw ? (
                    // Eye slash icon (hide password)
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    // Eye icon (show password)
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                First Name :
              </label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded`}
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Last Name :
              </label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded`}
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Sales Person Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Sales Person :
              </label>
              <div className="relative">
                <select
                  className={`w-full p-2 border ${errors.posName ? "border-red-500" : "border-gray-300"
                    } rounded appearance-none`}
                  // The value here needs to be the salesPersonCode that matches userData.posName (salesPersonName)
                  // value={userCreationDetails.salesPersons.find(sp => sp.salesPersonName === userData.posName)?.salesPersonCode || ""}
                  value={selectedSalesPerson}
                  onChange={(e) => {
                    setSelectedSalesPerson(e.target.value);
                  }}
                >
                  <option value="">Select Sales Person</option>
                  {userCreationDetails.salesPersons.map((salesPerson) => (
                    <option
                      key={salesPerson.salesPersonCode}
                      value={salesPerson.salesPersonCode}
                    >
                      {salesPerson.salesPersonName} (
                      {salesPerson.salesPersonCode})
                    </option>
                  ))}
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
              {errors.posName && (
                <p className="text-red-500 text-sm mt-1">{errors.posName}</p>
              )}
            </div>

            {/* E-Mail */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                E-Mail :
              </label>
              <input
                type="email"
                className={`w-full p-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                  } rounded`}
                placeholder="Enter a valid e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Telephone */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Telephone :
              </label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.telephone ? "border-red-500" : "border-gray-300"
                  } rounded`}
                placeholder="Enter a valid Number"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              {errors.telephone && (
                <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Role :
              </label>
              <div className="relative">
                <select
                  className={`w-full p-2 border ${errors.role ? "border-red-500" : "border-gray-300"
                    } rounded appearance-none`}
                  value={role}
                  onChange={(e) => setRole(parseInt(e.target.value))}
                >
                  <option value="">Select Role</option>
                  {userCreationDetails.roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
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

            {/* Location Select */}
            <div className="mb-4">
              <MultiSelectDropdown
                locationOptions={userCreationDetails.locations}
                selectedLocations={location}
                setSelectedLocations={setLocation}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Is Active */}
            <div className="mb-6">
              <label className="flex items-center text-gray-700 font-semibold">
                <span className="mr-2">Is Active :</span>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </label>
            </div>

            {/* MFA Type Checkboxes */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                MFA Type:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="sms"
                    checked={mfaType.includes("sms")}
                    onChange={() => {
                      setMfaType("sms");
                      setIsMfaEnabled(true);
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">SMS</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value="email"
                    checked={mfaType.includes("email")}
                    onChange={() => {
                      setMfaType("email");
                      setIsMfaEnabled(true);
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Email</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                disabled={isSaving}
                className={`px-4 py-2 rounded font-medium transition duration-300 ${isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-950 cursor-pointer"
                  } text-white`}
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
              >
                {isSaving ? "Processing..." : "Create / Update User"}
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

          {/* User List - Only shown when showUsersList is true */}
          {showUsersList && usersList.length > 0 && (
            <div className="bg-white p-6 rounded shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">User List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-center">
                        Username
                      </th>
                      <th className="py-2 px-4 border-b text-center">
                        First Name
                      </th>
                      <th className="py-2 px-4 border-b text-center">
                        Last Name
                      </th>
                      <th className="py-2 px-4 border-b text-center">
                        Sales Person Code
                      </th>{" "}
                      {/* Map the salespersons name to here*/}
                      {/* <th className="py-2 px-4 border-b text-center">Email</th> */}
                      {/* <th className="py-2 px-4 border-b text-center">Telephone</th> */}
                      <th className="py-2 px-4 border-b text-center">Role</th>{" "}
                      {/* Map the user role Id to the user role name */}
                      {/* <th className="py-2 px-4 border-b text-center">Locations</th> */}
                      <th className="py-2 px-4 border-b text-center">Status</th>
                      <th className="py-2 px-4 border-b text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b text-center">
                          {user.username}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {user.firstName}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {user.lastName}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {user.salesPersonCode}
                        </td>
                        {/* <td className="py-2 px-4 border-b text-center">{user.email}</td>
                          <td className="py-2 px-4 border-b text-center">{user.telephone}</td> */}
                        <td className="py-2 px-4 border-b text-center">
                          {userCreationDetails.roles.find(
                            (item) => item.roleId === parseInt(user.userRoleId)
                          )?.roleName || ""}
                        </td>
                        {/* <td className="py-2 px-4 border-b">
                          {user.location.map(loc => {
                            const location = userCreationDetails.locations.find(l => l.locationCode === loc);
                            return location ? location.locationName : loc;
                          }).join(', ')}
                        </td> */}
                        <td className="py-2 px-4 border-b">
                          {user.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                            onClick={() => {
                              // Edit functionality would go here
                              // alert(`Edit user: ${user.username}`);
                              handleEditUser(user);
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
                              setErrors({
                                notice: "User deleted successfully!",
                              }); // Optional: Add a success notice
                              setTimeout(() => setErrors({}), 3000); // Clear notice after 3 seconds
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
      {showAlert && (
        <Alert message={alertMessage} type={alertType} duration={5000} />
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default CreateUserPage;
