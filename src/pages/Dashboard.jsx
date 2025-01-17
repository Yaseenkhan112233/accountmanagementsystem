import React from "react";
import {
  Truck,
  Users,
  LayoutGrid,
  Wrench,
  Fuel,
  Box,
  BarChart2,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
    <div
      className={`w-full max-w-[120px] h-2 rounded-full ${color} opacity-20`}
    />
  </div>
);

const FleetDashboard = () => {
  const stats = [
    { icon: Truck, title: "Vehicles", value: "12", color: "bg-blue-500" },
    { icon: Users, title: "Drivers", value: "20", color: "bg-gray-700" },
    { icon: Wrench, title: "Maintenance", value: "73", color: "bg-green-500" },
    { icon: Fuel, title: "Fuel", value: "17", color: "bg-green-500" },
    { icon: Box, title: "Parts", value: "21", color: "bg-gray-700" },
    { icon: BarChart2, title: "Report", value: "18", color: "bg-red-500" },
  ];

  // Chart data
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Net Income",
        data: [12000, 15000, 13000, 18000, 17000, 20000],
        borderColor: "rgba(34, 197, 94, 1)", // Green
        backgroundColor: "rgba(34, 197, 94, 0.2)", // Light green
        tension: 0.4,
        fill: true,
      },
      {
        label: "Income",
        data: [20000, 25000, 22000, 30000, 27000, 35000],
        borderColor: "rgba(59, 130, 246, 1)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.2)", // Light blue
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: [8000, 10000, 9000, 12000, 10000, 15000],
        borderColor: "rgba(239, 68, 68, 1)", // Red
        backgroundColor: "rgba(239, 68, 68, 0.2)", // Light red
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures flexibility
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Financial Overview",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="p-2 bg-blue-100 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
          </span>
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Financial Graph */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Financial Overview
        </h2>
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default FleetDashboard;
