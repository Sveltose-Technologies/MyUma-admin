import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";

const initialState = {
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  loading: false,
  tempEmail: sessionStorage.getItem("temp_email") || null, // READ HERE
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Inside authSlice.js

    setLogin: (state, action) => {
      const payload = action.payload;
      // Make sure we extract the user correctly based on your API structure
      const userData = payload?.auth || payload?.user || payload;
      const token = payload?.token || payload?.auth?.token;

      if (userData && token) {
        state.user = userData;
        state.token = token;
        state.isAuthenticated = true;

        // Debugging: Log this to see if profileImage exists here
        console.log("User data at login:", userData);

        storage.setToken(token);
        storage.setUser(userData);
      }
    },

    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.tempEmail = null; // Clear on logout
      storage.clear();
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
      // Save to session storage so it survives page refresh
      if (action.payload) sessionStorage.setItem("temp_email", action.payload);
    },

    // src/store/slices/authSlice.js
    updateUser: (state, action) => {
      if (state.user) {
        // Merge existing user data with new data (like the profile image)
        const updatedUser = { ...state.user, ...action.payload };
        state.user = updatedUser;
        storage.setUser(updatedUser); // Save to LocalStorage
      } else {
        // If for some reason user was null, set it
        state.user = action.payload;
        storage.setUser(action.payload);
      }
    },
  },
});

// 3. CRITICAL: Add 'setTempEmail' to this export list
export const { setLogin, setLogout, setLoading, updateUser, setTempEmail } =
  authSlice.actions;

export default authSlice.reducer;
