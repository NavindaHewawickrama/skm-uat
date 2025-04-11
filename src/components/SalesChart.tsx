import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesChart = ({ deliveredCount = 18898 }) => {
    const data = {
        labels: ["Delivered", "Pending", "Cancelled"],
        datasets: [
            {
                data: [deliveredCount, 5002, 1200], // Example data
                backgroundColor: ["#8F87F1", "#E9A5F1", "#261FB3"],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
    };

    return (
        <div className="w-[450px] h-[350px] mx-auto ">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default SalesChart;
