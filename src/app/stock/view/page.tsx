"use client";
import React, { useState, useEffect, useMemo } from "react";
import AppBar from "../../../components/Appbar";
import SideNav from "../../../components/Sidenav";
import Footer from "../../../components/Footer";
import productImage from "../../../../public/images/products/pro1.png";
import ImagePopup from "@/components/ImagePopup";
import producctImage2 from "../../../../public/images/products/pro2.png"

interface Image {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string; // Optional property
  blurWidth?: number;   // Optional property
  blurHeight?: number;  // Optional property
}

interface StockItem {
  img: any;
  description: string;
  description2: string;
  unitMeasure: string;
  size: string;
  reQuantity: string;
  itemCode: string;
  itemName: string;
  location: string;
  stock: number | string;
  unitPrice: number;
  itemCat: string;
  category: string;
  subCategory: string;
}

const StockView = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState<string>("50");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openImagePopup, setOpenImagePopup] = useState(false);

  const defaultImage: Image = {
    ...producctImage2, // Provide a default image URL or a placeholder
    width: producctImage2.width,
    height: producctImage2.height,
  };
  const [selectedProductImage,setSelectedProductImage] = useState<Image>(defaultImage);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  // Sample data
  const stockItems: StockItem[] = [
    {
      itemCode: "01-1067",
      itemName: "38X74X11 T1067 LH50/60/70 DRIVE PINION",
      location: "Head Office",
      stock: "20",
      unitPrice: 720,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1067",
      itemName: "38X74X11 T1067 LH50/60/70 DRIVE PINION",
      location: "Warehouse",
      stock: "40+",
      unitPrice: 720,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: producctImage2,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1068",
      itemName: "38X44X18 T1068 COASTER RB2 R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 490,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1068",
      itemName: "38X44X18 T1068 COASTER RB2 R/W OUTER",
      location: "Warehouse",
      stock: "40+",
      unitPrice: 490,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1086",
      itemName: "50X70X9 T1086 HIACE R/W INNER",
      location: "Head Office",
      stock: "20",
      unitPrice: 690,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1086",
      itemName: "50X70X9 T1086 HIACE R/W INNER",
      location: "Warehouse",
      stock: "40+",
      unitPrice: 690,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1088",
      itemName: "50X68X9 T1088 HIACE FRONT WHEEL",
      location: "Head Office",
      stock: "0",
      unitPrice: 960,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1088",
      itemName: "50X68X9 T1088 HIACE FRONT WHEEL",
      location: "Warehouse",
      stock: "0",
      unitPrice: 960,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-2004",
      itemName: "73X74X11 T1067 LH50/60/70 DRIVE PINION",
      location: "Warehouse",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
    {
      itemCode: "01-1115",
      itemName: "48X62X9X24 T1115 HIACE R/W OUTER",
      location: "Head Office",
      stock: "10",
      unitPrice: 790,
      itemCat: "TKK",
      category: "OIL SEAL",
      subCategory: "TOYOTA",
      img: productImage,
      description: "-",
      description2: "-",
      unitMeasure: "kg",
      size: "-",
      reQuantity: "5",
    },
  ];

  // Filter items based on search query
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
      // If we have fewer pages than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at edges
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always include last page
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

  // Handle entries per page change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(e.target.value);
  };

  function handleViewImage(img: any): void {
    setOpenImagePopup(true);
    setSelectedProductImage(img);
    console.log(img);
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* App Bar */}
      <AppBar toggleSideNav={toggleSideNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav isOpen={sideNavOpen} />

        {/* Stock View Content */}
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
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
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
                    <th className="px-6 py-3 text-center text-sm font-bold text-black tracking-wider">
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
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedItems.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-red ${item.location === "Warehouse" ? "bg-[#bbd2fc]" : ""
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.itemCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {/* {item.location === "Warehouse" ? (
                          <span className="px-2 py-1 bg-red-500 text-white rounded">
                            {item.location}
                          </span>
                        ) : (
                          <span className="text-gray-900">{item.location}</span>
                        )} */}
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center  text-sm text-gray-900">
                        {item.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.unitPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.itemCat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.subCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {/* {item.img} */}
                        <button className="bg-blue-900 hover:bg-blue-950 text-white py-1 px-4 rounded focus:outline-none cursor-pointer" onClick={() => handleViewImage(item.img)}>
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.description2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.unitMeasure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.reQuantity}
                      </td>
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
          <ImagePopup open={openImagePopup} onClose={() => setOpenImagePopup(false)} image={selectedProductImage}/>
          {/* Footer Component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StockView;
