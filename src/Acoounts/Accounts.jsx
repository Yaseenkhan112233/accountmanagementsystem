// import React, { useState, useEffect } from "react";
// import { db } from "../firbase/firebase"; // Adjust the path to your Firebase config
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   onSnapshot,
// } from "firebase/firestore";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// function Accounts() {
//   const [clients, setClients] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [updatedBalance, setUpdatedBalance] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Fetch clients and invoices data in real-time
//   useEffect(() => {
//     const unsubscribeClients = onSnapshot(
//       collection(db, "clients"),
//       (snapshot) => {
//         const clientsData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setClients(clientsData);
//       }
//     );

//     const unsubscribeInvoices = onSnapshot(
//       collection(db, "invoices"),
//       (snapshot) => {
//         const invoicesData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setInvoices(invoicesData);
//       }
//     );

//     return () => {
//       unsubscribeClients();
//       unsubscribeInvoices();
//     };
//   }, []);

//   // Calculate total invoice amount for a client
//   const calculateTotalInvoices = (clientName) => {
//     return invoices
//       .filter((invoice) => invoice.clientName === clientName)
//       .reduce(
//         (total, invoice) => total + parseFloat(invoice.grandTotal || 0),
//         0
//       );
//   };

//   // Update the balance for all clients
//   const updateAllBalances = async () => {
//     setIsUpdating(true);

//     try {
//       const clientUpdates = clients.map(async (client) => {
//         const totalInvoices = calculateTotalInvoices(
//           client.billingAddress.name
//         );
//         const currentBalance = parseFloat(
//           client.billingAddress.RecieveBalance || 0
//         );
//         const newBalance = currentBalance - totalInvoices;

//         const clientDocRef = doc(db, "clients", client.id);
//         await updateDoc(clientDocRef, {
//           "billingAddress.RecieveBalance": newBalance,
//         });

//         return { name: client.billingAddress.name, newBalance };
//       });

//       const updatedClients = await Promise.all(clientUpdates);

//       alert("All balances updated successfully!");
//       console.log("Updated Clients:", updatedClients);

//       setClients((prevClients) =>
//         prevClients.map((client) => {
//           const updatedClient = updatedClients.find(
//             (c) => c.name === client.billingAddress.name
//           );
//           if (updatedClient) {
//             return {
//               ...client,
//               billingAddress: {
//                 ...client.billingAddress,
//                 RecieveBalance: updatedClient.newBalance,
//               },
//             };
//           }
//           return client;
//         })
//       );
//     } catch (error) {
//       console.error("Error updating balances:", error);
//       alert("Failed to update balances. Please try again.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Update the balance for the selected client
//   const handleBalanceUpdate = async () => {
//     if (!selectedClient) {
//       alert("Please select a client.");
//       return;
//     }

//     const client = clients.find(
//       (c) => c.billingAddress.name === selectedClient
//     );
//     if (!client) {
//       alert("Client not found.");
//       return;
//     }

//     const totalInvoices = calculateTotalInvoices(selectedClient);
//     const currentBalance = parseFloat(
//       client.billingAddress.RecieveBalance || 0
//     );
//     const newBalance = currentBalance - totalInvoices;

//     try {
//       const clientDocRef = doc(db, "clients", client.id);
//       await updateDoc(clientDocRef, {
//         "billingAddress.RecieveBalance": newBalance,
//       });

//       setUpdatedBalance(newBalance);
//       alert(
//         `Balance updated for ${selectedClient}. New balance: £${newBalance.toFixed(
//           2
//         )}`
//       );
//     } catch (error) {
//       console.error("Error updating balance:", error);
//       alert("Failed to update balance. Please try again.");
//     }
//   };

//   // Generate PDF for the selected client
//   const generatePDF = () => {
//     if (!selectedClient) {
//       alert("Please select a client.");
//       return;
//     }

//     const client = clients.find(
//       (c) => c.billingAddress.name === selectedClient
//     );
//     const totalInvoices = calculateTotalInvoices(selectedClient);
//     const currentBalance = parseFloat(
//       client.billingAddress.RecieveBalance || 0
//     );
//     const finalBalance =
//       updatedBalance !== null ? updatedBalance : currentBalance - totalInvoices;

//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Client Account Statement", 14, 20);
//     doc.setFontSize(12);
//     doc.text(`Client Name: ${client.billingAddress.name}`, 14, 30);
//     doc.text(`Total Invoice Amount: £${totalInvoices.toFixed(2)}`, 14, 40);
//     doc.text(`Current Balance: £${currentBalance.toFixed(2)}`, 14, 50);
//     doc.text(`Final Balance: £${finalBalance.toFixed(2)}`, 14, 60);

//     const tableData = invoices
//       .filter((invoice) => invoice.clientName === selectedClient)
//       .map((invoice) => [
//         invoice.invoiceNumber,
//         invoice.grandTotal,
//         invoice.invoiceDate,
//       ]);

//     doc.autoTable({
//       head: [["Invoice Number", "Amount", "Date"]],
//       body: tableData,
//       startY: 70,
//     });

//     doc.save(`account_statement_${selectedClient}.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Accounts</h2>

//       {/* Dropdown for selecting a client */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Select Client:</label>
//         <select
//           value={selectedClient || ""}
//           onChange={(e) => setSelectedClient(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//         >
//           <option value="" disabled>
//             -- Select a Client --
//           </option>
//           {clients.map((client) => (
//             <option key={client.id} value={client.billingAddress.name}>
//               {client.billingAddress.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display Client Info */}
//       {selectedClient && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold">Client Details</h3>
//           {(() => {
//             const client = clients.find(
//               (c) => c.billingAddress.name === selectedClient
//             );
//             const totalInvoices = calculateTotalInvoices(selectedClient);
//             const currentBalance = parseFloat(
//               client.billingAddress.RecieveBalance || 0
//             );
//             const remainingBalance =
//               updatedBalance !== null
//                 ? updatedBalance
//                 : currentBalance - totalInvoices;

//             return (
//               <div>
//                 <p>
//                   <strong>Name:</strong> {client.billingAddress.name}
//                 </p>
//                 <p>
//                   <strong>Total Invoices Amount:</strong> £
//                   {totalInvoices.toFixed(2)}
//                 </p>
//                 <p>
//                   <strong>Current Balance:</strong> £{currentBalance.toFixed(2)}
//                 </p>
//                 <p>
//                   <strong>Updated Balance:</strong> £
//                   {remainingBalance.toFixed(2)}
//                 </p>
//                 <div className="mt-4 space-x-4">
//                   <button
//                     onClick={handleBalanceUpdate}
//                     className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//                   >
//                     Update Balance
//                   </button>
//                   <button
//                     onClick={generatePDF}
//                     className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
//                   >
//                     Export to PDF
//                   </button>
//                 </div>
//               </div>
//             );
//           })()}
//         </div>
//       )}

//       {/* Update all balances */}
//       <div className="mt-8 flex justify-end">
//         <button
//           onClick={updateAllBalances}
//           disabled={isUpdating}
//           className={`px-4 py-2 text-white rounded-md ${
//             isUpdating
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           {isUpdating ? "Updating All..." : "Update All Balances"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Accounts;

// Second number this is also good

// import React, { useState, useEffect } from "react";
// import { db } from "../firbase/firebase"; // Adjust the path to your Firebase config
// import { collection, onSnapshot } from "firebase/firestore";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// function Accounts() {
//   const [clients, setClients] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedClient, setSelectedClient] = useState(null);

//   // Fetch clients and invoices data in real-time
//   useEffect(() => {
//     const unsubscribeClients = onSnapshot(
//       collection(db, "clients"),
//       (snapshot) => {
//         const clientsData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setClients(clientsData);
//       }
//     );

//     const unsubscribeInvoices = onSnapshot(
//       collection(db, "invoices"),
//       (snapshot) => {
//         const invoicesData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setInvoices(invoicesData);
//       }
//     );

//     return () => {
//       unsubscribeClients();
//       unsubscribeInvoices();
//     };
//   }, []);

//   // Filter clients based on the search query
//   const filteredClients = searchQuery
//     ? clients.filter((client) =>
//         client.billingAddress.name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       )
//     : [];

//   // Calculate total invoice amount for a client
//   const calculateTotalInvoices = (clientName) => {
//     return invoices
//       .filter((invoice) => invoice.clientName === clientName)
//       .reduce(
//         (total, invoice) => total + parseFloat(invoice.grandTotal || 0),
//         0
//       );
//   };

//   // Export brief statement to PDF
//   const exportBriefStatementToPDF = (client) => {
//     const doc = new jsPDF();

//     const totalInvoices = calculateTotalInvoices(client.billingAddress.name);
//     const currentBalance = parseFloat(
//       client.billingAddress.RecieveBalance || 0
//     );
//     const remainingBalance = currentBalance - totalInvoices;

//     doc.setFontSize(18);
//     doc.text("Client Brief Statement", 14, 20);
//     doc.setFontSize(12);
//     doc.text(`Name: ${client.billingAddress.name}`, 14, 30);
//     doc.text(`Current Balance: £${currentBalance.toFixed(2)}`, 14, 40);
//     doc.text(`Total Invoices: £${totalInvoices.toFixed(2)}`, 14, 50);
//     doc.text(`Receiving Amount: £${remainingBalance.toFixed(2)}`, 14, 60);

//     doc.save(`brief_statement_${client.billingAddress.name}.pdf`);
//   };

//   // Export detailed invoices to PDF
//   const exportDetailedStatementToPDF = (clientName) => {
//     const clientInvoices = invoices.filter(
//       (invoice) => invoice.clientName === clientName
//     );

//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text(`Detailed Invoices for ${clientName}`, 14, 20);

//     const tableData = clientInvoices.map((invoice) => [
//       invoice.invoiceNumber,
//       `£${parseFloat(invoice.grandTotal || 0).toFixed(2)}`,
//       invoice.invoiceDate,
//     ]);

//     doc.autoTable({
//       head: [["Invoice Number", "Amount", "Date"]],
//       body: tableData,
//       startY: 30,
//     });

//     doc.save(`detailed_statement_${clientName}.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-6">Manage Accounts</h2>

//       {/* Search bar */}
//       <div className="mb-4">
//         <label className="text-sm font-medium">Search Clients</label>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search by Client Name"
//           className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//         />
//       </div>

//       {/* Search Results */}
//       {filteredClients.length > 0 && (
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 px-3 py-2">Client Name</th>
//               <th className="border border-gray-300 px-3 py-2">
//                 Current Balance
//               </th>
//               <th className="border border-gray-300 px-3 py-2">
//                 Total Invoices
//               </th>
//               <th className="border border-gray-300 px-3 py-2">
//                 Receiving Amount
//               </th>
//               <th className="border border-gray-300 px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredClients.map((client) => {
//               const totalInvoices = calculateTotalInvoices(
//                 client.billingAddress.name
//               );
//               const currentBalance = parseFloat(
//                 client.billingAddress.RecieveBalance || 0
//               );
//               const remainingBalance = currentBalance - totalInvoices;

//               return (
//                 <tr key={client.id}>
//                   <td className="border border-gray-300 px-3 py-2">
//                     {client.billingAddress.name}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     £{currentBalance.toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     £{totalInvoices.toFixed(2)}
//                   </td>
//                   <td
//                     className={`border border-gray-300 px-3 py-2 ${
//                       remainingBalance < 0 ? "text-red-500" : "text-green-500"
//                     }`}
//                   >
//                     £{remainingBalance.toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2 flex gap-2">
//                     <button
//                       onClick={() =>
//                         setSelectedClient(client.billingAddress.name)
//                       }
//                       className="text-blue-500 hover:underline"
//                     >
//                       View
//                     </button>
//                     <button
//                       onClick={() => exportBriefStatementToPDF(client)}
//                       className="text-green-500 hover:underline"
//                     >
//                       Export Brief
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}

//       {/* Detailed View */}
//       {selectedClient && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-4">
//             Detailed Invoices for {selectedClient}
//           </h3>
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-3 py-2">
//                   Invoice Number
//                 </th>
//                 <th className="border border-gray-300 px-3 py-2">Amount</th>
//                 <th className="border border-gray-300 px-3 py-2">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoices
//                 .filter((invoice) => invoice.clientName === selectedClient)
//                 .map((invoice) => (
//                   <tr key={invoice.id}>
//                     <td className="border border-gray-300 px-3 py-2">
//                       {invoice.invoiceNumber}
//                     </td>
//                     <td className="border border-gray-300 px-3 py-2">
//                       £{parseFloat(invoice.grandTotal || 0).toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 px-3 py-2">
//                       {invoice.invoiceDate}
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//           <div className="mt-4">
//             <button
//               onClick={() => exportDetailedStatementToPDF(selectedClient)}
//               className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//             >
//               Export Detailed
//             </button>
//             <button
//               onClick={() => setSelectedClient(null)}
//               className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Accounts;

// third

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
    const remainingBalance = currentBalance - totalInvoices;

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
        `£${parseFloat(invoice.grandTotal || 0).toFixed(2)}`,
      ])
    );

    doc.autoTable({
      head: [
        [
          "Invoice Number",
          "Client Name",
          "Date",
          "Product Name",
          "Invoice Amount",
        ],
      ],
      body: tableData.flat(),
      startY: 30,
    });

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
              <th className="border border-gray-300 px-3 py-2">
                Current Balance
              </th>
              <th className="border border-gray-300 px-3 py-2">
                Total Invoices
              </th>
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
              const remainingBalance = currentBalance - totalInvoices;

              return (
                <tr key={client.id}>
                  <td className="border border-gray-300 px-3 py-2">
                    {client.billingAddress.name}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    £{currentBalance.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    £{totalInvoices.toFixed(2)}
                  </td>
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
                  Invoice Amount
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
                        £{parseFloat(invoice.grandTotal || 0).toFixed(2)}
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
