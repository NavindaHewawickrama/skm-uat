"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";

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
  location: string[];
  isActive: boolean;
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
    location: [],
    isActive: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);

  // API data states
  const [userCreationDetails, setUserCreationDetails] = useState<UserCreationDetails>({
    salesPersons: [],
    roles: [],
    locations: []
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch user creation details on component mount
  useEffect(() => {
    const fetchUserCreationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user-creation-details'); // Using relative path to your API route

        if (!response.ok) {
          throw new Error('Failed to fetch user creation details');
        }

        const data = await response.json();
        setUserCreationDetails(data);
        setApiError(null);
      } catch (error) {
        console.error('Error fetching user creation details:', error);
        setApiError('Failed to load user creation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCreationDetails();
  }, []);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const handleInputChange = (
    field: keyof UserData,
    value: string | boolean | string[]
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

  const handleSalesPersonChange = (salesPersonCode: string) => {
    const selectedSalesPerson = userCreationDetails.salesPersons.find(
      sp => sp.salesPersonCode === salesPersonCode
    );

    if (selectedSalesPerson) {
      // Clear errors related to posName, email, and telephone as they are now being auto-filled
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.posName;
        delete newErrors.email;
        delete newErrors.telephone;
        return newErrors;
      });

      setUserData(prev => ({
        ...prev,
        posName: selectedSalesPerson.salesPersonName,
        email: selectedSalesPerson.email || prev.email,
        telephone: selectedSalesPerson.phone || prev.telephone
      }));
    } else {
      // If no sales person is selected (e.g., "Select Sales Person" is chosen)
      setUserData(prev => ({
        ...prev,
        posName: "",
        email: "",
        telephone: ""
      }));
    }
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
      newErrors.posName = "Sales Person is required";
      isValid = false;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    // Basic telephone validation (e.g., just check if it's not empty)
    // You might want to add more robust regex for phone numbers
    if (!userData.telephone) {
      newErrors.telephone = "Telephone Number is required";
      isValid = false;
    }

    if (!userData.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    if (!userData.location || userData.location.length === 0) {
      newErrors.location = "At least one location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateUser = () => {
    // Validate form
    if (!validateForm()) {
      // Scroll to the first error if needed
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
      location: [],
      isActive: false,
    });
    setErrors({ notice: "User created successfully!" }); // Optional: Add a success notice
    setTimeout(() => setErrors({}), 3000); // Clear notice after 3 seconds
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
      location: [],
      isActive: false,
    });
    setErrors({}); // Clear all errors on reset
  };

  const toggleUsersList = () => {
    setShowUsersList(!showUsersList);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user creation details...</p>
        </div>
      </div>
    );
  }

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

            {/* Success notice */}
            {errors.notice && (
              <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded">
                {errors.notice}
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

            {/* Sales Person Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Sales Person :</label>
              <div className="relative">
                <select
                  className={`w-full p-2 border ${errors.posName ? 'border-red-500' : 'border-gray-300'} rounded appearance-none`}
                  // The value here needs to be the salesPersonCode that matches userData.posName (salesPersonName)
                  value={userCreationDetails.salesPersons.find(sp => sp.salesPersonName === userData.posName)?.salesPersonCode || ""}
                  onChange={(e) => {
                    handleSalesPersonChange(e.target.value);
                  }}
                >
                  <option value="">Select Sales Person</option>
                  {userCreationDetails.salesPersons.map((salesPerson) => (
                    <option key={salesPerson.salesPersonCode} value={salesPerson.salesPersonCode}>
                      {salesPerson.salesPersonName} ({salesPerson.salesPersonCode})
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
                  <option value="">Select Role</option>
                  {userCreationDetails.roles.map((role) => (
                    <option key={role.roleId} value={role.roleName}>
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
              <label className="block text-gray-700 font-semibold mb-2">Location :</label>
              <div className="relative">
                <select
                  className={`w-full p-2 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded appearance-none`}
                  value={userData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                >
                  <option value="">Select Location</option>
                  {userCreationDetails.locations.map((location) => (
                    <option key={location.locationCode} value={location.locationName}>
                      {location.locationName}
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

          {/* User List - Only shown when showUsersList is true */}
          {showUsersList && usersList.length > 0 && (
            <div className="bg-white p-6 rounded shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">User List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Username</th>
                      <th className="py-2 px-4 border-b text-left">First Name</th>
                      <th className="py-2 px-4 border-b text-left">Last Name</th>
                      <th className="py-2 px-4 border-b text-left">Sales Person</th>
                      <th className="py-2 px-4 border-b text-left">Email</th>
                      <th className="py-2 px-4 border-b text-left">Telephone</th>
                      <th className="py-2 px-4 border-b text-left">Role</th>
                      <th className="py-2 px-4 border-b text-left">Locations</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-center">Actions</th>
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
                          {user.location.map(loc => {
                            const location = userCreationDetails.locations.find(l => l.locationCode === loc);
                            return location ? location.locationName : loc;
                          }).join(', ')}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {user.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                            onClick={() => {
                              // Edit functionality would go here
                              alert(`Edit user: ${user.username}`);
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
                              setErrors({ notice: "User deleted successfully!" }); // Optional: Add a success notice
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

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default CreateUserPage;