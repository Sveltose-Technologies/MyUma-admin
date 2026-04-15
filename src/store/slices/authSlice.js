import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("admin_user")) || null,
    token: storage.getToken() || null,
    isAuthenticated: !!storage.getToken(),
    loading: false,
    tempEmail: null, // Add this to store email for OTP/Reset flow
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      storage.setToken(action.payload.token);
      localStorage.setItem("admin_user", JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tempEmail = null;
      storage.clear();
      localStorage.removeItem("admin_user");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Add this missing export
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
  },
});

// Make sure setTempEmail is included here
export const { setLogin, setLogout, setLoading, setTempEmail } =
  authSlice.actions;
export default authSlice.reducer;
