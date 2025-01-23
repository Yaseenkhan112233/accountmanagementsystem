import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { db } from "../../firbase/firebase"; // Import Firestore
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firestore methods

const InvoiceForm = ({ addInvoice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    RecieveBalance: "",
    city: "",
    region: "",
    country: "",
    postBox: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    region: "",
    country: "",
    postBox: "",
  });
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // Invoice Static Fields
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [invoiceReference, setInvoiceReference] = useState("");
  const [invoiceNote, setInvoiceNote] = useState("");

  // Fetch clients from Firestore
  const fetchClients = async (query) => {
    const querySnapshot = await getDocs(collection(db, "clients"));
    const clientsData = querySnapshot.docs.map((doc) => doc.data());

    // Filter clients based on the query
    const filtered = clientsData.filter(
      (client) =>
        client.billingAddress.name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        client.billingAddress.phone.includes(query)
    );

    setFilteredClients(filtered);
  };

  // Invoice Number
  const [invoiceNumber, setInvoiceNumber] = useState(1004); // Static initial value

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSameAsBilling(false);
  };

  // Handle "Same as Billing" checkbox toggle
  const handleSameAsBilling = (checked) => {
    setSameAsBilling(checked);
    if (checked) {
      setShippingAddress({ ...billingAddress });
    }
  };

  // Handle input changes for Billing and Shipping addresses
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "billing") {
      setBillingAddress({ ...billingAddress, [name]: value });
      if (sameAsBilling) {
        setShippingAddress({ ...billingAddress, [name]: value });
      }
    } else {
      setShippingAddress({ ...shippingAddress, [name]: value });
    }
  };

  // Handle form submission
  // const handleAddClient = async (e) => {
  //   e.preventDefault();

  //   // Create a new client data object
  //   const newClient = {
  //     billingAddress,
  //     shippingAddress,
  //   };

  //   // Add client data to Firestore
  //   try {
  //     await addDoc(collection(db, "clients"), newClient);

  //     // Reset form states
  //     setBillingAddress({
  //       name: "",
  //       phone: "",
  //       email: "",
  //       address: "",
  //       city: "",
  //       region: "",
  //       country: "",
  //       postBox: "",
  //     });
  //     setShippingAddress({
  //       name: "",
  //       phone: "",
  //       email: "",
  //       address: "",
  //       city: "",
  //       region: "",
  //       country: "",
  //       postBox: "",
  //     });
  //     setSameAsBilling(false);
  //     closeModal();
  //     fetchClients(searchQuery); // Re-fetch clients after adding a new one
  //   } catch (e) {
  //     console.error("Error adding client: ", e);
  //   }
  // };
  const handleAddClient = async (e) => {
    e.preventDefault();

    // Validate if the phone number is already used
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Check if any existing client has the same phone number
      const duplicateClient = clientsData.find(
        (client) => client.billingAddress.phone === billingAddress.phone
      );

      if (duplicateClient) {
        alert("A client with this phone number already exists!");
        return; // Prevent adding duplicate client
      }

      // Create a new client data object
      const newClient = {
        billingAddress,
        shippingAddress,
      };

      // Add client data to Firestore
      await addDoc(collection(db, "clients"), newClient);

      // Reset form states
      setBillingAddress({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        region: "",
        country: "",
        postBox: "",
      });
      setShippingAddress({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        region: "",
        country: "",
        postBox: "",
      });
      setSameAsBilling(false);
      closeModal();
      fetchClients(searchQuery); // Re-fetch clients after adding a new one

      alert("Client added successfully!");
    } catch (e) {
      console.error("Error adding client: ", e);
      alert("An error occurred while adding the client. Please try again.");
    }
  };

  // Rows for items in the invoice
  const [rows, setRows] = useState([
    {
      itemName: "",
      quantity: 1,
      rate: 0,
      taxPercentage: 0,
      discount: 0,
      amount: 0,
    },
  ]);

  // Calculate the amount for a row
  const calculateAmount = (row) => {
    const tax = (row.rate * row.quantity * row.taxPercentage) / 100;
    const discount = (row.rate * row.quantity * row.discount) / 100;
    return row.rate * row.quantity + tax - discount;
  };

  // Add a new row
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        itemName: "",
        quantity: 1,
        rate: 0,
        taxPercentage: 0,
        discount: 0,
        amount: 0,
      },
    ]);
  };

  // Remove a row by index
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Handle input changes in the rows
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    updatedRows[index].amount = calculateAmount(updatedRows[index]);
    setRows(updatedRows);
  };

  // Search functionality for clients
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Trigger fetch every time the search query changes
    fetchClients(query);
  };
  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "invoiceNumber"));
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Assuming a single document for invoice number
          setInvoiceNumber(doc.data().currentInvoiceNumber);
        } else {
          // If no invoice number exists in Firestore, start with a default value
          setInvoiceNumber(1004);
        }
      } catch (error) {
        console.error("Error fetching invoice number: ", error);
        // Optionally use localStorage as a backup
        const localInvoiceNumber = localStorage.getItem("invoiceNumber");
        if (localInvoiceNumber) {
          setInvoiceNumber(parseInt(localInvoiceNumber));
        }
      }
    };

    fetchInvoiceNumber();
  }, []);
  const generateInvoice = async () => {
    if (!selectedClient) {
      alert("Please select or add a client before generating an invoice.");
      return;
    }

    // Increment invoice number before use
    const currentInvoiceNumber = invoiceNumber;

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
    doc.text(`${billingAddress.name}`, 14, 45);
    doc.text(`${billingAddress.address}`, 14, 50);
    doc.text(`${billingAddress.city}, ${billingAddress.region}`, 14, 55);
    doc.text(`${billingAddress.country}`, 14, 60);
    doc.text(`Phone: ${billingAddress.phone}`, 14, 65);
    doc.text(`Email: ${billingAddress.email}`, 14, 70);

    // Shipping Info
    doc.setFontSize(12);
    doc.text("Shipping Address:", 120, 40);
    doc.setFontSize(10);
    doc.text(`${shippingAddress.name}`, 120, 45);
    doc.text(`${shippingAddress.address}`, 120, 50);
    doc.text(`${shippingAddress.city}, ${shippingAddress.region}`, 120, 55);
    doc.text(`${shippingAddress.country}`, 120, 60);
    doc.text(`Phone: ${shippingAddress.phone}`, 120, 65);
    doc.text(`Email: ${shippingAddress.email}`, 120, 70);

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
    doc.save(`invoice_${currentInvoiceNumber}.pdf`);

    // Save invoice data to Firestore
    try {
      const invoiceDetails = {
        invoiceNumber: currentInvoiceNumber,
        invoiceDate,
        clientName: selectedClient.billingAddress.name, // Store the client name
        rows, // Store the row data for items
        grandTotal,
        clientEmail: selectedClient.billingAddress.email,
        clientAdress: selectedClient.billingAddress.address,
        clientPhone: selectedClient.billingAddress.phone,
      };

      await addDoc(collection(db, "invoices"), invoiceDetails);

      // Update invoice number in Firestore and localStorage
      await addDoc(collection(db, "invoiceNumber"), {
        currentInvoiceNumber: currentInvoiceNumber + 1,
      });

      // Also update localStorage
      localStorage.setItem("invoiceNumber", currentInvoiceNumber + 1);

      // Increment invoice number for the next invoice
      setInvoiceNumber((prev) => prev + 1);

      // Clear all fields in rows
      setRows([
        {
          itemName: "",
          quantity: 1,
          rate: 0,
          taxPercentage: 0,
          discount: 0,
          amount: 0,
        },
      ]);
    } catch (error) {
      console.error("Error saving invoice: ", error);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setBillingAddress({
      name: client.billingAddress.name,
      phone: client.billingAddress.phone,
      email: client.billingAddress.email,
      address: client.billingAddress.address,
      city: client.billingAddress.city,
      region: client.billingAddress.region,
      country: client.billingAddress.country,
      postBox: client.billingAddress.postBox,
    });
    setShippingAddress({
      name: client.billingAddress.name,
      phone: client.billingAddress.phone,
      email: client.billingAddress.email,
      address: client.billingAddress.address,
      city: client.billingAddress.city,
      region: client.billingAddress.region,
      country: client.billingAddress.country,
      postBox: client.billingAddress.postBox,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Bill To Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Bill To</h2>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md"
            >
              Add Client
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Search Client</label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter Customer Name or Mobile Number to search"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {searchQuery && filteredClients.length > 0 && (
              <ul className="mt-2">
                {filteredClients.map((client) => (
                  <li
                    key={client.phone}
                    onClick={() => handleClientSelect(client)}
                    className="cursor-pointer text-blue-600"
                  >
                    {client.billingAddress.name} ({client.billingAddress.phone})
                  </li>
                ))}
              </ul>
            )}

            {selectedClient && (
              <div className="mt-4">
                <h4 className="font-semibold">Client Details</h4>
                <div className="mt-2">
                  <p>Name: {selectedClient.billingAddress.name}</p>
                  <p>Phone: {selectedClient.billingAddress.phone}</p>
                  <p>Email: {selectedClient.billingAddress.email}</p>
                  <p>Address: {selectedClient.billingAddress.address}</p>
                  <p>City: {selectedClient.billingAddress.city}</p>
                  <p>Region: {selectedClient.billingAddress.region}</p>
                  <p>Country: {selectedClient.billingAddress.country}</p>
                  <p>PostBox: {selectedClient.billingAddress.postBox}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Invoice Properties */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Invoice Properties</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                readOnly
                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reference</label>
              <input
                type="text"
                value={invoiceReference}
                onChange={(e) => setInvoiceReference(e.target.value)}
                placeholder="Reference #"
                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Invoice Note</label>
            <textarea
              value={invoiceNote}
              onChange={(e) => setInvoiceNote(e.target.value)}
              className="mt-1 w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter note..."
            />
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">Add Customer</h3>
            <form onSubmit={handleAddClient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Address */}
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Billing Address
                  </h4>
                  <div className="space-y-4">
                    <input
                      name="name"
                      value={billingAddress.name}
                      onChange={(e) => handleInputChange(e, "billing")}
                      placeholder="Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      name="phone"
                      value={billingAddress.phone}
                      onChange={(e) => handleInputChange(e, "billing")}
                      placeholder="Phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      name="email"
                      value={billingAddress.email}
                      onChange={(e) => handleInputChange(e, "billing")}
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      name="RecieveBalance"
                      type="number"
                      value={billingAddress.RecieveBalance}
                      onChange={(e) => handleInputChange(e, "billing")}
                      placeholder="Opening Balance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      name="address"
                      value={billingAddress.address}
                      onChange={(e) => handleInputChange(e, "billing")}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Shipping Address
                  </h4>
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => handleSameAsBilling(e.target.checked)}
                      className="mr-2"
                    />
                    Same as Billing
                  </label>
                  <div className="space-y-4">
                    <input
                      name="name"
                      value={shippingAddress.name}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="Phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      name="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      name="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2">Item Name</th>
              <th className="border border-gray-300 px-3 py-2">Quantity</th>
              <th className="border border-gray-300 px-3 py-2">Rate</th>
              <th className="border border-gray-300 px-3 py-2">Tax (%)</th>
              <th className="border border-gray-300 px-3 py-2">Tax</th>
              <th className="border border-gray-300 px-3 py-2">Discount</th>
              <th className="border border-gray-300 px-3 py-2">Amount (£)</th>
              <th className="border border-gray-300 px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={row.itemName}
                    onChange={(e) =>
                      handleRowChange(index, "itemName", e.target.value)
                    }
                    placeholder="Enter Product Name"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleRowChange(index, "rate", parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={row.taxPercentage}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "taxPercentage",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  £
                  {(
                    (row.rate * row.quantity * row.taxPercentage) /
                    100
                  ).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={row.discount}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "discount",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  £{row.amount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500"
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleAddRow}
          className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          Add Row
        </button>
      </div>

      {/* Invoice Summary */}
      <div className="mt-6 flex justify-end space-x-8">
        <div>
          <label className="block text-sm font-medium">Total Tax</label>
          <p className="text-lg font-semibold">
            £
            {rows
              .reduce(
                (sum, row) =>
                  sum + (row.rate * row.quantity * row.taxPercentage) / 100,
                0
              )
              .toFixed(2)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Total Discount</label>
          <p className="text-lg font-semibold">
            £
            {rows
              .reduce(
                (sum, row) =>
                  sum + (row.rate * row.quantity * row.discount) / 100,
                0
              )
              .toFixed(2)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Grand Total</label>
          <p className="text-lg font-semibold">
            £{rows.reduce((sum, row) => sum + row.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>
      <button
        onClick={generateInvoice}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default InvoiceForm;
