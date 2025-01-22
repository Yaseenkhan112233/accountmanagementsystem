// contexts/InvoiceContext.js
import React, { createContext, useContext, useState } from "react";
import { db } from "../../firbase/firebase"; // Import Firestore
import { collection, addDoc } from "firebase/firestore"; // Firestore methods

// Create the context
const InvoiceContext = createContext();

// InvoiceContext Provider
export const InvoiceProvider = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState(null); // Store invoice data
  const [selectedClient, setSelectedClient] = useState(null); // Store selected client
  const [rows, setRows] = useState([
    {
      itemName: "",
      quantity: 1,
      rate: 0,
      taxPercentage: 0,
      discount: 0,
      amount: 0,
    },
  ]); // Store invoice rows
  const [invoiceNumber, setInvoiceNumber] = useState(1004); // Invoice number
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Invoice date

  const addClient = (client) => setSelectedClient(client); // Set selected client
  const updateRows = (updatedRows) => setRows(updatedRows); // Update invoice rows

  const calculateAmount = (row) => {
    const tax = (row.rate * row.quantity * row.taxPercentage) / 100;
    const discount = (row.rate * row.quantity * row.discount) / 100;
    return row.rate * row.quantity + tax - discount;
  };

  const generateInvoice = async () => {
    if (!selectedClient) {
      alert("Please select or add a client before generating an invoice.");
      return;
    }

    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text("JLT Transport", 14, 20);
    doc.setFontSize(12);
    doc.text("Invoice", 170, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${invoiceDate}`, 170, 30);

    // Billing Info
    doc.setFontSize(12);
    doc.text("Billing Address:", 14, 40);
    doc.setFontSize(10);
    doc.text(`${selectedClient.billingAddress.name}`, 14, 45);
    doc.text(`${selectedClient.billingAddress.address}`, 14, 50);
    doc.text(
      `${selectedClient.billingAddress.city}, ${selectedClient.billingAddress.region}`,
      14,
      55
    );
    doc.text(`${selectedClient.billingAddress.country}`, 14, 60);
    doc.text(`Phone: ${selectedClient.billingAddress.phone}`, 14, 65);
    doc.text(`Email: ${selectedClient.billingAddress.email}`, 14, 70);

    // Table for invoice items
    const tableRows = rows.map((row) => [
      row.itemName,
      row.rate.toFixed(2),
      row.quantity,
      (row.rate * row.quantity).toFixed(2),
      ((row.taxPercentage * row.rate * row.quantity) / 100).toFixed(2),
      row.discount.toFixed(2),
      row.amount.toFixed(2),
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
      startY: 80,
    });

    // Grand total
    const grandTotal = rows
      .reduce((sum, row) => sum + row.amount, 0)
      .toFixed(2);
    doc.setFontSize(12);
    doc.text(`Grand Total: £${grandTotal}`, 14, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save(`invoice_${invoiceNumber}.pdf`);

    // Save invoice data to Firestore
    try {
      const invoiceDetails = {
        invoiceNumber,
        invoiceDate,
        clientName: selectedClient.billingAddress.name,
        rows,
        grandTotal,
      };

      await addDoc(collection(db, "invoices"), invoiceDetails);
      setInvoiceData(invoiceDetails);
      setInvoiceNumber(invoiceNumber + 1); // Increment for next invoice
    } catch (error) {
      console.error("Error saving invoice: ", error);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        selectedClient,
        rows,
        invoiceNumber,
        invoiceDate,
        setInvoiceDate,
        addClient,
        updateRows,
        generateInvoice,
        setInvoiceNumber,
        calculateAmount,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

// Custom hook to use invoice context
export const useInvoice = () => useContext(InvoiceContext);
