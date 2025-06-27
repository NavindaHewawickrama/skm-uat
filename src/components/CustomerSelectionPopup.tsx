"use client";

import React, { useState, useMemo, useEffect } from "react";

interface Customer {
  customerCode: string;
  customerName: string;
}

interface CustomerSelectionPopupProps {
  open: boolean;
  onClose: () => void;
  onAdd: (selectedCustomers: string[]) => void;
  customersList: Customer[];
}

const CustomerSelectionPopup: React.FC<CustomerSelectionPopupProps> = ({
  open,
  onClose,
  onAdd,
  customersList,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    return customersList.filter(
      (customer) => customer.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customersList, searchQuery]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredCustomers.length / entriesPerPage);
  }, [filteredCustomers.length, entriesPerPage]);

  // Get current page items
  const displayedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, entriesPerPage]);

  // Reset page when search or entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, entriesPerPage]);

  // Update selectAll state when selectedCustomers changes
  useEffect(() => {
    setSelectAll(filteredCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length);
  }, [selectedCustomers, filteredCustomers]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.customerCode));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    console.log("Selected Customer ID:", customerId);
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  // const handleAdd = () => {
  //   onAdd(selectedCustomers);
  //   // Reset selections after adding
  //   setSelectedCustomers([]);
  //   onClose();
  // };

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

  // Handle Select button click - send selected customers to parent
  const handleSelectButton = () => {
    // Get full customer objects for selected customer codes
    const selectedCustomerObjects = customersList.filter(customer =>
      selectedCustomers.includes(customer.customerCode)
    );

    console.log("Selected customers being sent to parent:", selectedCustomerObjects);
    onAdd(selectedCustomers);
    setSelectedCustomers([]);
    onClose();
  };

  // Reset selections when popup closes
  const handleClose = () => {
    setSelectedCustomers([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 overflow-auto p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded shadow-lg overflow-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Outstanding Customers</h2>

          <button onClick={handleClose} className="bg-white rounded-md p-1 sm:p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 cursor-pointer">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <hr className="border-t-2 border-gray-300 my-2 sm:my-4" />

          {/* Checkbox for "All" */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <label htmlFor="selectAll">All</label>
          </div>

          {/* Add button */}
          {/* <div className="mb-4">
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedCustomers.length === 0}
            >
              Add {selectedCustomers.length > 0 ? `(${selectedCustomers.length})` : ''}
            </button>
          </div> */}

          {/* Table controls */}
          <div className="flex flex-wrap justify-between mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="mr-2">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="ml-2">entries</span>
            </div>

            <div className="flex items-center">
              <span className="mr-2">Search:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type Here..."
                className="border rounded px-2 py-1 focus:outline-none focus:ring-1"
              />
            </div>
          </div>

          {/* Customer table */}
          <div className="overflow-x-auto max-h-64">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-center font-bold text-black tracking-wider border">
                    #.No
                  </th>
                  <th className="px-4 py-2 text-left font-bold text-black tracking-wider border">
                    Customer Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedCustomers.length > 0 ? (
                  displayedCustomers.map((customer) => (
                    <tr
                      key={customer.customerCode}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectCustomer(customer.customerCode)}
                    >
                      <td className="px-4 py-2 border text-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.customerCode)}
                          onChange={() => handleSelectCustomer(customer.customerCode)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        {customer.customerName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-2 text-center border">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info and controls */}
          <div className="mt-4 flex flex-wrap justify-between items-center">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing {filteredCustomers.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
              {selectedCustomers.length > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({selectedCustomers.length} selected)
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              <button
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  className={`px-3 py-1 rounded ${page === currentPage
                    ? "bg-blue-500 text-white"
                    : page === "..."
                      ? "bg-gray-200 cursor-default"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}

              <button
                className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Select button */}
        <div className="bg-gray-100 px-4 py-3 flex justify-end">
          <button
            onClick={handleSelectButton}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 focus:outline-none cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={selectedCustomers.length === 0}
          >
            Select ({selectedCustomers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelectionPopup;