import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menu = [
    { name: "Dashboard", path: "/admin", icon: "bi-grid-1x2-fill" },
    { name: "Home", path: "/admin/home", icon: "bi-house-fill" },
    { name: "Categories", path: "/admin/categories", icon: "bi-tags" },
    { name: "Blogs", path: "/admin/blogs", icon: "bi-newspaper" },
    {
      name: "Blog Categories",
      path: "/admin/blog-categories",
      icon: "bi-collection",
    },
   
    { name: "About Us", path: "/admin/about-us", icon: "bi-info-circle" },
    {
      name: "Legal Docs",
      path: "/admin/legal-docs",
      icon: "bi-file-earmark-lock",
    },
    
  ];

  return (
    <>
     
   

      <div className={`sidebar ${isOpen ? "show" : ""} d-flex flex-column`}>
        {/* 1. Logo Section (Fixed) */}
        <div className="sidebar-logo d-flex justify-content-between align-items-center flex-shrink-0">
          <div className="fw-bold fs-3 text-white">
            My<span style={{ color: "var(--gold)" }}>Uma</span>
          </div>
          <div className="d-md-none">
            <button className="btn text-white border-0" onClick={onClose}>
              <i className="bi bi-x-lg fs-4"></i>
            </button>
          </div>
        </div>

        {/* 2. Scrollable Navigation Area */}
  
        <div className="sidebar-nav flex-grow-1 overflow-auto hide-scrollbar pb-5">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`nav-link-item ${location.pathname === item.path ? "active" : ""}`}
              style={{ textDecoration: "none" }}>
              <i className={`${item.icon}`}></i>
              <span className="fw-semibold">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
