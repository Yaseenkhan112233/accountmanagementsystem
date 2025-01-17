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
import Report from "./pages/Report"; // Import Report component
import { useEffect, useState } from "react";
import Maintenance from "./pages/Maintenance";
import Parts from "./pages/Parts";

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
            <Route
              path="/report"
              element={
                isAuthenticated ? <Report /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/Maintenance"
              element={
                isAuthenticated ? (
                  <Maintenance />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Parts"
              element={
                isAuthenticated ? <Parts /> : <Navigate to="/login" replace />
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
