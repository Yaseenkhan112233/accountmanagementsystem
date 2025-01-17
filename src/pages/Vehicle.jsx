import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash } from "lucide-react";

const Vehicle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleName: "",
    driverName: "",
    carNumber: "",
    carModel: "",
  });
  const [editData, setEditData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [deleteIndex, setDeleteIndex] = useState(null); // Index of the vehicle to delete

  // Load vehicles from localStorage on component mount
  useEffect(() => {
    const savedVehicles = localStorage.getItem("vehicles");
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding new vehicle
  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicles = [...vehicles, formData];
    setVehicles(newVehicles);
    localStorage.setItem("vehicles", JSON.stringify(newVehicles));

    setFormData({
      vehicleName: "",
      driverName: "",
      carNumber: "",
      carModel: "",
    });
    setIsModalOpen(false);
  };

  // Handle the edit functionality
  const handleEdit = (vehicle, index) => {
    setEditData({ ...vehicle, index });
    setFormData(vehicle);
    setIsEditModalOpen(true);
  };

  // Handle vehicle update
  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedVehicles = vehicles.map((vehicle, index) =>
      index === editData.index ? formData : vehicle
    );
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));

    setFormData({
      vehicleName: "",
      driverName: "",
      carNumber: "",
      carModel: "",
    });
    setIsEditModalOpen(false);
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  // Handle vehicle deletion
  const handleDelete = () => {
    const updatedVehicles = vehicles.filter((_, i) => i !== deleteIndex);
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    closeDeleteConfirmation(); // Close the delete modal
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
              <th className="text-left p-3 border">Vehicle Name</th>
              <th className="text-left p-3 border">Driver Name</th>
              <th className="text-left p-3 border">Car Number</th>
              <th className="text-left p-3 border">Car Model</th>
              <th className="text-left p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">{vehicle.vehicleName}</td>
                <td className="p-3 border">{vehicle.driverName}</td>
                <td className="p-3 border">{vehicle.carNumber}</td>
                <td className="p-3 border">{vehicle.carModel}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleEdit(vehicle, index)}
                    className="text-yellow-500 hover:text-yellow-700 mr-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteConfirmation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No vehicles added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Vehicles */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditModalOpen ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleUpdate : handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
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
                  className="w-full p-2 border rounded-lg"
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
                  className="w-full p-2 border rounded-lg"
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
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isEditModalOpen ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this vehicle?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
