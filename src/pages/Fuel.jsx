// import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const Fuel = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fuelEntries, setFuelEntries] = useState([]);
//   const [formData, setFormData] = useState({
//     vehicle: "",
//     fuelTime: "",
//     odometer: "",
//     gallons: "",
//     price: "",
//     fuelType: "",
//     vendor: "",
//     reference: "",
//     note: "",
//   });

//   // Load fuel entries from localStorage on component mount
//   useEffect(() => {
//     const savedEntries = localStorage.getItem("fuelEntries");
//     if (savedEntries) {
//       setFuelEntries(JSON.parse(savedEntries));
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     const newEntries = [...fuelEntries, formData];
//     setFuelEntries(newEntries);
//     // Save to localStorage
//     localStorage.setItem("fuelEntries", JSON.stringify(newEntries));

//     setFormData({
//       vehicle: "",
//       fuelTime: "",
//       odometer: "",
//       gallons: "",
//       price: "",
//       fuelType: "",
//       vendor: "",
//       reference: "",
//       note: "",
//     });
//     setIsModalOpen(false);
//   };

// const handleExportPDF = () => {
//   const doc = new jsPDF("l", "mm", "a4"); // Set to landscape orientation
//   doc.text("JLATRANPORT", 14, 10);

//   const tableColumn = [
//     "Vehicle",
//     "Fuel Time",
//     "Odometer",
//     "Gallons (US)",
//     "Price",
//     "Fuel Type",
//     "Vendor",
//     "Reference",
//     "Note",
//   ];

//   const tableRows = fuelEntries.map((entry) => [
//     entry.vehicle,
//     entry.fuelTime,
//     entry.odometer,
//     entry.gallons,
//     entry.price,
//     entry.fuelType,
//     entry.vendor,
//     entry.reference,
//     entry.note,
//   ]);

//   doc.autoTable({
//     head: [tableColumn],
//     body: tableRows,
//     startY: 20,
//     theme: "grid",
//     styles: {
//       fontSize: 10,
//       cellPadding: 3,
//       lineWidth: 0.5,
//       lineColor: [0, 0, 0],
//       textColor: [0, 0, 0],
//       halign: "left",
//     },
//     headStyles: {
//       fillColor: false,
//       textColor: [0, 0, 0],
//       fontStyle: "bold",
//       lineWidth: 0.5,
//     },
//     columnStyles: {
//       0: { cellWidth: 25 }, // Vehicle
//       1: { cellWidth: 30 }, // Fuel Time
//       2: { cellWidth: 25 }, // Odometer
//       3: { cellWidth: 25 }, // Gallons
//       4: { cellWidth: 20 }, // Price
//       5: { cellWidth: 25 }, // Fuel Type
//       6: { cellWidth: 25 }, // Vendor
//       7: { cellWidth: 30 }, // Reference
//       8: { cellWidth: 45 }, // Note
//     },
//     alternateRowStyles: {
//       fillColor: false,
//     },
//     margin: { top: 20, right: 10, bottom: 20, left: 10 },
//     didDrawPage: function (data) {
//       // Add page number at the bottom
//       const str = "Page " + doc.internal.getNumberOfPages();
//       doc.setFontSize(10);
//       const pageSize = doc.internal.pageSize;
//       const pageHeight = pageSize.height
//         ? pageSize.height
//         : pageSize.getHeight();
//       doc.text(str, data.settings.margin.left, pageHeight - 10);
//     },
//   });

//   doc.save("JLATRANPORT_FUEL_REPORT.pdf");
// };
//   return (
//     <div className="w-full p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-700">Fuels</h2>
//       </div>

//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Add
//         </button>
//         <button
//           onClick={handleExportPDF}
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           Export to PDF
//         </button>
//       </div>

//       {/* Table View */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse min-w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="text-left p-3 border whitespace-nowrap">
//                 Vehicle
//               </th>
//               <th className="text-left p-3 border whitespace-nowrap">
//                 Fuel Time
//               </th>
//               <th className="text-left p-3 border whitespace-nowrap">
//                 Odometer
//               </th>
//               <th className="text-left p-3 border whitespace-nowrap">
//                 Gallons (US)
//               </th>
//               <th className="text-left p-3 border whitespace-nowrap">Price</th>
//               <th className="text-left p-3 border whitespace-nowrap">
//                 Fuel Type
//               </th>
//               <th className="text-left p-3 border whitespace-nowrap">Vendor</th>
//               <th className="text-left p-3 border whitespace-nowrap">
//                 Reference
//               </th>
//               <th className="text-left p-3 border whitespace-nowrap">Note</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fuelEntries.map((entry, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="p-3 border">{entry.vehicle}</td>
//                 <td className="p-3 border">{entry.fuelTime}</td>
//                 <td className="p-3 border">{entry.odometer}</td>
//                 <td className="p-3 border">{entry.gallons}</td>
//                 <td className="p-3 border">${entry.price}</td>
//                 <td className="p-3 border">{entry.fuelType}</td>
//                 <td className="p-3 border">{entry.vendor}</td>
//                 <td className="p-3 border">{entry.reference}</td>
//                 <td className="p-3 border">{entry.note}</td>
//               </tr>
//             ))}
//             {fuelEntries.length === 0 && (
//               <tr>
//                 <td colSpan="9" className="text-center p-4 text-gray-500">
//                   No fuel entries yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal Form */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg w-full max-w-md mx-4">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h3 className="text-lg font-medium">Fuel</h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-4 space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Vehicle <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="vehicle"
//                   value={formData.vehicle}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 >
//                   <option value="">None selected</option>
//                   <option value="car1">Car 1</option>
//                   <option value="car2">Car 2</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Fuel time <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="datetime-local"
//                   name="fuelTime"
//                   value={formData.fuelTime}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Odometer
//                 </label>
//                 <input
//                   type="number"
//                   name="odometer"
//                   value={formData.odometer}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Gallons(US) <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="gallons"
//                   value={formData.gallons}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Fuel type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="fuelType"
//                   value={formData.fuelType}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 >
//                   <option value="">None selected</option>
//                   <option value="petrol">Petrol</option>
//                   <option value="diesel">Diesel</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Vendor
//                 </label>
//                 <select
//                   name="vendor"
//                   value={formData.vendor}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 >
//                   <option value="">None selected</option>
//                   <option value="vendor1">Vendor 1</option>
//                   <option value="vendor2">Vendor 2</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Reference
//                 </label>
//                 <input
//                   type="text"
//                   name="reference"
//                   value={formData.reference}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Note
//                 </label>
//                 <textarea
//                   name="note"
//                   value={formData.note}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-1.5 border rounded-md text-sm"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 p-4 border-t">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-1.5 text-sm border rounded hover:bg-gray-50"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Fuel;
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Fuel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fuelEntries, setFuelEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
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
  const [filterDates, setFilterDates] = useState({
    startDate: "",
    endDate: "",
  });

  // Load fuel entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("fuelEntries");
    if (savedEntries) {
      setFuelEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Filter entries when filter dates change
  useEffect(() => {
    if (filterDates.startDate && filterDates.endDate) {
      const filtered = fuelEntries.filter((entry) => {
        const entryDate = new Date(entry.fuelTime);
        const startDate = new Date(filterDates.startDate);
        const endDate = new Date(filterDates.endDate);
        return entryDate >= startDate && entryDate <= endDate;
      });
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(fuelEntries);
    }
  }, [filterDates, fuelEntries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterDates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const newEntries = [...fuelEntries, formData];
    setFuelEntries(newEntries);
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
  const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // Set to landscape orientation
    doc.text("JLATRANPORT", 14, 10);

    const tableColumn = [
      "Vehicle",
      "Fuel Time",
      "Odometer",
      "Gallons (US)",
      "Price",
      "Fuel Type",
      "Vendor",
      "Reference",
      "Note",
    ];

    const tableRows = fuelEntries.map((entry) => [
      entry.vehicle,
      entry.fuelTime,
      entry.odometer,
      entry.gallons,
      entry.price,
      entry.fuelType,
      entry.vendor,
      entry.reference,
      entry.note,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        halign: "left",
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Vehicle
        1: { cellWidth: 30 }, // Fuel Time
        2: { cellWidth: 25 }, // Odometer
        3: { cellWidth: 25 }, // Gallons
        4: { cellWidth: 20 }, // Price
        5: { cellWidth: 25 }, // Fuel Type
        6: { cellWidth: 25 }, // Vendor
        7: { cellWidth: 30 }, // Reference
        8: { cellWidth: 45 }, // Note
      },
      alternateRowStyles: {
        fillColor: false,
      },
      margin: { top: 20, right: 10, bottom: 20, left: 10 },
      didDrawPage: function (data) {
        // Add page number at the bottom
        const str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
    });

    doc.save("JLATRANPORT_FUEL_REPORT.pdf");
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Fuels</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to PDF
        </button>
      </div>

      {/* Date Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filterDates.startDate}
            onChange={handleDateFilterChange}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filterDates.endDate}
            onChange={handleDateFilterChange}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border">Vehicle</th>
              <th className="text-left p-3 border">Fuel Time</th>
              <th className="text-left p-3 border">Odometer</th>
              <th className="text-left p-3 border">Gallons (US)</th>
              <th className="text-left p-3 border">Price</th>
              <th className="text-left p-3 border">Fuel Type</th>
              <th className="text-left p-3 border">Vendor</th>
              <th className="text-left p-3 border">Reference</th>
              <th className="text-left p-3 border">Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
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
            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No fuel entries found for the selected date range
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
                  Vehicle
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
                  Fuel time
                </label>
                <input
                  type="datetime-local"
                  name="fuelTime"
                  value={formData.fuelTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border rounded-md text-sm"
                />
              </div>

              {/* Remaining fields */}
              {/* ... */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fuel;
