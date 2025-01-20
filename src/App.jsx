// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Sidebar from "./pages/Sidebar";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import Vehicle from "./pages/Vehicle";
// import Driver from "./pages/Drivers";
// import Fuel from "./pages/Fuel";
// import LoginPage from "./pages/LoginPage";
// import Setting from "./pages/Setting/Setting";
// import Maintenance from "./pages/Maintenance";
// import Parts from "./pages/Parts";

// import NewIncome from "./pages/sales/NewInvoice";
// import ManageIncome from "./pages/sales/ManageInvoice";
// import NewClient from "./pages/Clients/NewClients";
// import ManageClients from "./pages/Clients/ManageClients";
// import NewSupplier from "./pages/Suppliers/NewSupplier";
// import ManageSuppliers from "./pages/Suppliers/ManageSupplier";
// import ViewTransaction from "./pages/Transaction/ViewTransaction";
// import NewTransaction from "./pages/Transaction/NewTransaction";
// import Income from "./pages/Transaction/Income";
// import Expense from "./pages/Transaction/Expense";
// import CustomerStatement from "./pages/Report/CustomerStatement";
// import SupplierStatement from "./pages/Report/SupplierStatement";
// import CalculateIncome from "./pages/Setting/CalculateIncome";
// import CalculateExpense from "./pages/Setting/CalculateExpemse";

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsAuthenticated(!!token);
//   }, []);

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     setIsAuthenticated(false);
//   };

//   const ProtectedRoute = ({ element }) => {
//     return isAuthenticated ? element : <Navigate to="/login" replace />;
//   };

//   return (
//     <Router>
//       <div className="flex">
//         {isAuthenticated && <Sidebar />}
//         <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
//           <Routes>
//             <Route
//               path="/login"
//               element={
//                 isAuthenticated ? (
//                   <Navigate to="/dashboard" replace />
//                 ) : (
//                   <LoginPage onLogin={handleLogin} />
//                 )
//               }
//             />

//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute
//                   element={<Dashboard onLogout={handleLogout} />}
//                 />
//               }
//             />

//             {/* Fleet Management Routes */}
//             <Route
//               path="/vehicle"
//               element={<ProtectedRoute element={<Vehicle />} />}
//             />
//             <Route
//               path="/driver"
//               element={<ProtectedRoute element={<Driver />} />}
//             />
//             <Route
//               path="/maintenance"
//               element={<ProtectedRoute element={<Maintenance />} />}
//             />
//             <Route
//               path="/fuel"
//               element={<ProtectedRoute element={<Fuel />} />}
//             />
//             <Route
//               path="/parts"
//               element={<ProtectedRoute element={<Parts />} />}
//             />

//             {/* Sales Routes */}
//             <Route
//               path="/sales/new-income"
//               element={<ProtectedRoute element={<NewIncome />} />}
//             />
//             <Route
//               path="/sales/manage-income"
//               element={<ProtectedRoute element={<ManageIncome />} />}
//             />

//             {/* Clients Routes */}
//             <Route
//               path="/clients/new-client"
//               element={<ProtectedRoute element={<NewClient />} />}
//             />
//             <Route
//               path="/clients/manage-clients"
//               element={<ProtectedRoute element={<ManageClients />} />}
//             />

//             {/* Suppliers Routes */}
//             <Route
//               path="/suppliers/new-supplier"
//               element={<ProtectedRoute element={<NewSupplier />} />}
//             />
//             <Route
//               path="/suppliers/manage-suppliers"
//               element={<ProtectedRoute element={<ManageSuppliers />} />}
//             />

//             {/* Transactions Routes */}
//             <Route
//               path="/transactions/view"
//               element={<ProtectedRoute element={<ViewTransaction />} />}
//             />
//             <Route
//               path="/transactions/new"
//               element={<ProtectedRoute element={<NewTransaction />} />}
//             />
//             <Route
//               path="/transactions/income"
//               element={<ProtectedRoute element={<Income />} />}
//             />
//             <Route
//               path="/transactions/expense"
//               element={<ProtectedRoute element={<Expense />} />}
//             />

//             {/* Reports Routes */}
//             <Route
//               path="/reports/customer-statement"
//               element={<ProtectedRoute element={<CustomerStatement />} />}
//             />
//             <Route
//               path="/reports/supplier-statement"
//               element={<ProtectedRoute element={<SupplierStatement />} />}
//             />

//             {/* Settings Routes */}
//             <Route
//               path="/settings/calculate-income"
//               element={<ProtectedRoute element={<CalculateIncome />} />}
//             />
//             <Route
//               path="/settings/calculate-expense"
//               element={<ProtectedRoute element={<CalculateExpense />} />}
//             />
//             <Route
//               path="/settings/setting"
//               element={<ProtectedRoute element={<Setting />} />}
//             />

//             {/* Default Route */}
//             <Route
//               path="/"
//               element={
//                 isAuthenticated ? (
//                   <Navigate to="/dashboard" replace />
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Vehicle from "./pages/Vehicle";
import Driver from "./pages/Drivers";
import Fuel from "./pages/Fuel";
import LoginPage from "./pages/LoginPage";
import Setting from "./pages/Setting/Setting";
import Maintenance from "./pages/Maintenance";
import Parts from "./pages/Parts";

import NewIncome from "./pages/sales/NewInvoice";
import ManageIncome from "./pages/sales/ManageInvoice";
import NewClient from "./pages/Clients/NewClients";
import ManageClients from "./pages/Clients/ManageClients";
import NewSupplier from "./pages/Suppliers/NewSupplier";
import ManageSuppliers from "./pages/Suppliers/ManageSupplier";
import ViewTransaction from "./pages/Transaction/ViewTransaction";
import NewTransaction from "./pages/Transaction/NewTransaction";
import Income from "./pages/Transaction/Income";
import Expense from "./pages/Transaction/Expense";
import CustomerStatement from "./pages/Report/CustomerStatement";
import SupplierStatement from "./pages/Report/SupplierStatement";
import CalculateIncome from "./pages/Setting/CalculateIncome";
import CalculateExpense from "./pages/Setting/CalculateExpemse";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [invoices, setInvoices] = useState([]); // State for invoices

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const addInvoice = (invoice) => {
    setInvoices((prevInvoices) => [
      ...prevInvoices,
      { id: prevInvoices.length + 1, ...invoice },
    ]);
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={<Dashboard onLogout={handleLogout} />}
                />
              }
            />

            {/* Fleet Management Routes */}
            <Route
              path="/vehicle"
              element={<ProtectedRoute element={<Vehicle />} />}
            />
            <Route
              path="/driver"
              element={<ProtectedRoute element={<Driver />} />}
            />
            <Route
              path="/maintenance"
              element={<ProtectedRoute element={<Maintenance />} />}
            />
            <Route
              path="/fuel"
              element={<ProtectedRoute element={<Fuel />} />}
            />
            <Route
              path="/parts"
              element={<ProtectedRoute element={<Parts />} />}
            />

            {/* Sales Routes */}
            <Route
              path="/sales/new-income"
              element={
                <ProtectedRoute
                  element={
                    <NewIncome addInvoice={addInvoice} invoices={invoices} />
                  }
                />
              }
            />
            <Route
              path="/sales/manage-income"
              element={
                <ProtectedRoute
                  element={<ManageIncome invoices={invoices} />}
                />
              }
            />

            {/* Clients Routes */}
            <Route
              path="/clients/new-client"
              element={<ProtectedRoute element={<NewClient />} />}
            />
            <Route
              path="/clients/manage-clients"
              element={<ProtectedRoute element={<ManageClients />} />}
            />

            {/* Suppliers Routes */}
            <Route
              path="/suppliers/new-supplier"
              element={<ProtectedRoute element={<NewSupplier />} />}
            />
            <Route
              path="/suppliers/manage-suppliers"
              element={<ProtectedRoute element={<ManageSuppliers />} />}
            />

            {/* Transactions Routes */}
            <Route
              path="/transactions/view"
              element={<ProtectedRoute element={<ViewTransaction />} />}
            />
            <Route
              path="/transactions/new"
              element={<ProtectedRoute element={<NewTransaction />} />}
            />
            <Route
              path="/transactions/income"
              element={<ProtectedRoute element={<Income />} />}
            />
            <Route
              path="/transactions/expense"
              element={<ProtectedRoute element={<Expense />} />}
            />

            {/* Reports Routes */}
            <Route
              path="/reports/customer-statement"
              element={<ProtectedRoute element={<CustomerStatement />} />}
            />
            <Route
              path="/reports/supplier-statement"
              element={<ProtectedRoute element={<SupplierStatement />} />}
            />

            {/* Settings Routes */}
            <Route
              path="/settings/calculate-income"
              element={<ProtectedRoute element={<CalculateIncome />} />}
            />
            <Route
              path="/settings/calculate-expense"
              element={<ProtectedRoute element={<CalculateExpense />} />}
            />
            <Route
              path="/settings/setting"
              element={<ProtectedRoute element={<Setting />} />}
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
