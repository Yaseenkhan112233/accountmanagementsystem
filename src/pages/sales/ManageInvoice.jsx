import React, { useState, useEffect } from "react";
import { db } from "../../firbase/firebase"; // Import Firestore
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Firestore methods

function ManageInvoice() {
  const [invoices, setInvoices] = useState([]);

  // Fetch saved invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(invoicesData);
    };
    fetchInvoices();
  }, []);

  // Delete invoice
  const deleteInvoice = async (id) => {
    try {
      await deleteDoc(doc(db, "invoices", id));
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error("Error deleting invoice: ", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Manage Invoices</h2>
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
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.invoiceNumber}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.clientName} {/* Display the client name */}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.grandTotal}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                {invoice.invoiceDate}
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => downloadPDF(invoice)}
                >
                  Download PDF
                </button>
                <button
                  className="ml-2 text-red-500 hover:underline"
                  onClick={() => deleteInvoice(invoice.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageInvoice;
