// import React, { useState } from "react";
// import { PlusCircle } from "lucide-react";

// const InvoiceForm = ({ addInvoice }) => {
//   // State to control modal visibility
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // States for Billing and Shipping addresses
//   const [billingAddress, setBillingAddress] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//     city: "",
//     region: "",
//     country: "",
//     postBox: "",
//   });

//   const [shippingAddress, setShippingAddress] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//     city: "",
//     region: "",
//     country: "",
//     postBox: "",
//   });

//   const [sameAsBilling, setSameAsBilling] = useState(false);

//   // Function to open the modal
//   const openModal = () => setIsModalOpen(true);

//   // Function to close the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSameAsBilling(false); // Reset the "Same as Billing" state
//   };

//   // Handle "Same as Billing" checkbox toggle
//   const handleSameAsBilling = (checked) => {
//     setSameAsBilling(checked);
//     if (checked) {
//       setShippingAddress({ ...billingAddress });
//     }
//   };

//   // Handle input changes for Billing and Shipping addresses
//   const handleInputChange = (e, type) => {
//     const { name, value } = e.target;
//     if (type === "billing") {
//       setBillingAddress({ ...billingAddress, [name]: value });
//       if (sameAsBilling) {
//         setShippingAddress({ ...billingAddress, [name]: value });
//       }
//     } else {
//       setShippingAddress({ ...shippingAddress, [name]: value });
//     }
//   };

//   // Handle form submission
//   const handleAddClient = (e) => {
//     e.preventDefault();

//     // Create a combined invoice object
//     const invoiceData = {
//       billingAddress,
//       shippingAddress,
//       date: new Date().toISOString().split("T")[0],
//       amount: "100.00", // Example static amount (change as needed)
//     };

//     // Send data to parent component
//     if (addInvoice) {
//       addInvoice(invoiceData);
//     }

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
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column - Bill To Section */}
//         <div className="space-y-6">
//           <div className="flex items-center gap-4">
//             <h2 className="text-2xl font-semibold">Bill To</h2>
//             <button
//               onClick={openModal}
//               className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md"
//             >
//               Add Client
//             </button>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Search Client</label>
//               <input
//                 type="text"
//                 placeholder="Enter Customer Name or Mobile Number to search"
//                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Client Details</label>
//               <div className="mt-1 h-8 border-b border-gray-200"></div>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Warehouse</label>
//               <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
//                 <option value="all">All</option>
//                 <option value="warehouse1">Warehouse 1</option>
//                 <option value="warehouse2">Warehouse 2</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Invoice Properties */}
//         <div className="space-y-6">
//           <h2 className="text-2xl font-semibold">Invoice Properties</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Invoice Number</label>
//               <input
//                 type="text"
//                 value="1004"
//                 readOnly
//                 className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Reference</label>
//               <input
//                 type="text"
//                 placeholder="Reference #"
//                 className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Invoice Date</label>
//               <input
//                 type="date"
//                 defaultValue="2025-01-20"
//                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Invoice Due Date</label>
//               <input
//                 type="date"
//                 defaultValue="2025-01-20"
//                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Tax</label>
//               <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
//                 <option value="on">On</option>
//                 <option value="off">Off</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Discount</label>
//               <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
//                 <option value="default">% Discount After TAX</option>
//                 <option value="5">5%</option>
//                 <option value="10">10%</option>
//                 <option value="15">15%</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Invoice Note</label>
//             <textarea
//               className="mt-1 w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//               placeholder="Enter note..."
//             />
//           </div>
//         </div>
//       </div>

//       {/* Modal Form */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-3xl">
//             <h3 className="text-xl font-semibold mb-4">Add Customer</h3>
//             <form onSubmit={handleAddClient} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Billing Address */}
//                 <div>
//                   <h4 className="font-semibold text-lg mb-2">
//                     Billing Address
//                   </h4>
//                   <div className="space-y-4">
//                     <input
//                       name="name"
//                       value={billingAddress.name}
//                       onChange={(e) => handleInputChange(e, "billing")}
//                       placeholder="Name"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <input
//                       name="phone"
//                       value={billingAddress.phone}
//                       onChange={(e) => handleInputChange(e, "billing")}
//                       placeholder="Phone"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <input
//                       name="email"
//                       value={billingAddress.email}
//                       onChange={(e) => handleInputChange(e, "billing")}
//                       placeholder="Email"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <textarea
//                       name="address"
//                       value={billingAddress.address}
//                       onChange={(e) => handleInputChange(e, "billing")}
//                       placeholder="Address"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div>
//                   <h4 className="font-semibold text-lg mb-2">
//                     Shipping Address
//                   </h4>
//                   <label className="flex items-center mb-4">
//                     <input
//                       type="checkbox"
//                       checked={sameAsBilling}
//                       onChange={(e) => handleSameAsBilling(e.target.checked)}
//                       className="mr-2"
//                     />
//                     Same as Billing
//                   </label>
//                   <div className="space-y-4">
//                     <input
//                       name="name"
//                       value={shippingAddress.name}
//                       onChange={(e) => handleInputChange(e, "shipping")}
//                       placeholder="Name"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <input
//                       name="phone"
//                       value={shippingAddress.phone}
//                       onChange={(e) => handleInputChange(e, "shipping")}
//                       placeholder="Phone"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <input
//                       name="email"
//                       value={shippingAddress.email}
//                       onChange={(e) => handleInputChange(e, "shipping")}
//                       placeholder="Email"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                     <textarea
//                       name="address"
//                       value={shippingAddress.address}
//                       onChange={(e) => handleInputChange(e, "shipping")}
//                       placeholder="Address"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md"
//                 >
//                   Add
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InvoiceForm;

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

const InvoiceForm = ({ addInvoice, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
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
  const handleAddClient = (e) => {
    e.preventDefault();

    // Create a combined invoice object
    const invoiceData = {
      billingAddress,
      shippingAddress,
      date: new Date().toISOString().split("T")[0],
      amount: "100.00", // Example static amount (change as needed)
    };

    // Send data to parent component
    if (addInvoice) {
      addInvoice(invoiceData);
    }

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
  };

  // Search functionality for clients
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter clients based on name or phone
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.phone.includes(query)
    );

    setFilteredClients(filtered);
  };

  // Handle client selection from the search
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setBillingAddress({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      city: client.city,
      region: client.region,
      country: client.country,
      postBox: client.postBox,
    });
    setShippingAddress({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      city: client.city,
      region: client.region,
      country: client.country,
      postBox: client.postBox,
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

            {filteredClients.length > 0 && (
              <ul className="mt-2">
                {filteredClients.map((client) => (
                  <li
                    key={client.phone}
                    onClick={() => handleClientSelect(client)}
                    className="cursor-pointer text-blue-600"
                  >
                    {client.name} ({client.phone})
                  </li>
                ))}
              </ul>
            )}

            {selectedClient && (
              <div className="mt-4">
                <h4 className="font-semibold">Client Details</h4>
                <div className="mt-2">
                  <p>Name: {selectedClient.name}</p>
                  <p>Phone: {selectedClient.phone}</p>
                  <p>Email: {selectedClient.email}</p>
                  <p>Address: {selectedClient.address}</p>
                  <p>City: {selectedClient.city}</p>
                  <p>Region: {selectedClient.region}</p>
                  <p>Country: {selectedClient.country}</p>
                  <p>PostBox: {selectedClient.postBox}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Warehouse</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="all">All</option>
                <option value="warehouse1">Warehouse 1</option>
                <option value="warehouse2">Warehouse 2</option>
              </select>
            </div>
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
                value="1004"
                readOnly
                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reference</label>
              <input
                type="text"
                placeholder="Reference #"
                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Invoice Date</label>
              <input
                type="date"
                defaultValue="2025-01-20"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Invoice Due Date</label>
              <input
                type="date"
                defaultValue="2025-01-20"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tax</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Discount</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="default">% Discount After TAX</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Invoice Note</label>
            <textarea
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
    </div>
  );
};

export default InvoiceForm;
