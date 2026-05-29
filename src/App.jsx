import React from "react";
import { HashRouter } from "react-router-dom"; // 👈 BrowserRouter ki jagah HashRouter use karein
import AppRouter from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <HashRouter>
      {" "}
      {/* 👈 Change here */}
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </HashRouter>
  );
}
export default App;
