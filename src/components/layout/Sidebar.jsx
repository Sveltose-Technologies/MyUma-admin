
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menu = [
    { name: "Dashboard", path: "/admin", icon: "bi-grid-1x2-fill" },
     { name: "Home", path: "/admin/home", icon: "bi-house-fill" },
    { name: "Categories", path: "/admin/categories", icon: "bi-tags" },
   
  ];

  return (
    <div className={`sidebar ${isOpen ? "show" : ""}`} style={{ zIndex: 1060 }}>
      <div className="sidebar-logo d-flex justify-content-between align-items-center">
        <div className="fw-bold fs-3">
          My<span style={{ color: "var(--gold)" }}>Uma</span>
        </div>

        {/* Using CustomButton for Mobile Close */}
        <div className="d-md-none">
          <button
            className="btn text-white d-md-none border-0"
            onClick={onClose}>
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>
      </div>

      <div className="sidebar-nav mt-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`nav-link-item ${location.pathname === item.path ? "active" : ""}`}
            style={{ textDecoration: "none" }}>
            <i className={`${item.icon} me-3`}></i>
            <span className="fw-semibold">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;