// pages/report/[orderNo].tsx

import { useRouter } from "next/router";
import { useRef } from "react";
import html2pdf from "html2pdf.js"; // use import instead of require

const ReportPage = () => {
  const router = useRouter();
  const { orderNo } = router.query;
  const reportRef = useRef(null);

  if (!orderNo) return <div>Loading...</div>;

  const orderDetails = {
    orderNo,
    itemDetails: [
      { itemName: "Item A", unitPrice: 10, quantity: 2, discount: 0, total: 20 },
      { itemName: "Item B", unitPrice: 15, quantity: 1, discount: 5, total: 10 },
    ],
  };

  const downloadPDF = () => {
    if (reportRef.current) {
      html2pdf().from(reportRef.current).save(`Order-${orderNo}.pdf`);
    }
  };
  
  if (!orderNo) return <div>Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Report - Order #{orderDetails.orderNo}</h2>
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      <div ref={reportRef} className="bg-white shadow p-4 rounded">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Item Name</th>
              <th className="px-4 py-2 text-left">Unit Price</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Discount</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.itemDetails.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{item.itemName}</td>
                <td className="px-4 py-2">{item.unitPrice}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.discount}</td>
                <td className="px-4 py-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;
