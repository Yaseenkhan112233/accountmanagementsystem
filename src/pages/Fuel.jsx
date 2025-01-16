import React, { useState, useEffect } from "react";

const Fuel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fuelEntries, setFuelEntries] = useState([]);
  const [formData, setFormData] = useState({
    vehicle: "",
    fuelTime: "",
    odometer: "",
    gallons: "",
    price: "",
    fuelType: "",
    vendor: "",
    reference: "",
    note: "",
  });

  // Load fuel entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("fuelEntries");
    if (savedEntries) {
      setFuelEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const newEntries = [...fuelEntries, formData];
    setFuelEntries(newEntries);
    // Save to localStorage
    localStorage.setItem("fuelEntries", JSON.stringify(newEntries));

    setFormData({
      vehicle: "",
      fuelTime: "",
      odometer: "",
      gallons: "",
      price: "",
      fuelType: "",
      vendor: "",
      reference: "",
      note: "",
    });
    setIsModalOpen(false);
  };

  // Rest of your component code remains the same...
  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Fuels</h2>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border whitespace-nowrap">
                Vehicle
              </th>
              <th className="text-left p-3 border whitespace-nowrap">
                Fuel Time
              </th>
              <th className="text-left p-3 border whitespace-nowrap">
                Odometer
              </th>
              <th className="text-left p-3 border whitespace-nowrap">
                Gallons(US)
              </th>
              <th className="text-left p-3 border whitespace-nowrap">Price</th>
              <th className="text-left p-3 border whitespace-nowrap">
                Fuel Type
              </th>
              <th className="text-left p-3 border whitespace-nowrap">Vendor</th>
              <th className="text-left p-3 border whitespace-nowrap">
                Reference
              </th>
              <th className="text-left p-3 border whitespace-nowrap">Note</th>
            </tr>
          </thead>
          <tbody>
            {fuelEntries.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">{entry.vehicle}</td>
                <td className="p-3 border">{entry.fuelTime}</td>
                <td className="p-3 border">{entry.odometer}</td>
                <td className="p-3 border">{entry.gallons}</td>
                <td className="p-3 border">${entry.price}</td>
                <td className="p-3 border">{entry.fuelType}</td>
                <td className="p-3 border">{entry.vendor}</td>
                <td className="p-3 border">{entry.reference}</td>
                <td className="p-3 border">{entry.note}</td>
              </tr>
            ))}
            {fuelEntries.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No fuel entries yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Fuel</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                >
                  <option value="">None selected</option>
                  <option value="car1">Car 1</option>
                  <option value="car2">Car 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="fuelTime"
                  value={formData.fuelTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Odometer
                </label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gallons(US) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="gallons"
                  value={formData.gallons}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel type <span className="text-red-500">*</span>
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                >
                  <option value="">None selected</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                >
                  <option value="">None selected</option>
                  <option value="vendor1">Vendor 1</option>
                  <option value="vendor2">Vendor 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-sm border rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fuel;
