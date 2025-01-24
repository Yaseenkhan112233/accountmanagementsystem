import React, { useState, useEffect } from "react";
import { db } from "../../firbase/firebase"; // Adjust the path to your Firebase config
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

function CustomerStatement() {
  const [clients, setClients] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch clients
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      const clientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all transactions
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "transactions"),
      (snapshot) => {
        const transactionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionsData);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter transactions based on the selected client and date range
  useEffect(() => {
    if (selectedClient && startDate && endDate) {
      const filtered = transactions.filter(
        (transaction) =>
          transaction.clientId === selectedClient.id &&
          transaction.timestamp >= new Date(startDate).toISOString() &&
          transaction.timestamp <= new Date(endDate).toISOString()
      );
      setFilteredTransactions(filtered);
    }
  }, [selectedClient, startDate, endDate, transactions]);

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("Customer Statement", 14, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${selectedClient.billingAddress.name}`, 14, 30);
    doc.text(`Email: ${selectedClient.billingAddress.email}`, 14, 36);
    doc.text(
      `Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(
        endDate
      ).toLocaleDateString()}`,
      14,
      42
    );

    // Table Data Preparation
    let balance = 0;
    const tableRows = filteredTransactions.map((transaction) => {
      const isDebit = transaction.amountType === "debit";
      const debit = isDebit ? transaction.amount : 0;
      const credit = isDebit ? 0 : transaction.amount;
      balance += credit - debit;

      return [
        new Date(transaction.timestamp).toLocaleDateString(), // Date
        transaction.detail || `Transaction ${transaction.id}`, // Detail
        debit ? `£${debit.toFixed(2)}` : "-", // Debit
        credit ? `£${credit.toFixed(2)}` : "-", // Credit
        `£${balance.toFixed(2)}`, // Balance
      ];
    });

    // Calculate Totals
    const totalDebit = filteredTransactions
      .filter((t) => t.amountType === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredit = filteredTransactions
      .filter((t) => t.amountType === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    // Add Table
    doc.autoTable({
      head: [["Date", "Detail", "Debit (£)", "Credit (£)", "Balance (£)"]],
      body: tableRows,
      startY: 50,
      styles: {
        halign: "right",
        cellPadding: 3,
        fontSize: 10,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontSize: 11,
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center" }, // Align Date to the center
        1: { halign: "left" }, // Align Detail to the left
      },
    });

    // Add Totals Row
    doc.autoTable({
      body: [
        [
          "Total", // Date
          "", // Detail
          `£${totalDebit.toFixed(2)}`, // Debit
          `£${totalCredit.toFixed(2)}`, // Credit
          `£${balance.toFixed(2)}`, // Final Balance
        ],
      ],
      startY: doc.lastAutoTable.finalY + 5,
      styles: { fontSize: 11, halign: "right", fillColor: [240, 240, 240] },
      columnStyles: {
        0: { halign: "left", cellPadding: 5 },
        1: { halign: "left", cellPadding: 5 },
      },
    });

    // Footer (Balance C/F)
    doc.setFontSize(12);
    doc.text(
      `Balance C/F: £${balance.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Save PDF
    doc.save(`statement_${selectedClient.billingAddress.name}.pdf`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Customer Statement</h2>

      {/* Search bar */}
      <div className="mb-4">
        <label className="text-sm font-medium">Search Client</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Client Name"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Client List */}
      {searchQuery && (
        <ul className="mb-4 border border-gray-300 rounded-md">
          {clients
            .filter((client) =>
              client.billingAddress.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((client) => (
              <li
                key={client.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedClient(client)}
              >
                {client.billingAddress.name} - {client.billingAddress.phone}
              </li>
            ))}
        </ul>
      )}

      {/* Selected Client Info */}
      {selectedClient && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Selected Client: {selectedClient.billingAddress.name}
          </h3>
          <p>Email: {selectedClient.billingAddress.email}</p>
        </div>
      )}

      {/* Date Range */}
      {selectedClient && (
        <div className="mb-6">
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <label className="text-sm font-medium mt-4 block">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      )}

      {/* Transactions Table */}
      {filteredTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Transaction ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Amount (£)</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.amountType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    £{transaction.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Download Button */}
      {filteredTransactions.length > 0 && (
        <button
          onClick={downloadPDF}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Download Statement
        </button>
      )}
    </div>
  );
}

export default CustomerStatement;
