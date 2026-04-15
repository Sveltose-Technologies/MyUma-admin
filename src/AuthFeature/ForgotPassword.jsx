import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPasswordApi } from "../services/authService";
import { setLoading, setTempEmail } from "../store/slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const data = await forgotPasswordApi(email);
      dispatch(setTempEmail(email));
      toast.success("Reset link or OTP sent to your email");
      navigate("/reset-password"); // Or verify-otp based on your backend flow
    } catch (error) {
      toast.error(error.message || "Failed to process request");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
        <div className="login-header p-4 text-center border-0">
          <h3 className="text-white fw-bold m-0 ls-2">
            MY<span className="text-gold">UMA</span>
          </h3>
        </div>
        <div className="p-4 bg-white">
          <h5 className="fw-bold text-center mb-3">Forgot Password?</h5>
          <p className="text-muted small text-center mb-4">
            Enter your email to receive a reset link.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="form-control form-control-custom"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-gold w-100 mb-3"
              disabled={loading}>
              {loading ? "Sending..." : "SEND RESET LINK"}
            </button>
            <div className="text-center">
              <Link
                to="/login"
                className="text-decoration-none small fw-bold"
                style={{ color: "var(--navy)" }}>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
