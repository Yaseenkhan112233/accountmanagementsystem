import React, { useState } from "react";
import { Loader } from "lucide-react"; // Importing Loader icon for loading animation

const Setting = ({ onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(false); // State to show/hide confirmation dialog
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogout = () => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      onLogout(); // Trigger parent logout function
    }, 1500); // Simulated delay of 1.5 seconds
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Customize your preferences here.</p>

      {/* Logout Button */}
      <button
        onClick={() => setShowConfirm(true)} // Show confirmation dialog
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center w-96">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <Loader className="animate-spin text-white" size={50} />
        </div>
      )}
    </div>
  );
};

export default Setting;
