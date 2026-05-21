"use client";

import React, { useState, useEffect } from "react";
import Alert from "../components/Alert";
import { useOrderCreationData } from "../hooks/useOrderCreationData";

interface OrderforStatus {
  orderNumber: string;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  status: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: OrderforStatus | null;
}



const ViewStatus: React.FC<ModalProps> = ({ open, onClose, selectedOrder }) => {
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [specialNote, setSpecialNote] = useState("")
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationChange, setShowLocationChange] = useState(false);
  const { locations, isLoadingLocations } = useOrderCreationData(true);
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    if (open && selectedOrder) {
      // Map current status to dropdown value
      const statusMap: { [key: string]: string } = {
        Pending: "0",
        Processing: "1",
        Delivered: "2",
        Rejected: "3",
      };
      setSelectedStatus(statusMap[selectedOrder.status] || "1");
      setTrackingNumber("");
      setDeliveryPerson("");
      setDeliveryDate(null);
      setSpecialNote("");
      setRejectReason("");
      // Reset alert state when modal opens
      setShowAlert(false);
      setAlertMessage("");
      setAlertType("");

      setSelectedLocation(""); // Reset location
      setShowLocationChange(false); // Reset location change flag

      // Show location change option if status is Processing
      if (selectedOrder.status === "Processing") {
        setShowLocationChange(true);
        setCurrentLocation("Current Location Code");
      }
    }
  }, [open, selectedOrder]);

  const handleShowAlert = (
    type: string,
    message: string
  ) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  if (!open) return null;

  const handleUpdate = async () => {
    console.log("Updating order status...");
    console.log("Selected Order:", selectedOrder);
    if (!selectedOrder) return;

    try {
      setLoading(true);
      setShowAlert(false);

      const requestBody = {
        orderNumber: selectedOrder.orderNumber,
        status: parseInt(selectedStatus),
        rejectReason: selectedStatus === "3" ? rejectReason : "",
        trackingNumber: trackingNumber,
        delivertPersonName: deliveryPerson,
        deliveryDate: deliveryDate ? deliveryDate : null,
        note: specialNote,
      };

      if (selectedStatus === "2" && !deliveryDate) {
        handleShowAlert("error", "Delivery date is required for Delivered status.");
        return;
      }

      if (selectedStatus === "3" && rejectReason.trim() === "") {
        handleShowAlert("error", "Reject reason is required for Rejected status.");
        return;
      }

      // STEP 1: If location needs to be changed, do it FIRST
      let locationChanged = false;
      if (selectedStatus === "1" && selectedLocation && selectedLocation !== "") {
        console.log("Changing location first...");
        const locationResponse = await fetch("/api/orders/changeLocation", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNumber: selectedOrder.orderNumber,
            locationCode: selectedLocation
          }),
        });

        const locationResult = await locationResponse.json();

        if (locationResponse.ok) {
          locationChanged = true;
          console.log("Location changed successfully");
        } else {
          const locationError = locationResult.error || "Failed to change location";
          handleShowAlert("error", `Location change failed: ${locationError}`);
          return; // Stop if location change fails
        }
      }

      // STEP 2: Then change the status
      console.log("Changing status...");
      const response = await fetch("/api/orders/changeStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle status update error
        if (response.status === 403) {
          handleShowAlert("error", "No permission to change status");
        } else {
          let errorMessage = result.error || "Failed to update order status";
          if (result.details) {
            try {
              const parsedDetails = JSON.parse(result.details);
              if (parsedDetails.errors && typeof parsedDetails.errors === 'object') {
                const validationErrors: string[] = [];
                Object.keys(parsedDetails.errors).forEach(field => {
                  const fieldErrors = parsedDetails.errors[field];
                  if (Array.isArray(fieldErrors)) {
                    validationErrors.push(...fieldErrors);
                  } else {
                    validationErrors.push(fieldErrors);
                  }
                });
                if (validationErrors.length > 0) {
                  errorMessage = validationErrors.join(', ');
                }
              } else if (parsedDetails.title) {
                errorMessage = parsedDetails.title;
              } else if (parsedDetails.message) {
                errorMessage = parsedDetails.message;
              }
            } catch (e) {
              errorMessage = typeof result.details === "string" ? result.details : result.error || errorMessage;
            }
          }
          handleShowAlert("error", errorMessage);
        }
        console.error("Status update failed:", result);
        return;
      }

      // Success message
      if (locationChanged) {
        handleShowAlert("success", "Order location and status updated successfully");
      } else {
        const successMessage = result.message || "Order status updated successfully";
        handleShowAlert("success", successMessage);
      }

      // Delay closing modal to show success message
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Error updating:", error);
      handleShowAlert("error", "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-4 right-4 z-[60]">
          <Alert message={alertMessage} type={alertType} duration={5000} />
        </div>
      )}
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
              Order No - {selectedOrder?.orderNumber}
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

          {/* Dropdown for status selection */}
          <div className="mb-3 sm:mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Select Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
              disabled={loading}
            >
              <option value="0">Pending</option>
              <option value="1">Processing</option>
              <option value="2">Delivered</option>
              <option value="3">Rejected</option>
            </select>
          </div>

          {/* Conditional Input for Rejected Status */}
          {selectedStatus === "3" && (
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="rejectReason"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Reject Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2"
                rows={3}
                placeholder="Please provide reason for rejection..."
                required
              />
            </div>
          )}

          {/*Conditional Location Change for processing status */}
          {selectedStatus === "1" && (
            <div className="mb-3 sm:mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Change Location (Optional)
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2"
                disabled={loading || isLoadingLocations}
              >
                <option value="">No Change (Keep Current Location)</option>
                {locations.map((location) => (
                  <option key={location.locationCode} value={location.locationCode}>
                    {location.locationCode} - {location.locationName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a new location for this order if needed
              </p>
            </div>
          )}

          {/* Conditional Inputs for Delivered Status */}
          {selectedStatus === "2" && (
            <div className="space-y-3 sm:space-y-4 mb-2">
              <div>
                <label
                  htmlFor="trackingNumber"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="deliveryPerson"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Delivery Person Name
                </label>
                <input
                  type="text"
                  id="deliveryPerson"
                  value={deliveryPerson}
                  onChange={(e) => setDeliveryPerson(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="deliveryDate"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Delivery Date
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate ? deliveryDate : ""}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="specialNote"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Special Note
                </label>
                <textarea
                  id="specialNote"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Update Button */}
          <div className="flex justify-end mt-4 sm:mt-6">
            <button
              onClick={handleUpdate}
              // disabled={
              //   loading || (selectedStatus === "3" && !rejectReason.trim())
              // }
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base cursor-pointer ${loading || (selectedStatus === "4" && !rejectReason.trim())
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewStatus;