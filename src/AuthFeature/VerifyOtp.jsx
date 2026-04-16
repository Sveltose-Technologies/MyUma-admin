import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtpApi } from "../services/authService";
import { setLoading, setLogin } from "../store/slices/authSlice";
import CustomButton from "../components/common/CustomButton";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { tempEmail, loading, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Security: If no email in state, user shouldn't be here
  useEffect(() => {
    if (isAuthenticated) navigate("/admin");
    if (!tempEmail && !isAuthenticated) navigate("/login");
  }, [tempEmail, isAuthenticated, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const data = await verifyOtpApi({ email: tempEmail, otp });

      // Verification success: Now we set the official Login state
      if (data && data.auth) {
        dispatch(setLogin(data.auth));
        toast.success("Verification Successful! Welcome to Dashboard.");
        navigate("/admin");
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      toast.error(error.message || "Invalid OTP Code");
    } finally {
      dispatch(setLoading(false));
    }
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
              Security Check
            </h5>
            <p className="text-muted small">
              Enter the code sent to <br />
              <strong className="text-dark">{tempEmail || "your email"}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase mb-1 d-block text-center">
                OTP Code
              </label>
              <input
                type="text"
                className="form-control form-control-custom text-center fw-bold fs-4"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
                style={{ letterSpacing: "8px" }}
              />
            </div>

            {/* Using CustomButton */}
            <CustomButton
              type="submit"
              loading={loading}
              variant="gold"
              className="w-100 shadow-sm">
              VERIFY & LOGIN
            </CustomButton>
          </form>

          <div className="text-center mt-3">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-link btn-sm text-decoration-none text-muted fw-bold p-0"
              style={{ fontSize: "12px" }}
              disabled={loading}>
              ← Back to Login
            </button>
          </div>

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

export default VerifyOtp;
