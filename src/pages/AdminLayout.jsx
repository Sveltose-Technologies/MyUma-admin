import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import AdminNavbar from "../components/layout/AdminNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout d-flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-wrapper flex-grow-1">
        <AdminNavbar onToggle={() => setIsSidebarOpen(true)} />
        <div className="p-4 pt-2">
          <Outlet />
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="modal-backdrop fade show d-md-none"
          onClick={() => setIsSidebarOpen(false)}
          style={{ zIndex: 1050, cursor: "pointer", opacity: 0.5 }}></div>
      )}
    </div>
  );
};
export default AdminLayout;
