import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { adminRoutes } from "./adminRoutes"; // Import the array

import Login from "../AuthFeature/Login";
import VerifyOtp from "../AuthFeature/VerifyOtp"; 
import ForgotPassword from "../AuthFeature/ForgotPassword";
import ResetPassword from "../AuthFeature/ResetPassword";
import AdminLayout from "../pages/AdminLayout";

const AppRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<div className="text-center mt-5 p-5">Loading...</div>}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />
          }>
          {/* We loop through adminRoutes array to register sub-pages like Logo */}
          {adminRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
              index={route.path === ""} // This makes Dashboard the default
            />
          ))}
        </Route>

        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
