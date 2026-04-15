// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { setLogin, setLoading } from "../store/slices/authSlice";
// import { loginApi } from "../services/authService";
// import { APP_MESSAGES } from "../constants/messages";

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const { loading, isAuthenticated } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/admin");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     dispatch(setLoading(true));

//     try {
//       const data = await loginApi(credentials);
//       if (data && data.auth) {
//         dispatch(setLogin(data.auth));
//         toast.success(data.message || APP_MESSAGES.LOGIN_SUCCESS);
//         navigate("/admin");
//       } else {
//         toast.error("Invalid response from server");
//       }
//     } catch (error) {
//       toast.error(error.message || "Invalid Email or Password");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   return (
//     <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
//       <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
//         {/* Header Section */}
//         <div className="login-header p-4 text-center border-0">
//           <h2 className="text-white fw-bold m-0 ls-2">
//             MY<span className="text-gold">UMA</span>
//           </h2>
//           <p className="text-white-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
//         </div>

//         {/* Body Section */}
//         <div className="p-4 bg-white border-0">
//           <div className="text-center mb-4">
//             <h5 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
//               Sign In
//             </h5>
//             <p className="text-muted small">
//               Enter your credentials to continue
//             </p>
//           </div>

//           <form onSubmit={handleLogin}>
//             <div className="mb-3">
//               <label className="form-label small fw-bold text-uppercase mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 className="form-control form-control-custom"
//                 placeholder="name@example.com"
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div className="mb-2">
//               <label className="form-label small fw-bold text-uppercase mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 className="form-control form-control-custom"
//                 placeholder="••••••••"
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Forgot Password Link - Displayed on Login Page */}
//             <div className="text-end mb-4">
//               <Link
//                 to="/forgot-password"
//                 title="Reset Password"
//                 className="text-decoration-none small fw-bold"
//                 style={{ color: "var(--navy)", fontSize: "12px" }}>
//                 Forgot Password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               className="btn-gold w-100 py-2 shadow-sm d-flex align-items-center justify-content-center"
//               disabled={loading}>
//               {loading ? (
//                 <span className="spinner-border spinner-border-sm me-2"></span>
//               ) : (
//                 "SIGN IN"
//               )}
//             </button>
//           </form>

//           {/* Additional Links for OTP or Signup Verification */}
//           <div className="text-center mt-4">
//             <p className="small text-muted mb-0">
//               Need to verify your account?{" "}
//               <Link
//                 to="/verify-otp"
//                 className="text-decoration-none fw-bold"
//                 style={{ color: "var(--gold)" }}>
//                 Verify OTP
//               </Link>
//             </p>
//           </div>

//           <div className="text-center mt-3 border-top pt-3">
//             <p className="text-muted mb-0 fw-bold" style={{ fontSize: "10px" }}>
//               POWERED BY MYUMA REAL ESTATE
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setLogin } from "../store/slices/authSlice";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Agar user already logged in hai to dashboard bhej do
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Static User Data (Bina API ke)
    const mockData = {
      fullName: "Admin User",
      email: credentials.email,
      token: "fake-jwt-token-for-demo",
      role: "admin",
    };

    // Redux state update karo aur dashboard par bhej do
    dispatch(setLogin(mockData));
    navigate("/admin");
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
                placeholder="admin@myuma.com"
                onChange={handleChange}
                required
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
              />
            </div>

            <div className="text-end mb-4">
              <Link
                to="/forgot-password"
                className="text-decoration-none small fw-bold"
                style={{ color: "var(--navy)", fontSize: "12px" }}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-gold w-100 py-2 shadow-sm fw-bold">
              LOGIN
            </button>
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