import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";
const initialState = {
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const payload = action.payload;
      const userData = payload?.auth;
      const token = payload?.auth?.token;

      if (userData && token) {
        state.user = userData;
        state.token = token;
        state.isAuthenticated = true;

        // Sync with Storage Utility
        storage.setToken(token);
        storage.setUser(userData);
      }
    },

    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      storage.clear();
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    updateUser: (state, action) => {
      if (state.user) {
        // Merge old user data with new data from API
        const updatedUser = { ...state.user, ...action.payload };
        state.user = updatedUser;

        // CRITICAL: Save merged data to LocalStorage
        storage.setUser(updatedUser);
        console.log("Profile updated in Redux and LocalStorage");
      }
    },
  },
});

export const { setLogin, setLogout, setLoading, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
