import React, { useEffect, useState } from "react";
import { db } from "../../firbase/firebase"; // Adjust the path to your Firebase config
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function DeletedTransaction() {
  const [deletedTransactions, setDeletedTransactions] = useState([]);

  // Fetch deleted transactions data in real-time
  useEffect(() => {
    const deletedTransactionsQuery = query(
      collection(db, "deleted_transactions"),
      orderBy("deletedAt", "desc") // Order by deletion time in descending order
    );

    const unsubscribe = onSnapshot(deletedTransactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeletedTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Deleted Transactions</h2>

      {deletedTransactions.length > 0 ? (
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
                <th className="border border-gray-300 px-4 py-2">Deleted At</th>
                <th className="border border-gray-300 px-4 py-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {deletedTransactions.map((transaction) => (
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
                    {new Date(transaction.deletedAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.deleteRemark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          No deleted transactions found.
        </p>
      )}
    </div>
  );
}

export default DeletedTransaction;
