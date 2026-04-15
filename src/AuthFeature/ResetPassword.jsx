import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../services/authService";
import { setLoading } from "../store/slices/authSlice";

const ResetPassword = () => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const { tempEmail, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");
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

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0">
        <div className="login-header p-4 text-center border-0">
          <h3 className="text-white fw-bold m-0 ls-2">
            MY<span className="text-gold">UMA</span>
          </h3>
        </div>
        <div className="p-4 bg-white">
          <h5 className="fw-bold text-center mb-4">Reset Password</h5>
          <form onSubmit={handleReset}>
            <div className="mb-3">
              <label className="form-label small fw-bold">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control form-control-custom"
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control form-control-custom"
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="btn-gold w-100" disabled={loading}>
              {loading ? "Updating..." : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
