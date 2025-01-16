import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const Vehicle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleName: "",
    driverName: "",
    carNumber: "",
    carModel: "",
  });

  // Load vehicles from localStorage on component mount
  useEffect(() => {
    const savedVehicles = localStorage.getItem("vehicles");
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicles = [...vehicles, formData];
    setVehicles(newVehicles);
    // Save to localStorage
    localStorage.setItem("vehicles", JSON.stringify(newVehicles));

    setFormData({
      vehicleName: "",
      driverName: "",
      carNumber: "",
      carModel: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border whitespace-nowrap">
                Vehicle Name
              </th>
              <th className="text-left p-3 border whitespace-nowrap">
                Driver Name
              </th>
              <th className="text-left p-3 border whitespace-nowrap">
                Car Number
              </th>
              <th className="text-left p-3 border whitespace-nowrap">
                Car Model
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">{vehicle.vehicleName}</td>
                <td className="p-3 border">{vehicle.driverName}</td>
                <td className="p-3 border">{vehicle.carNumber}</td>
                <td className="p-3 border">{vehicle.carModel}</td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No vehicles added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Vehicle</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Number
                </label>
                <input
                  type="text"
                  name="carNumber"
                  value={formData.carNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Model
                </label>
                <input
                  type="text"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
