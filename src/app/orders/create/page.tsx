"use client";
import React, { useState, useEffect } from "react";
import AppBar from "../../components/Appbar";
import SideNav from "../../components/Sidenav";
import Footer from "../../components/Footer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Alert from "../../components/Alert";
import Select from "react-select";
import { useOrderCreationData } from "../../hooks/useOrderCreationData";

type OrderType = {
  orderNumber: number;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  specialNote: string;
  totalAmount: number;
  orderedItems: {
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity: string;
    discountPercent: number;
    total: number;
  }[];
  rejectReason: string | null;
  status: string;
  delivertPersonName: string | null;
  deliveryDate: string | null;
  invoicedItems: string | null;
  trackingNumber: string | null;
};

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface OrderItem {
  itemCode: string;
  description: string;
  unitPrice: number;
  quantity: number;
  discountPercent: number;
  total: number;
}

interface CustomerOutstandingData {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoicedAmount: number;
  pdcAmount: number;
  dueAmount: number;
  originalAmount: number;
  orderNo: string;
  balanceBeforePDCs: number;
  releasedPDCs: number;
  balanceAfterPDCs: number;
  orderDate: string;
  totalDueAmount: number;
}

interface Customer {
  customerCode: string;
  customerName: string;
  dueAmount: number;
  creditAllowed: boolean;
  creditLimit: number;
  balanceCredit: number;
  paymentTermCode: string;
  outstandingData?: CustomerOutstandingData[]; // optional field for outstanding data
  // add more fields if necessary
}

interface SubstituteItem {
  itemCode: string;
  itemName: string;
  unitPrice: number;
}

interface LocationWiseInventory {
  locationCode: string;
  inventory: number;
}

interface Item {
  itemCode: string;
  itemName: string;
  substituteItems: SubstituteItem[];
  unitprice: string;
  locationWiseInventory?: LocationWiseInventory[];
}

interface Location {
  locationCode: string;
  locationName: string;
}

interface Customer {
  customerCode: string;
  customerName: string;
}

interface Invoice {
  invoiceNumber: string;
  orderNo: string;
  invoiceDate: string;
  pdcAmount: number;
  dueAmount: number;
  totalAmount: number;
  remainingAmount: number;
  invoiceNo: string;
  originalAmount: number;
  balanceBeforePDCs: number;
  releasedPDCs: number;
  balanceAfterPDCs: number;
  orderDate: string;
  totalDueAmount: number;
}

interface PaymentMethod {
  paymentMethodCode: string;
  description: string;
}

const CreateOrderPage: React.FC = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [paymentType, setPaymentType] = useState("");
  //const [notes, setNotes] = useState("");
  const [total, setTotal] = useState(0);

  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedCustomerDueAmount, setSelectedCustomerDueAmount] = useState(0);
  const [customer, setCustomer] = useState<string>("");
  const [locationWiseItems, setLocationWiseItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [selectedItemUnitPrice, setSelectedItemUnitPrice] = useState("");
  const [selectedItemQuantity, setSelectedItemQuantity] = useState(0);
  const [selectedItemDiscount, setSelectedItemDiscount] = useState(0);
  const [substitutedItemsList, setSubstitutedItemsList] = useState<
    SubstituteItem[]
  >([]);
  const [
    selectedItemSelectedLocationStock,
    setSelectedItemSelectedLocationStock,
  ] = useState<string>("0");
  // const [formattedAmount, setFormattedAmount] = useState("");
  // const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [outstandingData, setOutstandingData] = useState<
    CustomerOutstandingData[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoadingDueAmount, setIsLoadingDueAmount] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const {
    customers,
    locations,
    items: itemsList,
    paymentMethods: paymentMethodList,
    isLoading: isDataLoading,
    isLoadingCustomers,
    isLoadingLocations,
    isLoadingItems,
    getItemsByLocation,
    getCustomerByCode,
    refreshAll
  } = useOrderCreationData(true);


  const locationOptions = locations
    .filter(
      (loc) =>
        loc.locationCode &&
        loc.locationName &&
        loc.locationCode.toString().trim() !== "" &&
        loc.locationName.toString().trim() !== "",
    )
    .map((loc) => ({
      value: loc.locationCode,
      label: loc.locationCode,
    }));
  const [isLoading, setIsLoading] = useState(false);
  const customerOptions = customers
    .filter(
      (customer) =>
        customer.customerCode &&
        customer.customerName &&
        customer.customerCode.toString().trim() !== "" &&
        customer.customerName.toString().trim() !== "",
    )
    .map((customer) => ({
      value: customer.customerCode,
      label: customer.customerName,
    }));



  useEffect(() => {
    if (!location) {
      setLocationWiseItems([]);
      return;
    }
    // Use the store's helper function
    const filteredItems = getItemsByLocation(location);
    setLocationWiseItems(filteredItems);
  }, [location, getItemsByLocation]);

  // Fetch pending order data from API
  useEffect(() => {
    const fetchPendingOrderData = async () => {
      try {
        const response = await fetch(`/api/orders/pending`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw Error("Failed to fetch pending order data");
        } else {
          const data = await response.json();
          //console.log(data);
          setPendingOrders(data);
          sessionStorage.setItem("notificationsData", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Error fetching pending order data:", err);
      }
    };

    fetchPendingOrderData();
  }, []);

  useEffect(() => {
    setUserName(
      sessionStorage.getItem("userName")
        ? sessionStorage.getItem("userName")
        : "",
    );
  }, []);

  useEffect(() => {
    if (outstandingData.length > 0) {
      generatePDF();
    }
    console.log(outstandingData);
  }, [outstandingData]);

  useEffect(() => {
    setUserRoleType(
      sessionStorage.getItem("userRoleName")
        ? sessionStorage.getItem("userRoleName")
        : "",
    );
  }, []);

  const handleShowAlert = (type: string, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  // Calculate item total
  const calculateItemTotal = () => {
    const totalFull = parseFloat(selectedItemUnitPrice) * selectedItemQuantity;
    const discount = totalFull * (selectedItemDiscount / 100);
    const total = totalFull - discount;
    return total;
  };

  // Add item to order list
  const addToList = () => {
    if (orderItems.length >= 14) {
      handleShowAlert("error", "14 Items are already selected. Cannot add more items to the list");
      return;
    }

    if (
      !selectedItem ||
      !selectedItemQuantity ||
      !selectedCustomer ||
      !location
    ) {
      handleShowAlert("error", "Please fill in all required fields");
      return;
    }

    // Check if item already exists in the order list
    const existingItemIndex = orderItems.findIndex(
      (item) => item.itemCode === selectedItem
    );

    let updatedOrderItems;

    if (existingItemIndex !== -1) {
      // Item exists - update quantity and total
      const existingItem = orderItems[existingItemIndex];
      const newQuantity = existingItem.quantity + selectedItemQuantity;

      // Calculate new total for this item
      const newItemTotal = existingItem.unitPrice * newQuantity * (1 - existingItem.discountPercent / 100);

      // Update the existing item
      const updatedItem = {
        ...existingItem,
        quantity: newQuantity,
        total: newItemTotal
      };

      // Create new array with updated item
      updatedOrderItems = [...orderItems];
      updatedOrderItems[existingItemIndex] = updatedItem;

      handleShowAlert("info", `Updated ${selectedItemName} quantity to ${newQuantity}`);
    } else {
      // Item doesn't exist - add as new item
      const newItem = {
        itemCode: selectedItem,
        description: selectedItemName,
        unitPrice: parseFloat(selectedItemUnitPrice),
        quantity: selectedItemQuantity,
        discountPercent: selectedItemDiscount,
        total: calculateItemTotal(),
      };

      updatedOrderItems = [...orderItems, newItem];
      handleShowAlert("success", `${selectedItemName} added to order`);
    }

    // Update state with new order items
    setOrderItems(updatedOrderItems);

    // Calculate new order total
    const newOrderTotal = updatedOrderItems.reduce(
      (acc, item) => acc + item.total,
      0,
    );
    setOrderTotal(newOrderTotal);
    setTotal(newOrderTotal);

    // Reset current item fields
    setSelectedItem("");
    setSelectedItemName("");
    setSelectedItemUnitPrice("");
    setSelectedItemQuantity(0);
    setSelectedItemDiscount(0);
    setSelectedItemSelectedLocationStock("0");
    setSpecialNote("");
  };
  const generatePDF = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const totalPagesExp = "{total_pages_count_string}";

    // --- helpers ---
    const leftX = 14;
    const rightX = 196;

    const fmtMoney = (n: number) =>
      Number(n || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const fmtDate = (d?: string) =>
      d
        ? new Date(d).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "2-digit",
        })
        : "";

    const nowStr =
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }) +
      ", " +
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const agedAsOfStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    autoTable(pdf, {
      startY: 0,
      theme: "plain",
      didDrawPage: () => {
        // Title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Aged Accounts Receivable", leftX, 12);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        // pdf.text("SKM UAT 2", leftX, 18);

        // Top-right meta
        pdf.setFontSize(9);
        pdf.text(nowStr, rightX, 10, { align: "right" });
        pdf.text(
          `Page ${pdf.getNumberOfPages()} / ${totalPagesExp}`,
          rightX,
          15,
          { align: "right" },
        );
        // pdf.text("OPS.MGR", rightX, 20, { align: "right" });

        // Sub-header (left)
        pdf.setFontSize(10);
        pdf.text(`Aged as of ${agedAsOfStr}`, leftX, 28);
        pdf.text("Aged by Due Date", leftX, 33);
        // pdf.text(
        //   `Customer No.: ${selectedCustomer?.customerCode ?? ""}`,
        //   leftX,
        //   38
        // );

        // Separator line
        pdf.setDrawColor(180);
        pdf.setLineWidth(0.2);
        pdf.line(leftX, 41, rightX, 41);

        // Customer band
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        const code = selectedCustomer?.customerCode ?? "";
        const name = selectedCustomer?.customerName ?? "";
        pdf.text(`${code} - ${name}`, leftX, 48);
      },
    });

    const head = [
      [
        "Posting Date",
        "Document Type",
        "Document No.",
        // "Due Date",
        "Invoiced Amount",
        "Balance before PDCs",
        "Released PDCs",
        "Balance after PDCs",
      ],
    ];

    const body = outstandingData.map((row) => [
      fmtDate(row.invoiceDate),
      "Invoice",
      row.invoiceNumber || "",
      // fmtDate(row.orderDate),
      fmtMoney(row.invoicedAmount),
      fmtMoney(row.balanceBeforePDCs),
      fmtMoney(row.releasedPDCs),
      fmtMoney(row.balanceAfterPDCs),
    ]);

    autoTable(pdf, {
      head,
      body,
      startY: 55,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 1.5,
        lineWidth: 0.2,
        lineColor: [220, 220, 220],
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 18 }, // Posting Date
        1: { cellWidth: 18 }, // Document Type
        2: { cellWidth: 28 }, // Document No.
        3: { cellWidth: 28, halign: "right" }, // invoice amount
        // 4: { cellWidth: 24, halign: "right" }, // Original Amount
        4: { cellWidth: 26, halign: "right" }, // Balance before PDCs
        5: { cellWidth: 22, halign: "right" }, // Released PDCs
        6: { cellWidth: 24, halign: "right" }, // Balance after PDCs
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: leftX, right: 14 },
    });

    const finalY = pdf.lastAutoTable?.finalY ?? 100;
    const subtotal = outstandingData[0].totalDueAmount || 0;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    const subtotalLabel = `Total for ${selectedCustomer?.customerName ?? ""}   LKR`;
    pdf.text(subtotalLabel, leftX, finalY + 8);
    pdf.text(fmtMoney(subtotal), rightX, finalY + 8, { align: "right" });

    // rule above grand total
    pdf.setDrawColor(150);
    pdf.setLineWidth(0.2);
    pdf.line(leftX, finalY + 12, rightX, finalY + 12);

    // grand total (LCY)
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Total (LCY)", leftX, finalY + 20);
    pdf.text(fmtMoney(subtotal), rightX, finalY + 20, { align: "right" });

    // finalize page count
    pdf.putTotalPages(totalPagesExp);

    // open in new tab
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleViewDetails = async () => {
    setIsLoading(true);
    setIsGeneratingPDF(true);
    if (!selectedCustomer) {
      handleShowAlert("error", "Please select a customer first");
      setIsLoading(false);
      setIsGeneratingPDF(false);
      return;
    }

    setIsLoadingInvoices(true);
    console.log("loading invoices", isLoadingInvoices);
    try {
      const response = await fetch(
        `/api/customerInvoice?customerCode=${selectedCustomer.customerCode}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customer invoices");
      }
      console.log(response);
      const data = await response.json();
      console.log("Fetched data:", data);
      const transformedData: CustomerOutstandingData[] = data.map(
        (invoice: Invoice) => ({
          customerName: selectedCustomer.customerName,
          totalDueAmount: invoice.totalDueAmount,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate
            ? new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
            : "N/A",
          orderdDate: invoice.orderDate
            ? new Date(invoice.orderDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
            : "N/A",
          invoicedAmount: parseFloat(invoice.totalAmount?.toString() || "0"),
          pdcAmount: parseFloat(invoice.pdcAmount?.toString() || "0"),
          dueAmount: parseFloat(invoice.dueAmount?.toString() || "0"),
          orderNo: invoice.orderNo,
          originalAmount: parseFloat(invoice.originalAmount?.toString() || "0"),
          balanceBeforePDCs: parseFloat(
            invoice.balanceBeforePDCs?.toString() || "0",
          ),
          releasedPDCs: parseFloat(invoice.releasedPDCs?.toString() || "0"),
          balanceAfterPDCs: parseFloat(
            invoice.balanceAfterPDCs?.toString() || "0",
          ),
        }),
      );

      setOutstandingData(transformedData);
      setSelectedCustomerDueAmount(data.totalDueAmount);
      //setFormattedAmount(data.totalDueAmount);
      handleShowAlert(
        "success",
        `Loaded ${transformedData.length} invoice record(s)`,
      );
    } catch (error) {
      console.error("Error:", error);
      handleShowAlert(
        "error",
        "Failed to fetch customer invoice data. This Cutomer does not have any invoices.",
      );
      setOutstandingData([]);
    } finally {
      setIsLoading(false);
      setIsLoadingInvoices(false);
      setIsGeneratingPDF(false);
    }
  };

  const handleCustomerChange = async (customerCode: string) => {
    console.log(customerCode);
    setCustomer(customerCode);

    // Use store helper instead of direct find
    const selected = getCustomerByCode(customerCode);
    if (selected) {
      setSelectedCustomer(selected);
      setOutstandingData(selected.outstandingData || []);

      // Show loading for due amount
      setIsLoadingDueAmount(true);
      setSelectedCustomerDueAmount(0);

      // Fetch due amount from API (keep this part as is)
      try {
        const response = await fetch(
          `/api/orders/getCustomerDueAmount?customerId=${customerCode}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          const dueAmountData = await response.json();
          setSelectedCustomerDueAmount(dueAmountData);
        } else {
          setSelectedCustomerDueAmount(selected.dueAmount);
        }
      } catch (error) {
        console.error("Error fetching customer due amount:", error);
        setSelectedCustomerDueAmount(selected.dueAmount);
      } finally {
        setIsLoadingDueAmount(false);
      }
    }
  };

  const updateCurrentItem = (name: string, value: string) => {
    console.log("Updating item:", value, name);
    setSelectedItem(value);
    const selected = itemsList.find((item) => item.itemCode === value);
    if (selected) {
      setSelectedItemUnitPrice(selected.unitprice);
      setSelectedItemName(name);
      setSelectedItemSelectedLocationStock(
        selected.locationWiseInventory
          ? selected.locationWiseInventory.find(
            (loc) => loc.locationCode === location,
          )?.inventory !== undefined
            ? String(
              selected.locationWiseInventory.find(
                (loc) => loc.locationCode === location,
              )?.inventory,
            )
            : "0"
          : "0",
      );
      // Fix: Handle both single object and array cases
      if (selected.substituteItems) {
        if (Array.isArray(selected.substituteItems)) {
          setSubstitutedItemsList(selected.substituteItems);
        } else {
          // Convert single object to array
          setSubstitutedItemsList([selected.substituteItems]);
        }
      } else {
        setSubstitutedItemsList([]);
      }
    } else {
      setSubstitutedItemsList([]);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/orders/create", {
        method: "POST",
        body: JSON.stringify({
          customerCode: selectedCustomer?.customerCode,
          locationCode: location,
          paymentMethodCode: paymentType,
          specialNote: specialNote,
          totalAmount: orderTotal,
          items: orderItems,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Success case - show backend success message or generic success
        const successMessage = data.message || "Order created successfully";
        handleShowAlert("success", successMessage);

        // Reset form after successful save
        setSelectedCustomer(null);
        setCustomer("");
        setLocation("");
        setPaymentType("");
        setSpecialNote("");
        setOrderItems([]);
        setOrderTotal(0);
        setTotal(0);
        setSelectedCustomerDueAmount(0);
      } else {
        // Error case - check for 403 status first
        if (response.status === 403) {
          handleShowAlert("error", "Not authorized to create order");
        } else {
          let errorMessage = "Order creation failed";

          if (data.details) {
            try {
              const parsedDetails = JSON.parse(data.details);

              if (
                parsedDetails.errors &&
                typeof parsedDetails.errors === "object"
              ) {
                const validationErrors: string[] = [];

                Object.keys(parsedDetails.errors).forEach((field) => {
                  const fieldErrors = parsedDetails.errors[field];
                  if (Array.isArray(fieldErrors)) {
                    validationErrors.push(...fieldErrors);
                  } else {
                    validationErrors.push(fieldErrors);
                  }
                });

                if (validationErrors.length > 0) {
                  errorMessage = validationErrors.join(", ");
                }
              }
              // Fallback to title or general message if no specific field errors
              else if (parsedDetails.title) {
                errorMessage = parsedDetails.title;
              } else if (parsedDetails.message) {
                errorMessage = parsedDetails.message;
              }
            } catch (e) {
              // If parsing fails, try to use details as string or fall back to main error message
              console.error("Error parsing details:", e);
              errorMessage =
                typeof data.details === "string"
                  ? data.details
                  : data.error || errorMessage;
            }
          }
          // If no details, use the main error message
          else if (data.error) {
            errorMessage = data.error;
          }

          handleShowAlert("error", errorMessage);
        }
        console.error("Order creation failed:", data);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      handleShowAlert("error", "Network error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
        <AppBar
          toggleSideNav={toggleSideNav}
          userRole={userRoleType}
          userName={userName}
          notificationData={pendingOrders}
        />
        <div className="flex flex-1 overflow-hidden">
          <SideNav isOpen={sideNavOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar
        toggleSideNav={toggleSideNav}
        userRole={userRoleType}
        userName={userName}
        notificationData={pendingOrders}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Order Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showAlert && (
            <Alert message={alertMessage} type={alertType} duration={5000} />
          )}
          <div className="flex-1 p-4 overflow-auto">
            {/* Order Form */}
            <div className="bg-white p-6 rounded-md shadow-sm mb-4">
              <h2 className="text-lg font-bold mb-4">Order</h2>

              {/*Location*/}
              <div className="mb-4 w-[250px]">
                <label className="block text-gray-700 font-medium mb-1.5">
                  Location:
                </label>
                <Select
                  className="w-full text-sm"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: "40px",
                      height: "40px",
                    }),
                  }}
                  options={locationOptions}
                  value={locationOptions.find((opt) => opt.value === location)}
                  onChange={(selected) => setLocation(selected?.value || "")}
                  placeholder={
                    isLoadingLocations
                      ? "Loading locations..."
                      : "Select a Location"
                  }
                  isSearchable
                  isLoading={isLoadingLocations}
                  isDisabled={isLoadingLocations}
                />
              </div>

              {/* Customer and Totals Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Customer:
                  </label>
                  <Select
                    className="w-full text-sm"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "41px",
                        height: "41px",
                      }),
                    }}
                    options={customerOptions}
                    value={
                      customerOptions.find((c) => c.value === customer) || null
                    }
                    onChange={(selected) =>
                      handleCustomerChange(selected?.value || "")
                    }
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    placeholder={
                      isLoadingCustomers
                        ? "Loading customers..."
                        : "Select a Customer"
                    }
                    isSearchable
                    isLoading={isLoadingCustomers}
                    isDisabled={isLoadingCustomers}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total Due Amount:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full p-2 border border-gray-200 rounded bg-gray-100 focus:outline-none"
                      value={
                        isLoadingDueAmount
                          ? "Loading..."
                          : Number(selectedCustomerDueAmount).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )
                      }
                      readOnly
                    />
                    {isLoadingDueAmount && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-start mt-2">
                    <button
                      disabled={isLoading}
                      onClick={handleViewDetails}
                      className={`font-medium py-2 px-4 mt-4 rounded-md transition duration-300 ${isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-900 hover:bg-blue-950 cursor-pointer"
                        } text-white`}
                    >
                      {isLoading
                        ? isGeneratingPDF
                          ? "Generating PDF..."
                          : "Loading..."
                        : "View Details"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-200 rounded bg-gray-100 focus:outline-none"
                    value={Number(orderTotal.toFixed(2)).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                    readOnly
                  />
                </div>
              </div>
              <div></div>

              {/* Payment Type and Notes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Payment Type:
                    </label>
                    <div className="relative">
                      <select
                        className="block w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-600 appearance-none"
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethodList.map((method) => (
                          <option
                            key={method.paymentMethodCode}
                            value={method.paymentMethodCode}
                          >
                            {method.description}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
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
                  </div>

                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Credit Allowed:
                        </span>
                        <span
                          className={
                            selectedCustomer?.creditAllowed
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {selectedCustomer?.creditAllowed ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Credit Limit:
                        </span>
                        <span className="text-gray-700">
                          {selectedCustomer?.creditLimit || "Not Set"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Note:
                  </label>
                  <textarea
                    className="block w-full p-2 border border-gray-300 rounded"
                    rows={3}
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-bold mb-4">Order Items</h2>

              {/* Item Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Items by Code:
                  </label>
                  <div className="relative">
                    <Select<Item>
                      options={location ? locationWiseItems : itemsList}
                      className="w-full text-sm"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "42px",
                          height: "42px",
                        }),
                      }}
                      value={
                        itemsList.find(
                          (item) => item.itemCode === selectedItem,
                        ) || null
                      }
                      onChange={(e) =>
                        updateCurrentItem(e?.itemName || "", e?.itemCode || "")
                      }
                      getOptionLabel={(option) => option.itemCode}
                      getOptionValue={(option) => option.itemCode}
                      placeholder="Select item code"
                      isSearchable
                    />
                  </div>
                  <label className="block text-gray-700 font-medium mb-1 mt-2">
                    Selected Item Description:
                  </label>
                  <textarea
                    className="block w-full p-2 border border-gray-200 rounded bg-gray-50 text-gray-700 text-sm mt-2 resize-none focus:outline-none cursor-default"
                    rows={2}
                    readOnly
                    value={
                      selectedItemName ||
                      "Select an item code to see the item description"
                    }
                  />
                  {selectedItem && (
                    <span
                      className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${location === ""
                        ? "bg-gray-100 text-gray-500"
                        : parseInt(selectedItemSelectedLocationStock) > 0
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-600 border border-red-300"
                        }`}
                    >
                      {location === ""
                        ? "Select a location to check stock"
                        : parseInt(selectedItemSelectedLocationStock) > 0
                          ? `✓ ${selectedItemSelectedLocationStock} in stock`
                          : "✗ Out of stock"}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Substitute Items:
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full p-2 border border-gray-300 rounded appearance-none"
                    // value={currentItem.itemName}
                    // onChange={(e) => updateCurrentItem("itemName", e.target.value)}
                    >
                      {substitutedItemsList?.length === 0 ? (
                        <option value="" disabled>
                          No substitute items available
                        </option>
                      ) : (
                        substitutedItemsList?.map((item, index) => (
                          <option key={index} value={item.itemName}>
                            {item.itemName}
                          </option>
                        ))
                      )}
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
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Unit Price:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-300 rounded"
                    //  value={parseFloat(selectedItemUnitPrice)}
                    value={Number(selectedItemUnitPrice).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                    disabled
                  />
                </div>
              </div>

              {/* Quantity, Discount, Total Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={selectedItemQuantity}
                    onChange={(e) => {
                      setSelectedItemQuantity(parseInt(e.target.value));
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Discount(%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="block w-full p-2 border border-gray-300 rounded"
                    value={selectedItemDiscount}
                    onChange={(e) =>
                      setSelectedItemDiscount(parseInt(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Total:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border border-gray-200 rounded bg-gray-100 focus:outline-none"
                    value={Number(
                      calculateItemTotal()
                        ? calculateItemTotal().toFixed(2)
                        : 0,
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none cursor-pointer"
                  onClick={addToList}
                >
                  Add To List
                </button>
              </div>

              {/* Order Items List */}
              {orderItems.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Order Items List
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-center">
                            Item No
                          </th>
                          <th className="py-2 px-4 border-b text-left">
                            Item Code
                          </th>
                          <th className="py-2 px-4 border-b text-left">
                            Item Name
                          </th>
                          <th className="py-2 px-4 border-b text-center">
                            Unit Price
                          </th>
                          <th className="py-2 px-4 border-b text-center">
                            Quantity
                          </th>
                          <th className="py-2 px-4 border-b text-center">
                            Discount(%)
                          </th>
                          <th className="py-2 px-4 border-b text-center">
                            Total
                          </th>
                          <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b text-center font-medium text-gray-600">
                              {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.itemCode}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {item.description}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {/* {item.unitPrice.toFixed(2)} */}
                              {Number(item.unitPrice.toFixed(2)).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {item.quantity}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {item.discountPercent.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {/* {item.total.toFixed(2)} */}
                              {Number(item.total.toFixed(2)).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              <button
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={() => {
                                  const newItems = [...orderItems];
                                  const removedItem = newItems.splice(
                                    index,
                                    1,
                                  )[0];
                                  console.log(removedItem);
                                  setOrderItems(newItems);

                                  // Update totals
                                  const newOrderTotal = newItems.reduce(
                                    (acc, item) => acc + item.total,
                                    0,
                                  );
                                  setOrderTotal(newOrderTotal);
                                  setTotal(newOrderTotal);
                                }}
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-200">
                          <td
                            colSpan={6}
                            className="py-3 px-4 text-right font-bold text-gray-700"
                          >
                            Order Total
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-blue-900 text-base">
                            {Number(orderTotal.toFixed(2)).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </td>
                          <td className="py-3 px-4 bg-blue-50"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Order Button */}
              {orderItems.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    disabled={isSaving}
                    onClick={handleSave}
                    className={`px-6 py-2 rounded font-medium transition duration-300 ${isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      } text-white`}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
