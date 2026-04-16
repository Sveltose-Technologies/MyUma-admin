//src/commom/customButton.jsx
import React from "react";

const CustomButton = ({
  type = "button",
  onClick,
  loading = false,
  variant = "gold", // "gold" or "cancel"
  children,
  className = "",
  disabled = false,
}) => {
  const commonStyles = {
    padding: "12px 25px", 
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    height: "50px", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    border: "none",
  };

  const variantStyles =
    variant === "gold"
      ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
      : { backgroundColor: "#e2e8f0", color: "var(--navy)" }; 

  return (
    <button
      type={type}
      className={`border-0 ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ ...commonStyles, ...variantStyles }}>
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"></span>
          Saving...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
