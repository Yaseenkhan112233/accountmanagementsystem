import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Truck,
  LayoutDashboard,
  Car,
  User,
  Wrench,
  Fuel,
  Box,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isFleetExpanded, setIsFleetExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fleetMenuItems = [
    { icon: <Car size={20} />, label: "Vehicle", path: "/vehicle" },
    { icon: <User size={20} />, label: "Driver", path: "/driver" },
    { icon: <Wrench size={20} />, label: "Maintenance", path: "/maintenance" },
    { icon: <Fuel size={20} />, label: "Fuel", path: "/fuel" },
    { icon: <Box size={20} />, label: "Parts", path: "/parts" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:w-64
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"}`}
      >
        {/* Dashboard Link */}
        <div className="p-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 rounded-lg transition-colors duration-150 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </NavLink>
        </div>

        {/* Expenses Dropdown */}
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800"
          onClick={() => setIsFleetExpanded(!isFleetExpanded)}
        >
          <div className="flex items-center gap-3">
            <Truck size={24} />
            <span className="font-semibold">Expenses</span>
          </div>
          {isFleetExpanded ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </div>

        {/* Fleet Navigation Items */}
        {isFleetExpanded && (
          <div className="flex-1 overflow-y-auto">
            {fleetMenuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 transition-colors duration-150 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Report Link */}
        <div className="p-1">
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 transition-colors duration-150 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <BarChart2 size={20} />
            <span className="text-sm">Report</span>
          </NavLink>
        </div>

        {/* Settings Link */}
        <div className="p-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 transition-colors duration-150 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
