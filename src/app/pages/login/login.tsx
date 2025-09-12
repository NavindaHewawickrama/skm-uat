"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Alert from "../../components/Alert";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewpw, setViewPw] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/login/checkAuth");
        const data = await res.json();
        if (data.authenticated) {
          router.push("/dashboard"); // Redirect if already logged in
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  const handleShowAlert = (
    type: React.SetStateAction<string>,
    message: React.SetStateAction<string>
  ) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowAlert(false);

    try {
      const response = await fetch("/api/login/userlogin", {
        method: "POST",
        body: JSON.stringify({
          usernameOrEmail: username,
          password: password,
          rememberme: rememberMe,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Success case
        handleShowAlert(
          "success",
          "Login successful! Redirecting to dashboard..."
        );
        //  console.log('Login successful:', data);

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        // Error case - error message from the API response
        const errorMessage = data.error || "Login failed. Please try again.";
        handleShowAlert("error", errorMessage);
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      handleShowAlert(
        "error",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col justify-between overflow-hidden">
      {/* Main content area */}
      <div className="flex items-center justify-center px-4">
        {showAlert && (
          <Alert message={alertMessage} type={alertType} duration={5000} />
        )}
        <div className="bg-white p-8 mt-24 h-[450px] rounded-lg w-full max-w-md border-[6px] border-double border-blue-950">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo-d.png"
              alt="Srikanta Motors Logo"
              width={155}
              height={64}
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 mt-6 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 transition-all duration-200"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type={viewpw ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 transition-all duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setViewPw(!viewpw)}
                  disabled={isLoading}
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
            </div>

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-medium py-2 px-4 mt-4 rounded-md transition duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 cursor-pointer"
              } text-white`}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer image at bottom */}
      <div className="w-full">
        <Image
          src="/images/bg-account.png"
          alt="Decorative footer"
          width={800} // Add actual width
          height={150} // Add actual height
          className="w-full object-cover"
          style={{ height: "150px" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;

//created by Praveen Bimsara
