import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../services/authService";
import { setLoading, setTempEmail } from "../store/slices/authSlice";
import CustomButton from "../components/common/CustomButton";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Timer States
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Timer Logic for Step 2
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- STEP 1: Request OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      // FIX: Sending both email AND role as required by your table
      await forgotPasswordApi({ email, role: "admin" });
      dispatch(setTempEmail(email));
      toast.success("OTP sent to your email");
      setTimer(30);
      setCanResend(false);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "User not found");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // --- RESEND OTP LOGIC ---
  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      await forgotPasswordApi({ email, role: "admin" });
      toast.success("OTP Resent successfully");
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  // --- STEP 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      await verifyOtpApi({ email, otp });
      toast.success("OTP Verified Successfully");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP Code");
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
      // payload: email, otp, newPassword, confirmPassword (from your table)
      await resetPasswordApi({
        email,
        otp,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
      toast.success("Password updated! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to update password");
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
          {/* STEP 1: EMAIL INPUT */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <div className="text-center mb-4">
                <h5 className="fw-bold" style={{ color: "var(--navy)" }}>
                  Forgot Password?
                </h5>
                <p className="text-muted small">
                  Enter your email to receive a reset code.
                </p>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  className="form-control form-control-custom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@myuma.net"
                />
              </div>
              <CustomButton
                type="submit"
                loading={loading}
                variant="gold"
                className="w-100">
                SEND RESET CODE
              </CustomButton>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="text-center mb-4">
                <h5 className="fw-bold" style={{ color: "var(--navy)" }}>
                  Verify Code
                </h5>
                <p className="text-muted small">
                  Enter the 6-digit code sent to <br /> <strong>{email}</strong>
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
                variant="gold"
                className="w-100">
                VERIFY CODE
              </CustomButton>

              <div className="text-center mt-3">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="btn btn-link btn-sm fw-bold text-gold text-decoration-none">
                    Resend Code Now
                  </button>
                ) : (
                  <p className="small text-muted">
                    Resend in{" "}
                    <span className="text-dark fw-bold">{timer}s</span>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="text-center mb-4">
                <h5 className="fw-bold" style={{ color: "var(--navy)" }}>
                  New Password
                </h5>
                <p className="text-muted small">
                  Create a strong password for your account.
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
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
                variant="gold"
                className="w-100">
                UPDATE PASSWORD
              </CustomButton>
            </form>
          )}

          <div className="text-center mt-3 pt-3 border-top">
            <Link
              to="/login"
              className="text-decoration-none small fw-bold text-muted">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
