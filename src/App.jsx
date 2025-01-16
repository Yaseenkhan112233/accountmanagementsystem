// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Sidebar from "./pages/Sidebar"; // Adjust the path based on your project structure
// import Dashboard from "./pages/Dashboard"; // Replace with the correct component paths
// import Vehicle from "./pages/Vehicle";
// import Transaction from "./pages/Transiction";
// import Driver from "./pages/Drivers";
// import Fuel from "./pages/Fuel";

// // Import other pages...

// const App = () => {
//   return (
//     <Router>
//       <div className="flex">
//         <Sidebar />

//         <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />

//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/vehicle" element={<Vehicle />} />
//             <Route path="/transactions" element={<Transaction />} />
//             <Route path="/driver" element={<Driver />} />
//             <Route path="/fuel" element={<Fuel />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vehicle from "./pages/Vehicle";
import Driver from "./pages/Drivers";
import Fuel from "./pages/Fuel";
import LoginPage from "./pages/LoginPage";
import Setting from "./pages/Setting"; // Import Setting component
import { useEffect, useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Convert to boolean
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar />} {/* Only show Sidebar if logged in */}
        <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
          <Routes>
            {/* Login route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/vehicle"
              element={
                isAuthenticated ? <Vehicle /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/driver"
              element={
                isAuthenticated ? <Driver /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/fuel"
              element={
                isAuthenticated ? <Fuel /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? (
                  <Setting onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Default route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
