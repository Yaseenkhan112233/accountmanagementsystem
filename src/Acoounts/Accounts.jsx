import React, { useState, useEffect } from "react";
import { db } from "../firbase/firebase"; // Adjust the path to your Firebase config
import { collection, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Accounts() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients and invoices data in real-time
  useEffect(() => {
    const unsubscribeClients = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {
        const clientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsData);
      }
    );

    const unsubscribeInvoices = onSnapshot(
      collection(db, "invoices"),
      (snapshot) => {
        const invoicesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInvoices(invoicesData);
      }
    );

    return () => {
      unsubscribeClients();
      unsubscribeInvoices();
    };
  }, []);

  // Filter clients based on the search query
  const filteredClients = searchQuery
    ? clients.filter((client) =>
        client.billingAddress.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate total invoice amount for a client
  const calculateTotalInvoices = (clientName) => {
    return invoices
      .filter((invoice) => invoice.clientName === clientName)
      .reduce(
        (total, invoice) => total + parseFloat(invoice.grandTotal || 0),
        0
      );
  };

  // Export brief statement to PDF
  const exportBriefStatementToPDF = (client) => {
    const doc = new jsPDF();
    const totalInvoices = calculateTotalInvoices(client.billingAddress.name);
    const currentBalance = parseFloat(
      client.billingAddress.RecieveBalance || 0
    );
    const remainingBalance = currentBalance + totalInvoices; // Updated to addition

    doc.setFontSize(18);
    doc.text("Client Brief Statement", 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${client.billingAddress.name}`, 14, 30);
    doc.text(`Current Balance: £${currentBalance.toFixed(2)}`, 14, 40);
    doc.text(`Total Invoices: £${totalInvoices.toFixed(2)}`, 14, 50);
    doc.text(`Receiving Amount: £${remainingBalance.toFixed(2)}`, 14, 60);

    const clientInvoices = invoices.filter(
      (invoice) => invoice.clientName === client.billingAddress.name
    );

    const tableData = clientInvoices.map((invoice) => [
      invoice.invoiceNumber,
      `£${parseFloat(invoice.grandTotal || 0).toFixed(2)}`,
      invoice.invoiceDate,
    ]);

    doc.autoTable({
      head: [["Invoice Number", "Amount", "Date"]],
      body: tableData,
      startY: 70,
    });

    doc.save(`brief_statement_${client.billingAddress.name}.pdf`);
  };

  // Export detailed statement to PDF
  const exportDetailedStatementToPDF = (clientName) => {
    const clientInvoices = invoices.filter(
      (invoice) => invoice.clientName === clientName
    );

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Detailed Invoices for ${clientName}`, 14, 20);

    const tableData = clientInvoices.map((invoice) =>
      invoice.rows.map((item) => [
        invoice.invoiceNumber,
        invoice.clientName,
        invoice.invoiceDate,
        item.itemName || "N/A",
        `£${parseFloat(item.amount || 0).toFixed(2)}`, // Display individual product price
      ])
    );

    const totalSum = clientInvoices.reduce((sum, invoice) => {
      return (
        sum +
        invoice.rows.reduce((rowSum, item) => {
          return rowSum + parseFloat(item.amount || 0);
        }, 0)
      );
    }, 0);

    doc.autoTable({
      head: [
        [
          "Invoice Number",
          "Client Name",
          "Date",
          "Product Name",
          "Product Amount",
        ],
      ],
      body: tableData.flat(),
      startY: 30,
    });

    doc.text(
      `Total Sum: £${totalSum.toFixed(2)}`,
      14,
      doc.autoTable.previous.finalY + 10
    ); // Display total sum below the table

    doc.save(`detailed_statement_${clientName}.pdf`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Manage Accounts</h2>

      {/* Search bar */}
      <div className="mb-4">
        <label className="text-sm font-medium">Search Clients</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Client Name"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Search Results */}
      {filteredClients.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2">Client Name</th>
              {/* <th className="border border-gray-300 px-3 py-2">
                Current Balance
              </th>
              <th className="border border-gray-300 px-3 py-2">
                Total Invoices
              </th> */}
              <th className="border border-gray-300 px-3 py-2">
                Receiving Amount
              </th>
              <th className="border border-gray-300 px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => {
              const totalInvoices = calculateTotalInvoices(
                client.billingAddress.name
              );
              const currentBalance = parseFloat(
                client.billingAddress.RecieveBalance || 0
              );
              const remainingBalance = currentBalance + totalInvoices; // Updated to addition

              return (
                <tr key={client.id}>
                  <td className="border border-gray-300 px-3 py-2">
                    {client.billingAddress.name}
                  </td>
                  {/* <td className="border border-gray-300 px-3 py-2">
                      £{currentBalance.toFixed(2)}
                    </td> */}

                  <td
                    className={`border border-gray-300 px-3 py-2 ${
                      remainingBalance < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    £{remainingBalance.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedClient(client.billingAddress.name)
                      }
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => exportBriefStatementToPDF(client)}
                      className="text-green-500 hover:underline"
                    >
                      Export Brief
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Detailed View */}
      {selectedClient && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Detailed Invoices for {selectedClient}
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2">
                  Invoice Number
                </th>
                <th className="border border-gray-300 px-3 py-2">
                  Product Name
                </th>
                <th className="border border-gray-300 px-3 py-2">
                  Client Name
                </th>
                <th className="border border-gray-300 px-3 py-2">Date</th>
                <th className="border border-gray-300 px-3 py-2">
                  Product Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter((invoice) => invoice.clientName === selectedClient)
                .map((invoice) =>
                  invoice.rows.map((item) => (
                    <tr key={`${invoice.id}-${item.itemName}`}>
                      <td className="border border-gray-300 px-3 py-2">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {item.itemName}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {invoice.clientName}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {invoice.invoiceDate}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        £{parseFloat(item.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
          <div className="mt-4">
            <button
              onClick={() => exportDetailedStatementToPDF(selectedClient)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Export Detailed
            </button>
            <button
              onClick={() => setSelectedClient(null)}
              className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;
