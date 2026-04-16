import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../services/authService";
import { setLoading } from "../store/slices/authSlice";
import CustomButton from "../components/common/CustomButton";
const ResetPassword = () => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const { tempEmail, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    dispatch(setLoading(true));
    try {
      await resetPasswordApi({ email: tempEmail, ...form });
      toast.success("Password updated! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
        {/* Consistent Header Section */}
        <div className="login-header p-4 text-center border-0">
          <h2 className="text-black fw-bold m-0 ls-2">
            MY<span className="text-black">UMA</span>
          </h2>
          <p className="text-black-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
        </div>

        <div className="p-4 bg-white border-0">
          <div className="text-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
              Reset Password
            </h5>
            <p className="text-muted small">
              Set a new secure password for your account
            </p>
          </div>

          <form onSubmit={handleReset}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                className="form-control form-control-custom"
                placeholder="••••••••"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control form-control-custom"
                placeholder="••••••••"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Using CustomButton */}
            <CustomButton
              type="submit"
              loading={loading}
              variant="gold"
              className="w-100 shadow-sm">
              UPDATE PASSWORD
            </CustomButton>
          </form>

          {/* Consistent Footer Section */}
          <div className="text-center mt-4 border-top pt-3">
            <p className="text-muted mb-0 fw-bold" style={{ fontSize: "10px" }}>
              POWERED BY MYUMA REAL ESTATE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
