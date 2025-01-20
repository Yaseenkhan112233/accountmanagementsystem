import React from "react";
import { Calendar, PlusCircle } from "lucide-react";

const InvoiceForm = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Bill To Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Bill To</h2>
            <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md">
              Add Client
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Search Client</label>
              <input
                type="text"
                placeholder="Enter Customer Name or Mobile Number to search"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Client Details</label>
              <div className="mt-1 h-8 border-b border-gray-200"></div>
            </div>

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
                <option value="on">»On</option>
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

      {/* Items Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Rate</th>
              <th className="px-4 py-2">Tax(%)</th>
              <th className="px-4 py-2">Tax</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Amount (£)</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="px-4 py-2">
                <input
                  type="text"
                  placeholder="Enter Product name or Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <textarea
                  placeholder="Enter Product description"
                  className="mt-2 w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  defaultValue={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </td>
              <td className="px-4 py-2">0</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </td>
              <td className="px-4 py-2">£ 0</td>
              <td className="px-4 py-2">
                <button className="p-1 hover:bg-gray-200 rounded-md">×</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Row
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
