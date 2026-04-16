import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setLogin, setLoading } from "../store/slices/authSlice";
import { loginApi } from "../services/authService";
import { APP_MESSAGES } from "../constants/messages";
import CustomButton from "../components/common/CustomButton";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  dispatch(setLoading(true));

  try {
    const data = await loginApi(credentials);
    console.log("Login Response Data:", data); // Check karein token kahan hai

    // Pura 'data' pass karein taaki token aur user dono mil sakein
    if (data && (data.token || data.auth)) {
     dispatch(setLogin(data));
      toast.success("Login Successful!");

      // Navigate ko thoda delay dein taaki Redux update ho jaye
      setTimeout(() => {
        navigate("/admin");
      }, 100);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid Email or Password");
  } finally {
    dispatch(setLoading(false));
  }
};

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
        {/* Header Section */}
        <div className="login-header p-4 text-center border-0">
          <h2 className="text-black fw-bold m-0 ls-2">
            MY<span className="text-black">UMA</span>
          </h2>
          <p className="text-black-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
        </div>

        {/* Body Section */}
        <div className="p-4 bg-white border-0">
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom"
                placeholder="name@example.com"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-2">
              <label className="form-label small fw-bold text-uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control form-control-custom"
                placeholder="••••••••"
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-end mb-4">
              <Link
                to="/forgot-password"
                title="Reset Password"
                className="text-decoration-none small fw-bold"
                style={{ color: "var(--navy)", fontSize: "12px" }}>
                Forgot Password?
              </Link>
            </div>

            {/* Integrated CustomButton */}
            <CustomButton
              type="submit"
              loading={loading}
              variant="gold"
              className="w-100 shadow-sm">
              SIGN IN
            </CustomButton>
          </form>
          <div className="text-center mt-3 border-top pt-3">
            <p className="text-muted mb-0 fw-bold" style={{ fontSize: "10px" }}>
              POWERED BY MYUMA REAL ESTATE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;