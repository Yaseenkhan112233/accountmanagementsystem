import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash } from "lucide-react";

const Driver = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    driverName: "",
    address: "",
    carAssigned: "",
    email: "",
    salary: "",
    image: null,
  });
  const [editIndex, setEditIndex] = useState(null); // Index of the driver being edited
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to show delete confirmation modal
  const [deleteIndex, setDeleteIndex] = useState(null); // Index of the driver to delete
  const [totalSalary, setTotalSalary] = useState(0); // State for total salary

  // Load drivers from localStorage on component mount
  useEffect(() => {
    const savedDrivers = localStorage.getItem("drivers");
    if (savedDrivers) {
      const parsedDrivers = JSON.parse(savedDrivers);
      setDrivers(parsedDrivers);
      calculateTotalSalary(parsedDrivers); // Calculate the total salary on initial load
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file), // Preview image locally
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDrivers = [...drivers];
    if (isEditMode) {
      // Update the driver details
      newDrivers[editIndex] = formData;
    } else {
      // Add a new driver
      newDrivers.push(formData);
    }

    setDrivers(newDrivers);
    localStorage.setItem("drivers", JSON.stringify(newDrivers));

    // Recalculate total salary
    calculateTotalSalary(newDrivers);

    // Reset the form and close the modal
    setFormData({
      driverName: "",
      address: "",
      carAssigned: "",
      email: "",
      salary: "",
      image: null,
    });
    setIsModalOpen(false);
    setIsEditMode(false); // Reset edit mode
    setEditIndex(null); // Reset the edit index
  };

  const handleDelete = () => {
    const newDrivers = drivers.filter((_, i) => i !== deleteIndex);
    setDrivers(newDrivers);
    localStorage.setItem("drivers", JSON.stringify(newDrivers));
    // Recalculate total salary
    calculateTotalSalary(newDrivers);
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
    setDeleteIndex(null); // Reset the delete index
  };

  const handleEdit = (index) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditIndex(index);
    setFormData(drivers[index]); // Load the driver details into the form
  };

  const openDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
    setDeleteIndex(null); // Reset the delete index
  };

  // Function to calculate the total salary of all drivers
  const calculateTotalSalary = (driversList) => {
    const total = driversList.reduce(
      (acc, driver) => acc + parseFloat(driver.salary || 0),
      0
    );
    setTotalSalary(total); // Update the total salary state
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border">Driver Image</th>
              <th className="text-left p-3 border">Driver Name</th>
              <th className="text-left p-3 border">Address</th>
              <th className="text-left p-3 border">Car Assigned</th>
              <th className="text-left p-3 border">Email</th>
              <th className="text-left p-3 border">Salary</th>
              <th className="text-left p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">
                  {driver.image ? (
                    <img
                      src={driver.image}
                      alt="Driver"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-3 border">{driver.driverName}</td>
                <td className="p-3 border">{driver.address}</td>
                <td className="p-3 border">{driver.carAssigned}</td>
                <td className="p-3 border">{driver.email}</td>
                <td className="p-3 border">{driver.salary}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleEdit(index)}
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
            {drivers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No drivers added yet
                </td>
              </tr>
            )}
            {/* Total Salary Row */}
            {drivers.length > 0 && (
              <tr className="bg-gray-100">
                <td
                  colSpan="5"
                  className="text-right p-3 font-semibold text-gray-800"
                >
                  Total Salary
                </td>
                <td className="p-3 font-semibold text-gray-800">
                  {totalSalary.toFixed(2)}
                </td>
                <td className="p-3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Drivers */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditMode ? "Edit Driver" : "Add New Driver"}
              </h2>
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
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Assigned
                </label>
                <input
                  type="text"
                  name="carAssigned"
                  value={formData.carAssigned}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
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
                  {isEditMode ? "Update" : "Add"} Driver
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
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this driver?
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

export default Driver;
