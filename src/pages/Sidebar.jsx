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
  DollarSign,
  Users,
  Package,
  FileText,
} from "lucide-react";

const Sidebar = () => {
  const [dropdownState, setDropdownState] = useState({
    fleet: true,
    sales: false,
    clients: false,
    suppliers: false,
    transactions: false,
    reports: false,
    settings: false,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = (menu) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const menuItems = {
    fleet: [
      { icon: <Car size={20} />, label: "Vehicle", path: "/vehicle" },
      { icon: <User size={20} />, label: "Driver", path: "/driver" },
      {
        icon: <Wrench size={20} />,
        label: "Maintenance",
        path: "/maintenance",
      },
      { icon: <Fuel size={20} />, label: "Fuel", path: "/fuel" },
      { icon: <Box size={20} />, label: "Parts", path: "/parts" },
    ],
    sales: [
      {
        icon: <DollarSign size={20} />,
        label: "New Income",
        path: "/sales/new-income",
      },
      {
        icon: <DollarSign size={20} />,
        label: "Manage Income",
        path: "/sales/manage-income",
      },
    ],
    clients: [
      {
        icon: <Users size={20} />,
        label: "New Client",
        path: "/clients/new-client",
      },
      {
        icon: <Users size={20} />,
        label: "Manage Clients",
        path: "/clients/manage-clients",
      },
    ],
    suppliers: [
      {
        icon: <Package size={20} />,
        label: "New Supplier",
        path: "/suppliers/new-supplier",
      },
      {
        icon: <Package size={20} />,
        label: "Manage Suppliers",
        path: "/suppliers/manage-suppliers",
      },
    ],
    transactions: [
      {
        icon: <FileText size={20} />,
        label: "View Transactions",
        path: "/transactions/view",
      },
      {
        icon: <FileText size={20} />,
        label: "New Transaction",
        path: "/transactions/new",
      },
      {
        icon: <DollarSign size={20} />,
        label: "Income",
        path: "/transactions/income",
      },
      {
        icon: <Truck size={20} />,
        label: "Expense",
        path: "/transactions/expense",
      },
    ],
    reports: [
      {
        icon: <BarChart2 size={20} />,
        label: "Customer Statement",
        path: "/reports/customer-statement",
      },
      {
        icon: <BarChart2 size={20} />,
        label: "Supplier Statement",
        path: "/reports/supplier-statement",
      },
    ],
    settings: [
      {
        icon: <Settings size={20} />,
        label: "Calculate Income",
        path: "/settings/calculate-income",
      },
      {
        icon: <Settings size={20} />,
        label: "Calculate Expense",
        path: "/settings/calculate-expense",
      },
      {
        icon: <Settings size={20} />,
        label: "Setting",
        path: "/settings/Setting",
      },
    ],
  };

  const createDropdown = (label, menuKey, icon) => (
    <div key={menuKey}>
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800"
        onClick={() => toggleDropdown(menuKey)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        {dropdownState[menuKey] ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </div>
      {dropdownState[menuKey] && (
        <div>
          {menuItems[menuKey].map((item, index) => (
            <NavLink
              key={`${menuKey}-${index}`}
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
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white z-40 flex flex-col
        lg:translate-x-0 lg:static lg:w-64
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out`}
      >
        <div className="p-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 rounded-lg transition-colors duration-150 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {createDropdown("Expense", "fleet", <Truck size={24} />)}
          {createDropdown("Sales", "sales", <DollarSign size={24} />)}
          {createDropdown("Clients", "clients", <Users size={24} />)}
          {createDropdown("Suppliers", "suppliers", <Package size={24} />)}
          {createDropdown(
            "Transactions",
            "transactions",
            <FileText size={24} />
          )}
          {createDropdown("Reports", "reports", <BarChart2 size={24} />)}
          {createDropdown("Settings", "settings", <Settings size={24} />)}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
