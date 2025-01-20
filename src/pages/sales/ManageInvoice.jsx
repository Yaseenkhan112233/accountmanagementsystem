// import React from "react";

// function ManageInvoice({ invoices }) {
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="px-4 py-2 border border-gray-200">Name</th>
//               <th className="px-4 py-2 border border-gray-200">Contact</th>
//               <th className="px-4 py-2 border border-gray-200">Email</th>
//               <th className="px-4 py-2 border border-gray-200">Address</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoices && invoices.length > 0 ? (
//               invoices.map((invoice, index) => (
//                 <tr key={invoice.id} className="bg-gray-50">
//                   <td className="px-4 py-2 border border-gray-200">
//                     {invoice.billingAddress.name}
//                   </td>
//                   <td className="px-4 py-2 border border-gray-200">
//                     {invoice.billingAddress.phone}
//                   </td>
//                   <td className="px-4 py-2 border border-gray-200">
//                     {invoice.billingAddress.email}
//                   </td>
//                   <td className="px-4 py-2 border border-gray-200">
//                     {invoice.billingAddress.address}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-4 text-gray-500">
//                   No invoices found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ManageInvoice;

import React from "react";

function ManageInvoice({ invoices }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border border-gray-200">#</th>
              <th className="px-4 py-2 border border-gray-200">Name</th>
              <th className="px-4 py-2 border border-gray-200">Contact</th>
              <th className="px-4 py-2 border border-gray-200">Email</th>
              <th className="px-4 py-2 border border-gray-200">Address</th>
            </tr>
          </thead>
          <tbody>
            {invoices && invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <tr key={invoice.id} className="bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {invoice.billingAddress.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {invoice.billingAddress.phone}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {invoice.billingAddress.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {invoice.billingAddress.address}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageInvoice;
