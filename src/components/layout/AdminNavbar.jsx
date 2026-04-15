import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setLogout } from "../../store/slices/authSlice";

const AdminNavbar = ({ onToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div className="top-navbar">
      <div className="d-flex align-items-center">
        {/* HAMBURGER TOGGLE BUTTON */}
        <button
          className="btn btn-gold d-md-none me-3 border shadow-sm"
          onClick={onToggle}>
          <i className="bi bi-list fs-4"></i>
        </button>

        <h4 className="m-0 fw-bold" style={{ color: "var(--navy)" }}>
          Admin
        </h4>
      </div>

      <div
        className="d-flex align-items-center position-relative"
        ref={dropdownRef}>
        <div
          className="d-flex align-items-center cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ cursor: "pointer" }}>
          <div className="text-end me-3 d-none d-sm-block">
            <p className="m-0 fw-bold small text-navy">Raj</p>
            <p className="m-0 text-muted" style={{ fontSize: "11px" }}>
              Super Admin
            </p>
          </div>

          <div className="profile-circle shadow-sm position-relative">
            R
            <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"></span>
          </div>
        </div>

        {showDropdown && (
          <div
            className="dropdown-profile-menu shadow-lg animate-fade-in"
            style={{ right: 0 }}>
            <div className="dropdown-header-custom p-3 border-bottom">
              <p className="m-0 fw-bold small">Manage Account</p>
            </div>
            <Link to="/admin/profile" className="dropdown-item-custom">
              <i className="bi bi-person me-2"></i> Edit Profile
            </Link>
            <hr className="dropdown-divider m-0" />
            <button
              onClick={handleLogout}
              className="dropdown-item-custom text-danger fw-bold">
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
