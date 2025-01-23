import React, { useState, useEffect } from "react";
import { Trash, FileText } from "lucide-react"; // Import lucide-react icons
import { db } from "../../firbase/firebase"; // Import Firestore
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore methods
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table in PDF

function ManageInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [invoiceToDelete, setInvoiceToDelete] = useState(null); // Invoice to be deleted

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10); // Number of invoices per page

  // Fetch saved invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData); // Initial display of all invoices
    };
    fetchInvoices();
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter invoices based on the query
    const filtered = invoices.filter((invoice) => {
      const invoiceNumber = invoice.invoiceNumber
        ? invoice.invoiceNumber.toString()
        : ""; // Convert to string if not already
      const clientName = invoice.clientName
        ? invoice.clientName.toLowerCase()
        : ""; // Convert clientName to lowercase
      return invoiceNumber.includes(query) || clientName.includes(query);
    });
    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  // Calculate current invoices for the page
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Delete invoice
  const deleteInvoice = async () => {
    try {
      await deleteDoc(doc(db, "invoices", invoiceToDelete.id)); // Delete from Firestore
      setInvoices(
        invoices.filter((invoice) => invoice.id !== invoiceToDelete.id)
      );
      setFilteredInvoices(
        filteredInvoices.filter((invoice) => invoice.id !== invoiceToDelete.id)
      );
      setIsModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting invoice: ", error);
    }
  };

  // Generate PDF for invoice
  const downloadPDF = (invoice) => {
    const doc = new jsPDF();
    const x = 14; // Starting x position for text
    const y = 20; // Starting y position for text

    // Add Header
    doc.setFontSize(18);
    doc.text("JLT Transport", x, y);

    // Add Invoice title
    doc.setFontSize(12);
    doc.text("Invoice", 170, y);

    // Add Date
    doc.setFontSize(10);
    doc.text(`Date: ${invoice.invoiceDate || "N/A"}`, 170, y + 10);

    // Billing Address
    doc.setFontSize(12);
    doc.text("Billing Address:", x, y + 30);
    doc.setFontSize(10);

    // Add Billing address details with null checks
    if (invoice) {
      doc.text(`Name: ${invoice.clientName || "N/A"}`, x, y + 35);
      doc.text(`Address: ${invoice.clientAdress || "N/A"}`, x, y + 40);
      doc.text(`Phone: ${invoice.clientPhone || "N/A"}`, x, y + 45);
      doc.text(`Email: ${invoice.clientEmail || "N/A"}`, x, y + 50);
    } else {
      doc.text("Billing Address: N/A", x, y + 35);
    }

    // Items Table
    const items = invoice.rows || [];
    const tableRows = items.map((item) => [
      item.itemName || "N/A", // Item name
      item.rate ? item.rate.toFixed(2) : "0.00", // Rate
      item.quantity || "1", // Default quantity to 1 if not provided
      item.rate ? (item.rate * (item.quantity || 1)).toFixed(2) : "0.00", // Subtotal
      item.taxPercentage && item.rate
        ? (
            (item.taxPercentage * item.rate * (item.quantity || 1)) /
            100
          ).toFixed(2)
        : "0.00", // Tax
      item.discount || "0.00", // Discount
      item.amount ? item.amount.toFixed(2) : "0.00", // Total amount
    ]);

    const tableHeaders = [
      "Item Name",
      "Rate",
      "Quantity",
      "Subtotal",
      "Tax",
      "Discount",
      "Total",
    ];

    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: y + 70,
    });

    // Add Grand Total
    const grandTotal = parseFloat(invoice.grandTotal).toFixed(2);
    doc.setFontSize(12);
    doc.text(`Grand Total: £${grandTotal}`, x, doc.lastAutoTable.finalY + 10);

    // Save PDF
    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
  };

  // Open delete confirmation modal
  const openDeleteModal = (invoice) => {
    setInvoiceToDelete(invoice); // Set invoice to delete
    setIsModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setInvoiceToDelete(null); // Reset the invoice to delete
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Manage Invoices</h2>

      {/* Search bar */}
      <div className="mb-4">
        <label className="text-sm font-medium">Search Invoices</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Invoice Number or Client Name"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Invoice Number</th>
            <th className="border border-gray-300 px-3 py-2">Client Name</th>
            <th className="border border-gray-300 px-3 py-2">Amount</th>
            <th className="border border-gray-300 px-3 py-2">Invoice Date</th>
            <th className="border border-gray-300 px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.invoiceNumber}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.clientName}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                £{invoice.grandTotal}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.invoiceDate}
              </td>
              <td className="border border-gray-300 px-3 py-2 flex gap-2">
                <button
                  onClick={() => downloadPDF(invoice)}
                  className="text-blue-500 hover:underline"
                >
                  <FileText size={20} /> {/* Download icon */}
                </button>
                <button
                  onClick={() => openDeleteModal(invoice)}
                  className="text-red-500 hover:underline"
                >
                  <Trash size={20} /> {/* Trash icon for Delete */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span>
            Showing {indexOfFirstInvoice + 1} to {indexOfLastInvoice} of{" "}
            {filteredInvoices.length} entries
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * invoicesPerPage >= filteredInvoices.length}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4">
              You are about to delete this invoice. This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={deleteInvoice}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageInvoice;
