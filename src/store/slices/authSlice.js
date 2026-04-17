import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("admin_user")) || null,
    token: storage.getToken() || null,
    isAuthenticated: !!storage.getToken(),
    loading: false,
  },
  reducers: {
    setLogin: (state, action) => {
      const payload = action.payload;

      // Console ke mutabik data 'auth' key ke andar hai
      const userData = payload.auth;
      const token = payload.auth?.token;

      console.log("Saving User:", userData);
      console.log("Saving Token:", token);

      state.user = userData;

      if (token && token !== "undefined") {
        state.token = token;
        state.isAuthenticated = true;
        storage.setToken(token); // Yeh line localStorage mein save karegi
      }

      // User data ko save karein
      localStorage.setItem("admin_user", JSON.stringify(userData));
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      storage.clear();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLogin, setLogout, setLoading } = authSlice.actions;
export default authSlice.reducer;
