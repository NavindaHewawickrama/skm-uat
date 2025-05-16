"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderItemsReport() {
  const params = useParams();
  const orderNo = params.orderNo as string;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate the PDF on component mount
    generateOrderItemsReport();
  }, []);

  const generateOrderItemsReport = () => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font size for title
    doc.setFontSize(20);
    doc.text("Order Items Detail Report.", doc.internal.pageSize.width / 2, 15, { align: "center", });
    
    // Add company name to the right
    doc.setFontSize(12);
    doc.text("UDITHA MOTOR TRADERS", doc.internal.pageSize.width - 20, 30, { align: "right" });
    
    // Add order information
    doc.setFontSize(10);
    doc.text(`Order NO    : ${orderNo || "72333622"}`, 20, 50);
    doc.text("Payment Type : credit", 20, 55);
    doc.text("Order Note    :", 20, 60);
    
    // Add current date to the right
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric"
    });
    doc.text(currentDate, doc.internal.pageSize.width - 20, 60, { align: "right" });
    
    // Sample data for the table
    const tableData = [
      ["04-3515", "790.00", "2.00", "25.00", "1185.00"],
      ["04-3606", "890.00", "4.00", "25.00", "2670.00"],
      ["BF1000", "4480.00", "2.00", "25.00", "6720.00"],
      ["BF500", "2550.00", "2.00", "25.00", "3825.00"],
      ["SC4514R", "310.00", "10.00", "25.00", "2325.00"],
      ["SC4515R", "290.00", "10.00", "25.00", "2175.00"],
      ["SC47593R", "325.00", "10.00", "25.00", "2437.50"],
      ["SK41201", "1120.00", "2.00", "25.00", "1680.00"],
      ["SKW-1791", "1260.00", "10.00", "25.00", "9450.00"],
      ["SKW-31151-2", "1460.00", "10.00", "25.00", "10950.00"],
      ["SKW-43671", "2330.00", "1.00", "25.00", "1747.50"],
      ["SKW-50241", "1485.00", "10.00", "25.00", "11137.50"],
      ["SKW-51591", "2330.00", "2.00", "25.00", "3495.00"],
    ];
    
    // Add index numbers to the data
    const dataWithIndex = tableData.map((row, index) => {
      return [(index + 1).toString(), ...row];
    });
    
    // Create table with auto table
    autoTable(doc, {
      startY: 70,
      head: [["", "Item Code", "Unit Price", "Quantity", "Discount(%)", "Total"]],
      body: dataWithIndex,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 40 },
      },
    });
    
    // Convert to data URL for preview
    const dataUrl = doc.output("dataurlstring");
    setPdfUrl(dataUrl);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-16 bg-gray-800 flex-shrink-0 hidden sm:block">
          {/* Thumbnail area - simplification of the sidebar in the screenshot */}
          <div className="p-2 border border-blue-500 m-2 bg-white">
            <div className="w-full h-12 bg-gray-200"></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {pdfUrl && (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full border-0"
              title="Order Items Report"
            />
          )}
        </div>
      </div>
    </div>
  );
}