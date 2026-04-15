import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes"; // Upar wala file
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
export default App;
