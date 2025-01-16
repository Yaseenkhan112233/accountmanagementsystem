import React from "react";
import {
  Truck,
  Users,
  User,
  Store,
  Calendar as CalendarIcon,
  FileText,
  Clipboard,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  BarChart2,
  Wrench,
  Fuel,
  Box,
} from "lucide-react";

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

const CalendarEvent = ({ text, color = "bg-orange-500" }) => (
  <div className={`${color} text-white text-sm p-1 rounded mb-1 truncate`}>
    {text}
  </div>
);

const FleetDashboard = () => {
  const stats = [
    { icon: Truck, title: "Vehicles", value: "12", color: "bg-blue-500" },
    { icon: Users, title: "Drivers", value: "20", color: "bg-gray-700" },
    // { icon: User, title: "Customers", value: "65", color: "bg-amber-500" },
    { icon: Wrench, title: "Maintenance", value: "73", color: "bg-green-500" },

    { icon: Fuel, title: "Fuel", value: "17", color: "bg-green-500" },
    {
      icon: Box,
      title: "Parts",
      value: "21",
      color: "bg-gray-700",
    },
    { icon: BarChart2, title: "Report", value: "18", color: "bg-red-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="p-2 bg-blue-100 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
          </span>
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default FleetDashboard;
