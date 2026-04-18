import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menu = [
    { name: "Dashboard", path: "/admin", icon: "bi-grid-1x2-fill" },
    { name: "Home", path: "/admin/home", icon: "bi-house-fill" },
    { name: "Categories", path: "/admin/categories", icon: "bi-tags" },
    { name: "New Listings", path: "/admin/listings", icon: "bi-building-add" },
    { name: "Blogs", path: "/admin/blogs", icon: "bi-newspaper" },
    {
      name: "Blog Categories",
      path: "/admin/blog-categories",
      icon: "bi-collection",
    },
    { name: "About Us", path: "/admin/about-us", icon: "bi-info-circle" },
    { name: "Comments", path: "/admin/comments", icon: "bi-chat-dots" },

    { name: "Pricing", path: "/admin/pricing", icon: "bi-currency-dollar" },

    {
      name: "Legal Docs",
      path: "/admin/legal-docs",
      icon: "bi-file-earmark-lock",
    },
  ];

  return (
    <>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <div
        className={`sidebar ${isOpen ? "show" : ""} d-flex flex-column`}
        style={{ zIndex: 1060 }}>
        <div className="sidebar-logo d-flex justify-content-between align-items-center flex-shrink-0">
          <div className="fw-bold fs-3 text-white">
            My<span style={{ color: "var(--gold)" }}>Uma</span>
          </div>
          <button
            className="btn text-white d-md-none border-0"
            onClick={onClose}>
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>

        <div className="sidebar-nav flex-grow-1 overflow-auto hide-scrollbar pb-5">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose} // Mobile par click karte hi sidebar close hoga
              className={`nav-link-item ${location.pathname === item.path ? "active" : ""}`}
              style={{ textDecoration: "none" }}>
              <i className={item.icon}></i>
              <span className="fw-semibold">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
