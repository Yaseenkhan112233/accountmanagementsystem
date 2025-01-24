import React, { useState, useEffect } from "react";
import { db } from "../../firbase/firebase"; // Adjust the path to your Firebase config
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

function NewTransaction() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountType, setAmountType] = useState("cash");

  // Fetch clients data in real-time
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
    return () => unsubscribeClients();
  }, []);

  // Filter clients based on the search query
  const filteredClients = searchQuery
    ? clients.filter((client) =>
        client.billingAddress.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle add transaction
  const handleAddTransaction = async () => {
    if (!selectedClient || !amount || isNaN(amount)) {
      alert("Please select a client and enter a valid amount.");
      return;
    }

    const currentBalance = parseFloat(
      selectedClient.billingAddress.RecieveBalance || 0
    );
    const updatedBalance = currentBalance - parseFloat(amount);

    try {
      // Update client's balance
      const clientDocRef = doc(db, "clients", selectedClient.id);
      await updateDoc(clientDocRef, {
        "billingAddress.RecieveBalance": updatedBalance,
      });

      // Save transaction details to the "transactions" collection
      const transactionData = {
        clientId: selectedClient.id,
        clientName: selectedClient.billingAddress.name,
        amount: parseFloat(amount),
        amountType: amountType,
        timestamp: new Date().toISOString(), // Use Firestore Timestamp if needed
      };

      const transactionsCollectionRef = collection(db, "transactions");
      await addDoc(transactionsCollectionRef, transactionData);

      alert("Transaction successfully added and balance updated.");
      setAmount("");
      setAmountType("cash");
      setSelectedClient(null);
      setSearchQuery("");
    } catch (error) {
      console.error("Error adding transaction: ", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">New Transaction</h2>

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

      {/* Client Details */}
      {filteredClients.length > 0 && (
        <ul className="mb-4 border border-gray-300 rounded-md">
          {filteredClients.map((client) => (
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

      {selectedClient && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Selected Client: {selectedClient.billingAddress.name}
          </h3>
          <p>Phone: {selectedClient.billingAddress.phone}</p>
          <p>
            Current Balance: £
            {parseFloat(
              selectedClient.billingAddress.RecieveBalance || 0
            ).toFixed(2)}
          </p>
        </div>
      )}

      {/* Transaction Form */}
      <div className="mb-4">
        <label className="text-sm font-medium">Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Select Amount Type</label>
        <select
          value={amountType}
          onChange={(e) => setAmountType(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="cheque">Cheque</option>
        </select>
      </div>

      <button
        onClick={handleAddTransaction}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        Add Transaction
      </button>
    </div>
  );
}

export default NewTransaction;
