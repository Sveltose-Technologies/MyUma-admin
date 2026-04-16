import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../services/authService";
import { setLoading } from "../store/slices/authSlice";
import CustomButton from "../components/common/CustomButton";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- STEP 1: Request OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      await forgotPasswordApi(email);
      toast.success("OTP sent to your email");
      setStep(2); // Move to OTP step
    } catch (error) {
      toast.error(error.message || "Email not found");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // --- STEP 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      // Note: Some backends verify OTP and return a token,
      // others just validate it before the reset call.
      await verifyOtpApi({ email, otp });
      toast.success("OTP Verified");
      setStep(3); // Move to Reset step
    } catch (error) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // --- STEP 3: Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    dispatch(setLoading(true));
    try {
      await resetPasswordApi({ email, otp, ...passwords });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
        <div className="login-header p-4 text-center border-0">
          <h2 className="text-black fw-bold m-0 ls-2">
            MY<span className="text-black">UMA</span>
          </h2>
          <p className="text-black-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
        </div>

        <div className="p-4 bg-white">
          {/* STEP 1 UI: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <div className="text-center mb-4">
                <h5 className="fw-bold" style={{ color: "var(--navy)" }}>
                  Forgot Password?
                </h5>
                <p className="text-muted small">
                  Enter email to receive a verification code.
                </p>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-custom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@email.com"
                />
              </div>
              <CustomButton
                type="submit"
                loading={loading}
                className="w-100 mb-3">
                SEND OTP
              </CustomButton>
            </form>
          )}

          {/* STEP 2 UI: OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="text-center mb-4">
                <h5 className="fw-bold" style={{ color: "var(--navy)" }}>
                  Verify OTP
                </h5>
                <p className="text-muted small">
                  Enter the 6-digit code sent to <br />
                  <b>{email}</b>
                </p>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control form-control-custom text-center fw-bold fs-4"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="000000"
                  style={{ letterSpacing: "8px" }}
                />
              </div>
              <CustomButton
                type="submit"
                loading={loading}
                className="w-100 mb-3">
                VERIFY CODE
              </CustomButton>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-link btn-sm w-100 text-muted text-decoration-none">
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3 UI: RESET PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="text-center mb-4">
                <h5 className="fw-bold" style={{ color: "var(--navy)" }}>
                  New Password
                </h5>
                <p className="text-muted small">
                  Please set your new secure password.
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">NEW PASSWORD</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control form-control-custom"
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-custom"
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="••••••••"
                />
              </div>
              <CustomButton
                type="submit"
                loading={loading}
                className="w-100 mb-3">
                UPDATE PASSWORD
              </CustomButton>
            </form>
          )}

          <div className="text-center mt-2">
            <Link
              to="/login"
              className="text-decoration-none small fw-bold"
              style={{ color: "var(--navy)" }}>
              Back to Login
            </Link>
          </div>

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

export default ForgotPassword;
