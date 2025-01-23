import React, { useState, useEffect } from "react";
import { db } from "../../firbase/firebase"; // Adjust the path to your Firebase config
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";

function ViewTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [transactionLimit, setTransactionLimit] = useState(10); // Default limit is 10
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteRemark, setDeleteRemark] = useState("");

  // Fetch transactions data in real-time and order by timestamp (latest first)
  useEffect(() => {
    const transactionsQuery = query(
      collection(db, "transactions"),
      orderBy("timestamp", "desc"),
      limit(transactionLimit) // Apply the limit based on the selected value
    );

    const unsubscribeTransactions = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionsData);
      }
    );

    return () => unsubscribeTransactions();
  }, [transactionLimit]); // Re-run the effect when the limit changes

  const handleLimitChange = (event) => {
    setTransactionLimit(Number(event.target.value));
  };

  // const handleDelete = async () => {
  //   if (!selectedTransaction || !deleteRemark.trim()) {
  //     alert("Please provide a remark for deleting the transaction.");
  //     return;
  //   }

  //   try {
  //     // Update client's balance
  //     const clientDocRef = doc(db, "clients", selectedTransaction.clientId);
  //     const newBalance =
  //       selectedTransaction.amountType === "credit"
  //         ? selectedTransaction.amount
  //         : -selectedTransaction.amount;

  //     await updateDoc(clientDocRef, {
  //       "billingAddress.RecieveBalance":
  //         updateDoc.FieldValue.increment(newBalance),
  //     });

  //     // Add deleted transaction to a new collection
  //     await addDoc(collection(db, "deleted_transactions"), {
  //       ...selectedTransaction,
  //       deleteRemark,
  //       deletedAt: new Date().toISOString(),
  //     });

  //     // Delete the transaction from the main collection
  //     const transactionDocRef = doc(db, "transactions", selectedTransaction.id);
  //     await deleteDoc(transactionDocRef);

  //     alert("Transaction deleted successfully.");
  //     setIsModalOpen(false);
  //     setDeleteRemark("");
  //     setSelectedTransaction(null);
  //   } catch (error) {
  //     console.error("Error deleting transaction: ", error);
  //     alert("Failed to delete transaction.");
  //   }
  // };
  const handleDelete = async () => {
    if (!selectedTransaction || !deleteRemark.trim()) {
      alert("Please provide a remark for deleting the transaction.");
      return;
    }

    try {
      // Fetch the client's current balance
      const clientDocRef = doc(db, "clients", selectedTransaction.clientId);
      const clientDocSnapshot = await getDoc(clientDocRef);

      if (!clientDocSnapshot.exists()) {
        throw new Error("Client document not found.");
      }

      const clientData = clientDocSnapshot.data();
      const currentBalance = parseFloat(
        clientData.billingAddress.RecieveBalance || 0
      );

      // Adjust balance based on the transaction amount and type
      const adjustmentAmount =
        selectedTransaction.amountType === "credit"
          ? -selectedTransaction.amount
          : selectedTransaction.amount;

      const updatedBalance = currentBalance + adjustmentAmount;

      // Update the client's balance
      await updateDoc(clientDocRef, {
        "billingAddress.RecieveBalance": updatedBalance,
      });

      // Add deleted transaction to a new collection
      await addDoc(collection(db, "deleted_transactions"), {
        ...selectedTransaction,
        deleteRemark,
        deletedAt: new Date().toISOString(),
      });

      // Delete the transaction from the main collection
      const transactionDocRef = doc(db, "transactions", selectedTransaction.id);
      await deleteDoc(transactionDocRef);

      alert("Transaction deleted successfully.");
      setIsModalOpen(false);
      setDeleteRemark("");
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Error deleting transaction: ", error.message);
      alert(`Failed to delete transaction: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">All Transactions</h2>

      {/* Dropdown to select the number of transactions to display */}
      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Show:</label>
        <select
          value={transactionLimit}
          onChange={handleLimitChange}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="5000">5000</option>
        </select>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Client Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Amount (£)</th>
                <th className="border border-gray-300 px-4 py-2">
                  Amount Type
                </th>
                <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.clientName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.amountType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setIsModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No transactions found.</p>
      )}

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-semibold mb-4">Delete Transaction</h3>
            <p className="mb-4">
              Are you sure you want to delete this transaction?
            </p>
            <textarea
              value={deleteRemark}
              onChange={(e) => setDeleteRemark(e.target.value)}
              placeholder="Enter reason for deletion"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => {
                  setIsModalOpen(false);
                  setDeleteRemark("");
                  setSelectedTransaction(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTransaction;
