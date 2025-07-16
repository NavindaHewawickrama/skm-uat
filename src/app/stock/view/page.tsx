"use client";
import React, { useState, useEffect, useMemo } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import productImage from "../../../../public/images/products/pro1.png";
import ImagePopup from "@/components/ImagePopup";
import producctImage2 from "../../../../public/images/products/pro2.png";
import { StaticImageData } from 'next/image';
import Alert from "../../../components/Alert";

interface Image {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

interface StockItem {
  img?: string | StaticImageData;
  description: string;
  description2: string;
  unitOfMeasure: string;
  size: string;
  reorderQuantity: number;
  itemCode: string;
  itemName: string;
  location: string;
  stock: number | string;
  unitPrice: number;
  itemCategory: string;
  category: string;
  subCategory: string;
  image?: string;
}

// API Response Interface
interface ApiStockItem {
  itemCode: string;
  itemName: string;
  location: string;
  stock: string;
  unitPrice: number;
  itemCategory: string;
  category: string;
  subCategory: string;
  description: string;
  description2: string;
  unitOfMeasure: string;
  size: string;
  reorderQuantity: number;
  image?: string;
}

type OrderType = {
  orderNumber: number;
  customerName: string;
  salesPersonName: string;
  orderDate: string;
  paymentMethodType: string;
  totalAmount: number;
  orderedItems: { itemCode: string; description: string; unitPrice: number; quantity: string; discountPercent: number; total: number; }[];
  specialNote: string;
  rejectReason: string | null;
  status: string;
  delivertPersonName: string | null;
  deliveryDate: string | null;
  invoicedItems: string | null;
  trackingNumber: string | null;
};

const StockView = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState<string>("50");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRoleType, setUserRoleType] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<OrderType[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loadingItemCode, setLoadingItemCode] = useState<string | null>(null);
  const [loadingLocationCode, setLoadingLocationCode] = useState<string | null>(null);

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
    setUserName(sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : "");
    setUserRoleType(sessionStorage.getItem("userRoleName") ? sessionStorage.getItem("userRoleName") : "");
    // const pendingOrderList = sessionStorage.getItem("notificationsData");
    // setPendingOrders(pendingOrderList ? JSON.parse(pendingOrderList) : []);
  }, []);

  const defaultImage: Image = {
    ...producctImage2,
    width: producctImage2.width,
    height: producctImage2.height,
  };
  const [selectedProductImage, setSelectedProductImage] =
    useState<Image>(defaultImage);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };
  const handleShowAlert = (type: string, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);

    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // // Fetch stock data from API
  // useEffect(() => {
  //   // const fetchStockData = async () => {
  //   //   try {
  //   //     setLoading(true);
  //   //     setError(null);

  //   //     // const response = await fetch("/api/stock", {
  //   //     //   method: "GET",
  //   //     //   credentials: "include",
  //   //     // });

  //   //     // if (!response.ok) {
  //   //     //   throw Error("Failed to fetch stock data");
  //   //     // }

  //   //     // const apiData: ApiStockItem[] = await response.json();

  //   //     // // Transform API data to match component interface
  //   //     // const transformedData: StockItem[] = apiData.map((item) => ({
  //   //     //   itemCode: item.itemCode,
  //   //     //   itemName: item.itemName,
  //   //     //   location: item.location,
  //   //     //   stock: item.stock,
  //   //     //   unitPrice: item.unitPrice,
  //   //     //   itemCategory: item.itemCategory,
  //   //     //   category: item.category,
  //   //     //   subCategory: item.subCategory,
  //   //     //   description: item.description,
  //   //     //   description2: item.description2,
  //   //     //   unitOfMeasure: item.unitOfMeasure,
  //   //     //   size: item.size,
  //   //     //   reorderQuantity: item.reorderQuantity,
  //   //     //   image: item.image,
  //   //     //   img: item.image ? item.image : productImage,
  //   //     // }));

  //   //     // setStockItems(transformedData);
  //   //     const response = await fetch("/api/stock", {
  //   //       method: "GET",
  //   //       credentials: "include",
  //   //     });

  //   //     if (!response.ok) {
  //   //       throw new Error("Failed to fetch stock data");
  //   //     }

  //   //     const reader = response.body?.getReader();
  //   //     const decoder = new TextDecoder("utf-8");

  //   //     let buffer = "";
  //   //     let done = false;

  //   //     while (!done) {
  //   //       const { value, done: readerDone } = await reader!.read();
  //   //       done = readerDone;
  //   //       buffer += decoder.decode(value || new Uint8Array(), { stream: true });

  //   //       // Split buffer into JSON objects if backend sends newline-delimited JSON
  //   //       let lines = buffer.split("\n");

  //   //       // Keep the last partial line in the buffer
  //   //       buffer = lines.pop() || "";

  //   //       for (const line of lines) {
  //   //         if (line.trim()) {
  //   //           try {
  //   //             const item: ApiStockItem = JSON.parse(line);
  //   //             const transformed: StockItem = {
  //   //               itemCode: item.itemCode,
  //   //               itemName: item.itemName,
  //   //               location: item.location,
  //   //               stock: item.stock,
  //   //               unitPrice: item.unitPrice,
  //   //               itemCategory: item.itemCategory,
  //   //               category: item.category,
  //   //               subCategory: item.subCategory,
  //   //               description: item.description,
  //   //               description2: item.description2,
  //   //               unitOfMeasure: item.unitOfMeasure,
  //   //               size: item.size,
  //   //               reorderQuantity: item.reorderQuantity,
  //   //               image: item.image,
  //   //               img: item.image ? item.image : productImage,
  //   //             };

  //   //             // Append item as it arrives
  //   //             setStockItems(prev => [...prev, transformed]);
  //   //           } catch (err) {
  //   //             console.error("Failed to parse chunk", err);
  //   //           }
  //   //         }
  //   //       }
  //   //     }

  //   //     setLoading(false);

  //   //   } catch (err) {
  //   //     console.error("Error fetching stock data:", err);
  //   //     setError(
  //   //       err instanceof Error ? err.message : "Failed to fetch stock data"
  //   //     );
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // };

  //   fetchStockData();
  // }, []);

  // // const fetchStockData = async () => {
  // //   try {
  // //     setLoading(true);
  // //     setError(null);

  // //     const response = await fetch("/api/stock", {
  // //       method: "GET",
  // //       credentials: "include",
  // //     });

  // //     if (!response.ok) {
  // //       throw new Error("Failed to fetch stock data");
  // //     }

  // //     const reader = response.body?.getReader();
  // //     const decoder = new TextDecoder("utf-8");
  // //     let buffer = "";

  // //     if (!reader) throw new Error("Readable stream not supported");

  // //     while (true) {
  // //       const { done, value } = await reader.read();
  // //       if (done) break;

  // //       buffer += decoder.decode(value, { stream: true });

  // //       const lines = buffer.split("\n");
  // //       buffer = lines.pop() || ""; // Keep incomplete JSON in buffer

  // //       for (const line of lines) {
  // //         if (line.trim()) {
  // //           try {
  // //             const item: ApiStockItem = JSON.parse(line);

  // //             const transformed: StockItem = {
  // //               itemCode: item.itemCode,
  // //               itemName: item.itemName,
  // //               location: item.location,
  // //               stock: item.stock,
  // //               unitPrice: item.unitPrice,
  // //               itemCategory: item.itemCategory,
  // //               category: item.category,
  // //               subCategory: item.subCategory,
  // //               description: item.description,
  // //               description2: item.description2,
  // //               unitOfMeasure: item.unitOfMeasure,
  // //               size: item.size,
  // //               reorderQuantity: item.reorderQuantity,
  // //               image: item.image,
  // //               img: item.image ? item.image : productImage,
  // //             };

  // //             // Add each item as it streams in
  // //             setStockItems(prev => [...prev, transformed]);
  // //           } catch (parseErr) {
  // //             console.error("JSON parse error:", parseErr);
  // //           }
  // //         }
  // //       }
  // //     }

  // //     setLoading(false);
  // //   } catch (err) {
  // //     console.error("Error fetching stock data:", err);
  // //     setError(
  // //       err instanceof Error ? err.message : "Failed to fetch stock data"
  // //     );
  // //     setLoading(false);
  // //   }
  // // };


  // // Filter items based on search query

  // const fetchStockData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await fetch("/api/stock", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch stock data");
  //     }

  //     const reader = response.body?.getReader();
  //     const decoder = new TextDecoder("utf-8");
  //     let buffer = "";

  //     if (!reader) throw new Error("Readable stream not supported");

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       buffer += decoder.decode(value, { stream: true });

  //       const lines = buffer.split("\n");
  //       buffer = lines.pop() || ""; // Keep incomplete line

  //       for (const line of lines) {
  //         if (line.trim()) {
  //           try {
  //             const item: ApiStockItem = JSON.parse(line);

  //             const transformed: StockItem = {
  //               itemCode: item.itemCode,
  //               itemName: item.itemName,
  //               location: item.location,
  //               stock: item.stock,
  //               unitPrice: item.unitPrice,
  //               itemCategory: item.itemCategory,
  //               category: item.category,
  //               subCategory: item.subCategory,
  //               description: item.description,
  //               description2: item.description2,
  //               unitOfMeasure: item.unitOfMeasure,
  //               size: item.size,
  //               reorderQuantity: item.reorderQuantity,
  //               image: item.image,
  //               img: item.image ? item.image : productImage,
  //             };

  //             setStockItems(prev => [...prev, transformed]);
  //           } catch (parseErr) {
  //             console.error("JSON parse error:", parseErr);
  //           }
  //         }
  //       }
  //     }

  //     setLoading(false);
  //   } catch (err) {
  //     console.error("Error fetching stock data:", err);
  //     setError(
  //       err instanceof Error ? err.message : "Failed to fetch stock data"
  //     );
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    fetchStockData();
  }, []);
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stock", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const apiData: ApiStockItem[] = await response.json();

      const transformedData = apiData.reduce<StockItem[]>((acc, item) => {
        acc.push({
          itemCode: item.itemCode,
          itemName: item.itemName,
          location: item.location,
          stock: item.stock,
          unitPrice: item.unitPrice,
          itemCategory: item.itemCategory,
          category: item.category,
          subCategory: item.subCategory,
          description: item.description,
          description2: item.description2,
          unitOfMeasure: item.unitOfMeasure,
          size: item.size,
          reorderQuantity: item.reorderQuantity,
          image: item.image,
          img: item.image ? item.image : productImage,
        });
        return acc;
      }, []);

      setStockItems(transformedData);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };


  const filteredItems = useMemo(() => {
    return stockItems.filter(
      (item) =>
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stockItems, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / parseInt(entriesPerPage));
  }, [filteredItems.length, entriesPerPage]);

  const displayedItems = useMemo(() => {
    const itemsPerPage = parseInt(entriesPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, entriesPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, entriesPerPage]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
  };

  const handleViewImage = async (itemNo: string, location: string) => {
    // setOpenImagePopup(true);

    // if (typeof img === "string") {
    //   const base64Image = `data:image/jpeg;base64,${img}`;
    //   setSelectedProductImage({
    //     src: base64Image,
    //     width: 400,
    //     height: 300,
    //   });
    // } else if (img && typeof img === "object") {
    //   // Handle StaticImageData - convert to Image format
    //   setSelectedProductImage({
    //     src: img.src,
    //     width: img.width || 400,
    //     height: img.height || 300,
    //   });
    // }
    //console.log(itemCode);

    setLoadingItemCode(itemNo);
    setLoadingLocationCode(location);
    try {
      const response = await fetch(`/api/stock/viewImage?itemNo=${itemNo}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        handleShowAlert("error", "Failed to fetch product image");
        throw new Error("Failed to fetch product image");
      }

      const text = await response.text();

      if (!text) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text);

      setOpenImagePopup(true); // Only open popup on successful parse

      if (typeof data === "string") {
        const base64Image = `data:image/jpeg;base64,${data}`;
        setSelectedProductImage({
          src: base64Image,
          width: 400,
          height: 300,
        });
      } else if (data && typeof data === "object") {
        setSelectedProductImage({
          src: data.src,
          width: data.width || 400,
          height: data.height || 300,
        });
      }
    } catch (error) {
      console.error("Error fetching product image:", error);
      handleShowAlert("error", "Failed to fetch product image");
    } finally {
      setLoadingItemCode(null);
      setLoadingLocationCode(null);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
        <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} userName={userName} notificationData={pendingOrders} />
        <div className="flex flex-1 overflow-hidden">
          <SideNav isOpen={sideNavOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">
                Loading stock data...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
        <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} userName={userName} notificationData={pendingOrders} />
        <div className="flex flex-1 overflow-hidden">
          <SideNav isOpen={sideNavOpen} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Error Loading Data
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      <AppBar toggleSideNav={toggleSideNav} userRole={userRoleType} userName={userName} notificationData={pendingOrders} />

      <div className="flex flex-1 overflow-hidden">
        <SideNav isOpen={sideNavOpen} />
        {showAlert && (
          <Alert message={alertMessage} type={alertType} duration={5000} />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            {/* Table Controls */}
            <div className="bg-white p-4 flex flex-wrap justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span>Show</span>
                <select
                  className="border rounded p-1"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <span>Search:</span>
                  <input
                    type="text"
                    className="border rounded p-1 w-48"
                    placeholder="Type Here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Stock Items Table */}
            <div className="bg-white overflow-x-auto overflow-y-auto shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Item Code
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Item Cat.
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Sub Category
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Image
                    </th>
                    {/* <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Description 2
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Unit of Measure
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
                      Reorder Quantity
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedItems.map((item, index) => (
                    <tr
                      key={`${item.itemCode}-${item.location}-${index}`}
                      className={`hover:bg-red ${item.location === "Colombo 10" ? "bg-[#bbd2fc]" : item.location === "RGM-SKM01" ? "bg-[#62b1ff]" : item.location === "COLOMBO-RETAIL-01-SKM" ? "bg-[#fa8484]" : item.location === "COLOMBO-RETAIL-02-SNS" ? "bg-[#9cffff]" : item.location === "WELISARA-WH-01-SKM" ? "bg-[#f2fa84]" : item.location === "WELISARA-WH-01-SNS" ? "bg-[#84fa84]" : "bg-[#ffffff]"
                        }`}
                    // className={`hover:bg-red ${item.location === "Colombo 10" ? "bg-[#bbd2fc]" : item.location === "RGM-SKM01" ? "bg-[#62b1ff]" : item.location === "COLOMBO-RETAIL-SKM" ? "bg-[#fa8484]" : item.location === "COLOMBO-RETAIL-SNS" ? "bg-[#9cffff]" : item.location === "WELISARA-WH01-SKM" ? "bg-[#f2fa84]" : item.location === "WELISARA-WH01-SNS" ? "bg-[#84fa84]" : "bg-[#ffffff]"
                    //   }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                        {item.itemCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 text-center">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-center">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.stock == "0+" ? "0" : item.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.unitPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.itemCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-900">
                        {item.subCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        <button
                          className="bg-blue-900 hover:bg-blue-950 text-white py-1 px-4 rounded focus:outline-none cursor-pointer flex items-center justify-center gap-2"
                          onClick={() => handleViewImage(item.itemCode, item.location)}
                        >
                          {((loadingItemCode === item.itemCode) && (loadingLocationCode === item.location)) && (
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          )}
                          View
                        </button>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.description2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.unitOfMeasure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.reorderQuantity}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 mt-4 flex flex-wrap justify-between items-center">
              <div className="text-sm">
                Showing{" "}
                {filteredItems.length > 0
                  ? (currentPage - 1) * parseInt(entriesPerPage) + 1
                  : 0}{" "}
                to{" "}
                {Math.min(
                  currentPage * parseInt(entriesPerPage),
                  filteredItems.length
                )}{" "}
                of {filteredItems.length} entries
              </div>
              <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded cursor-pointer ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
                    }`}
                >
                  Previous
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    className={`px-3 py-1 border rounded ${page === currentPage
                      ? "bg-blue-500 text-white"
                      : page === "..."
                        ? ""
                        : "hover:bg-gray-100"
                      }`}
                    disabled={page === "..."}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 border rounded cursor-pointer ${currentPage === totalPages || totalPages === 0
                    ? "text-gray-400"
                    : "hover:bg-gray-100"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <ImagePopup
            open={openImagePopup}
            onClose={() => setOpenImagePopup(false)}
            image={selectedProductImage}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StockView;
