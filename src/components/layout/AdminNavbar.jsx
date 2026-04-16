import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { useNavigate, Link } from "react-router-dom";
import { setLogout } from "../../store/slices/authSlice";
import { useUtils } from "../../hook/useUtils"; // Import your utility hook

const AdminNavbar = ({ onToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get dynamic user data from Redux
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getImgURL } = useUtils(); // Initialize image utility

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

  // Logic to handle avatar fallback (first letter of name)
  const avatarLetter = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "A";

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
            {/* Dynamic Full Name */}
            <p className="m-0 fw-bold small text-navy">
              {user?.fullName || "Admin User"}
            </p>
            {/* Dynamic Role */}
            <p
              className="m-0 text-muted text-uppercase"
              style={{ fontSize: "11px", fontWeight: "600" }}>
              {user?.role || "Staff"}
            </p>
          </div>

          <div className="profile-circle shadow-sm position-relative overflow-hidden bg-gold d-flex align-items-center justify-content-center text-navy fw-bold">
            {/* Dynamic Image logic */}
            {user?.profileImage ? (
              <img
                src={getImgURL(user.profileImage)}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }} // Hide broken images
              />
            ) : (
              <span>{avatarLetter}</span>
            )}

            <span
              className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"
              style={{ zIndex: 2 }}></span>
          </div>
        </div>

        {showDropdown && (
          <div
            className="dropdown-profile-menu shadow-lg animate-fade-in"
            style={{ right: 0 }}>
            <div className="dropdown-header-custom p-3 border-bottom">
              <p className="m-0 fw-bold small text-navy">Manage Account</p>
              <p
                className="text-muted extra-small mb-0"
                style={{ fontSize: "10px" }}>
                {user?.email}
              </p>
            </div>

            <Link
              to="/admin/edit-profile"
              className="dropdown-item-custom"
              onClick={() => setShowDropdown(false)}>
              <i className="bi bi-person me-2"></i> Edit Profile
            </Link>

            <hr className="dropdown-divider m-0" />

            <button
              onClick={handleLogout}
              className="dropdown-item-custom text-danger fw-bold border-0 bg-transparent w-100 text-start">
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
