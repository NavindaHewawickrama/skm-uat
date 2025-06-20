"use client";

import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  description: string;
  unitPrice: string | number;
  quantity: string | number;
  discountPercent: string | number;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  orderDetails: OrderItem[];
}

const ViewOrderEditPopupButton: React.FC<ModalProps> = ({ open, onClose, orderDetails }) => {

//  console.log(orderDetails);

  if (!open) return null;

  const generatePDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Order Items Details Report", 105, 15, { align: "center" });

    const currentDate = new Date().toLocaleDateString("en-US");
    pdf.setFontSize(10);
    pdf.text(currentDate, 195, 15, { align: "right" });

    const tableColumn = [
      "Item Code",
      "Unit Price",
      "Quantity",
      "Discount(%)",
      "Total",
    ];

    // Fix 1: Use correct variable names and calculate total
    const tableRows = orderDetails.map((item) => {
      // Calculate total = (unitPrice * quantity) - discount
      const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) : item.quantity;
      const discountPercent = typeof item.discountPercent === 'string' ? parseFloat(item.discountPercent.toString()) : item.discountPercent;

      const subtotal = unitPrice * quantity;
      const discountAmount = subtotal * (discountPercent / 100);
      const total = subtotal - discountAmount;


      return [
        item.description,           // Item Code/Description
        Number(item.unitPrice).toFixed(2),  // Unit Price
        item.quantity,              // Quantity  
        `${item.discountPercent}%`, // Discount Percent
        total.toFixed(2)            // Total
      ];
    });

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Fix 2: Calculate grand total from orderDetails
    const grandTotal = orderDetails.reduce((sum, item) => {
      const unitPrice = Number(item.unitPrice);           // Convert to number
      const quantity = Number(item.quantity);             // Convert to number  
      const discountPercent = Number(item.discountPercent); // Convert to number

      const subtotal = unitPrice * quantity;
      const discountAmount = subtotal * (discountPercent / 100);
      const total = subtotal - discountAmount;
      return sum + total;
    }, 0);

    const finalY = pdf.lastAutoTable?.finalY || 60;
    pdf.setFontSize(12);
    pdf.text(
      `Grand Total: ${grandTotal.toFixed(2)}`,
      195,
      finalY + 10,
      { align: "right" }
    );

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 overflow-auto p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-sm overflow-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-row justify-between mb-3 sm:mb-5">
            <h4 className="capitalize font-medium text-lg sm:text-xl md:text-2xl truncate">
              {/* order details - {orderDetails.orderNo} */}
            </h4>

            <p
              className="font-medium cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-[1.3] hover:text-red-600"
              onClick={onClose}
            >
              <button type="button" className="bg-white rounded-md p-1 sm:p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 cursor-pointer">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </p>
          </div>
          <hr className="border-t-2 border-gray-300 my-3 sm:my-4" />

          {/* Items Table */}
          <div className="w-full overflow-x-auto">
            <div className="overflow-auto max-h-[250px] sm:max-h-[300px] md:max-h-[400px] p-1 sm:p-2 rounded-sm">
              <table className="min-w-full rounded-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-black tracking-wider">
                      Item Name
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-black tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-black tracking-wider">
                      Qty
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-black tracking-wider">
                      Discount
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold text-black tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {orderDetails.map((item: OrderItem, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                        {item.description}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                        {item.unitPrice}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                        {item.discountPercent}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">
                        {/* {item.description} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-6">
            {/* Generate Report Button */}
            <button
              onClick={generatePDF}
              className="bg-blue-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-950 text-xs sm:text-sm cursor-pointer"
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOrderEditPopupButton;