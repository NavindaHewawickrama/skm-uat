import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartData {
  deliveredCount: number;
  rejectedCount: number;
  pendingCount: number;
}

const SalesChart = ({ pieChartData }: { pieChartData: PieChartData }) => {
  // Check if all data values are 0
  const hasData = pieChartData.deliveredCount > 0 ||
    pieChartData.rejectedCount > 0 ||
    pieChartData.pendingCount > 0;

  const data = {
    labels: ["Delivered", "Rejected", "Pending"],
    datasets: [
      {
        data: [pieChartData.deliveredCount, pieChartData.rejectedCount, pieChartData.pendingCount],
        backgroundColor: ["#8F87F1", "#E9A5F1", "#261FB3"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: (context: { chart: { width: number } }) => {
              const width = context.chart.width;
              return width < 300 ? 10 : 12;
            },
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md aspect-square">
        {hasData ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">📊</div>
              <p className="text-gray-500 text-sm">No Order details...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;