import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./UserPage/Home";
import Medicines from "./UserPage/MedicinePage";
import Login from "./UserPage/Loginpage";
import AddMedicine from "./UserPage/AddMedicine";
import Inventory from "./UserPage/Inventory";
import Reports from "./UserPage/Reports";
import Sales from "./UserPage/Sales";
import AdminDashboard from "./AdminPage/AdminDashboard";
import ManageUsers from "./AdminPage/ManageUser";
import AdminAddMedicine from "./AdminPage/AddMedicine";
import ManageInventory from "./AdminPage/ManageInventory";
import AdminReports from "./AdminPage/Reports";
import NewSale from "./AdminPage/NewSale";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User pages */}
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<Sales />} />

        {/* Admin pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/inventory" element={<ManageInventory />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/sales" element={<NewSale />} />
        <Route path="/admin/add-medicine" element={<AdminAddMedicine />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
