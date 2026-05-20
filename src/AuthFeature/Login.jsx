// // import React, { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate, Link } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import { setLogin, setLoading } from "../store/slices/authSlice";
// // import { loginApi } from "../services/authService";
// // import { APP_MESSAGES } from "../constants/messages";
// // import CustomButton from "../components/common/CustomButton";

// // const Login = () => {
// //   const [credentials, setCredentials] = useState({ email: "", password: "" });
// //   const { loading, isAuthenticated } = useSelector((state) => state.auth);

// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (isAuthenticated) {
// //       navigate("/admin");
// //     }
// //   }, [isAuthenticated, navigate]);

// //   const handleChange = (e) => {
// //     setCredentials({ ...credentials, [e.target.name]: e.target.value });
// //   };

// // const handleLogin = async (e) => {
// //   e.preventDefault();
// //   dispatch(setLoading(true));
// //   try {
// //     const response = await loginApi(credentials);

// //     // Check if the response contains user data (auth)
// //     if (response && response.auth) {
// //       // We pass the whole response to setLogin
// //       dispatch(setLogin(response));

// //       toast.success("Login Successful!");
// //       navigate("/admin");
// //     } else {
// //       toast.error("Login failed: User data missing in response");
// //     }
// //   } catch (error) {
// //     toast.error(error.response?.data?.message || "Invalid Email or Password");
// //   } finally {
// //     dispatch(setLoading(false));
// //   }
// // };

// //   return (
// //     <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
// //       <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
// //         {/* Header Section */}
// //         <div className="login-header p-4 text-center border-0">
// //           <h2 className="text-black fw-bold m-0 ls-2">
// //             MY<span className="text-black">UMA</span>
// //           </h2>
// //           <p className="text-black-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
// //         </div>

// //         {/* Body Section */}
// //         <div className="p-4 bg-white border-0">

// //           <form onSubmit={handleLogin}>
// //             <div className="mb-3">
// //               <label className="form-label small fw-bold text-uppercase mb-1">
// //                 Email
// //               </label>
// //               <input
// //                 type="email"
// //                 name="email"
// //                 className="form-control form-control-custom"
// //                 placeholder="name@example.com"
// //                 onChange={handleChange}
// //                 required
// //                 disabled={loading}
// //               />
// //             </div>

// //             <div className="mb-2">
// //               <label className="form-label small fw-bold text-uppercase mb-1">
// //                 Password
// //               </label>
// //               <input
// //                 type="password"
// //                 name="password"
// //                 className="form-control form-control-custom"
// //                 placeholder="••••••••"
// //                 onChange={handleChange}
// //                 required
// //                 disabled={loading}
// //               />
// //             </div>

// //             {/* Forgot Password Link */}
// //             <div className="text-end mb-4">
// //               <Link
// //                 to="/forgot-password"
// //                 title="Reset Password"
// //                 className="text-decoration-none small fw-bold"
// //                 style={{ color: "var(--navy)", fontSize: "12px" }}>
// //                 Forgot Password?
// //               </Link>
// //             </div>

// //             {/* Integrated CustomButton */}
// //             <CustomButton
// //               type="submit"
// //               loading={loading}
// //               variant="gold"
// //               className="w-100 shadow-sm">
// //               SIGN IN
// //             </CustomButton>
// //           </form>
// //           <div className="text-center mt-3 border-top pt-3">
// //             <p className="text-muted mb-0 fw-bold" style={{ fontSize: "10px" }}>
// //               POWERED BY MYUMA REAL ESTATE
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { setLogin, setLoading } from "../store/slices/authSlice";
// import { loginApi } from "../services/authService";
// import { APP_MESSAGES } from "../constants/messages";
// import CustomButton from "../components/common/CustomButton";

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const { loading, isAuthenticated } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // --- SESSION MANAGEMENT LOGIC ---
//   const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

//   useEffect(() => {
//     // 1. Check for session expiry
//     const expiry = localStorage.getItem("sessionExpiry");
//     if (expiry && Date.now() > parseInt(expiry)) {
//       localStorage.clear();
//       sessionStorage.clear();
//       toast.warn("Session expired. Please login again.");
//       // The app will naturally stay on login because isAuthenticated will be false
//     }

//     // 2. Existing redirect logic
//     if (isAuthenticated) {
//       navigate("/admin");
//     }
//   }, [isAuthenticated, navigate]);

//   const startSession = () => {
//     const expiryTime = Date.now() + SESSION_DURATION;
//     localStorage.setItem("sessionExpiry", expiryTime.toString());
//   };
//   // --------------------------------

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     dispatch(setLoading(true));
//     try {
//       const response = await loginApi(credentials);

//       if (response && response.auth) {
//         // ✅ Set 24hr expiry timestamp
//         startSession();

//         dispatch(setLogin(response));
//         toast.success("Login Successful!");
//         navigate("/admin");
//       } else {
//         toast.error("Login failed: User data missing in response");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Invalid Email or Password");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };



//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   dispatch(setLoading(true));
//   //   try {
//   //     const response = await loginApi(credentials);

//   //     // Ye log aapko console mein dikhayega ki role sach mein aa raha hai ya nahi
//   //     console.log("Full Auth Object from API:", response?.auth);

//   //     if (response && response.auth) {
//   //       // Agar backend se role aa hi nahi raha, toh userRole undefined hoga
//   //       const userRole = response.auth.role
//   //         ? response.auth.role.trim().toLowerCase()
//   //         : null;

//   //       // Debugging: Agar role nahi mil raha toh alert dikhao
//   //       if (!userRole) {
//   //         toast.error(
//   //           "Error: Backend is not sending the 'role' field. Please check backend API.",
//   //         );
//   //         dispatch(setLoading(false));
//   //         return;
//   //       }

//   //       if (userRole !== "admin") {
//   //         toast.error(`Access Denied: Your role is '${userRole}', not admin.`);
//   //         dispatch(setLoading(false));
//   //         return;
//   //       }

//   //       startSession();
//   //       dispatch(setLogin(response));
//   //       toast.success("Admin Login Successful!");
//   //       navigate("/admin");
//   //     }
//   //   } catch (error) {
//   //     console.error("Login Error:", error);
//   //     toast.error(error.response?.data?.message || "Invalid Email or Password");
//   //   } finally {
//   //     dispatch(setLoading(false));
//   //   }
//   // };
//   return (
//     <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
//       <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0 overflow-hidden">
//         {/* Header Section */}
//         <div className="login-header p-4 text-center border-0">
//           <h2 className="text-black fw-bold m-0 ls-2">
//             MY<span className="text-black">UMA</span>
//           </h2>
//           <p className="text-black-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
//         </div>

//         {/* Body Section */}
//         <div className="p-4 bg-white border-0">
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

//             {/* Forgot Password Link */}
//             <div className="text-end mb-4">
//               <Link
//                 to="/forgot-password"
//                 title="Reset Password"
//                 className="text-decoration-none small fw-bold"
//                 style={{ color: "var(--navy)", fontSize: "12px" }}>
//                 Forgot Password?
//               </Link>
//             </div>

//             {/* Integrated CustomButton */}
//             <CustomButton
//               type="submit"
//               loading={loading}
//               variant="gold"
//               className="w-100 shadow-sm">
//               SIGN IN
//             </CustomButton>
//           </form>
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
import { toast } from "react-toastify";
import { setLogin, setLoading } from "../store/slices/authSlice";
import { loginApi } from "../services/authService";
import CustomButton from "../components/common/CustomButton";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SESSION_DURATION = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const expiry = localStorage.getItem("sessionExpiry");
    if (expiry && Date.now() > parseInt(expiry)) {
      localStorage.clear();
      toast.warn("Session expired. Please login again.");
    }
    if (isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await loginApi(credentials);
      const userData = response?.auth;

      // STRICT ROLE CHECK: Allow only Admin
      if (userData && userData.role === "admin") {
        const expiryTime = Date.now() + SESSION_DURATION;
        localStorage.setItem("sessionExpiry", expiryTime.toString());

        dispatch(setLogin(response));
        toast.success("Admin Login Successful!");
        navigate("/admin");
      } else {
        // Show "Auth Not Found" if role is user/owner to maintain security
        toast.error("Auth Not Found");
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 404 || status === 403) {
        toast.error("Auth Not Found");
      } else {
        toast.error(error.response?.data?.message || "Login Failed");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center login-screen">
      <div className="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3 login-card shadow-lg border-0">
        <div className="login-header p-4 text-center">
          <h2 className="text-black fw-bold m-0">MY<span className="text-black">UMA</span></h2>
          <p className="text-black-50 small mb-0 mt-1 fw-bold">ADMIN PORTAL</p>
        </div>
        <div className="p-4 bg-white">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-uppercase">Email</label>
              <input type="email" className="form-control" placeholder="admin@email.com" 
                onChange={(e) => setCredentials({...credentials, email: e.target.value})} required disabled={loading} />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase">Password</label>
              <input type="password" className="form-control" placeholder="••••••••" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} required disabled={loading} />
            </div>
            <div className="text-end mb-3">
              <Link to="/forgot-password" style={{ color: "var(--navy)", fontSize: "12px" }}>Forgot Password?</Link>
            </div>
            <CustomButton type="submit" loading={loading} variant="gold" className="w-100">SIGN IN</CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;