import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtpApi } from "../services/authService";
import { setLoading, setLogin } from "../store/slices/authSlice";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { tempEmail, loading, isAuthenticated } = useSelector((state) => state.auth);
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
        <div className="login-header p-4 text-center border-0">
          <h2 className="text-white fw-bold m-0 ls-2">MY<span className="text-gold">UMA</span></h2>
          <p className="text-white-50 small mb-0 mt-1 fw-bold">OTP VERIFICATION</p>
        </div>

        <div className="p-4 bg-white border-0">
          <div className="text-center mb-4">
            <h5 className="fw-bold m-0" style={{ color: "var(--navy)" }}>Security Check</h5>
            <p className="text-muted small">Enter the code sent to <b>{tempEmail}</b></p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <input type="text" className="form-control form-control-custom text-center fw-bold fs-4" 
                placeholder="000000" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required disabled={loading} />
            </div>
            <button type="submit" className="btn-gold w-100 py-2 shadow-sm" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "VERIFY & LOGIN"}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <button onClick={() => navigate("/login")} className="btn btn-link btn-sm text-decoration-none text-muted fw-bold">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;