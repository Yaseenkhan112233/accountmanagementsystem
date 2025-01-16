import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/Sidebar"; // Adjust the path based on your project structure
import Dashboard from "./pages/Dashboard"; // Replace with the correct component paths
import Vehicle from "./pages/Vehicle";
import Transaction from "./pages/Transiction";
import Driver from "./pages/Drivers";
import Fuel from "./pages/Fuel";

// Import other pages...

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicle" element={<Vehicle />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/Fuel" element={<Fuel />} />
            {/* Add routes for other pages */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
