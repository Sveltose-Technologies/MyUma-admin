import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
const menu = [
  { name: "Dashboard", path: "/admin", icon: "bi-speedometer2" },

  { name: "Home", path: "/admin/home", icon: "bi-house-door-fill" },

  { name: "About Us", path: "/admin/about-us", icon: "bi-info-circle-fill" },

  { name: "User List", path: "/admin/user", icon: "bi-people-fill" },

  { name: "Owner List", path: "/admin/owner", icon: "bi-person-badge-fill" },

  { name: "Categories", path: "/admin/categories", icon: "bi-tags-fill" },

  {
    name: "Sub-Categories",
    path: "/admin/sub-categories",
    icon: "bi-diagram-3-fill",
  },

  {
    name: "New Listings",
    path: "/admin/listings",
    icon: "bi-buildings-fill",
  },

  { name: "Blogs", path: "/admin/blogs", icon: "bi-journal-richtext" },

  {
    name: "Blog Categories",
    path: "/admin/blog-categories",
    icon: "bi-bookmarks-fill",
  },

  {
    name: "Bookmarks",
    path: "/admin/bookmarks",
    icon: "bi-calendar2-check-fill",
  },

  { name: "Reviews", path: "/admin/rating", icon: "bi-star-fill" },

  {
    name: "Pricing",
    path: "/admin/pricing",
    icon: "bi-cash-stack",
  },
  {
    name: "Memberships ",
    path: "/admin/payments",
    icon: "bi-credit-card-fill",
  },
  {
    name: "Inquiries",
    path: "/admin/inquiries",
    icon: "bi-envelope-fill",
  },

  {
    name: "Testimonials",
    path: "/admin/testimonials",
    icon: "bi-chat-quote-fill",
  },

  {
    name: "User Blog Comments",
    path: "/admin/blog-comments",
    icon: "bi-chat-dots-fill",
  },

  {
    name: "Favorites",
    path: "/admin/favorites",
    icon: "bi-heart-fill",
  },

  {
    name: "ContactUs",
    path: "/admin/contact-us",
    icon: "bi-telephone-fill",
  },

  {
    name: "Messages",
    path: "/admin/messages",
    icon: "bi-send-fill",
  },

  {
    name: "Footer Text",
    path: "/admin/footer-text",
    icon: "bi-file-earmark-text-fill",
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
              onClick={onClose}
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
