import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";

const initialState = {
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  loading: false,
  // 1. Added tempEmail to state to store email during password reset steps
  tempEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const payload = action.payload;
      const userData = payload?.auth || payload;
      const token = payload?.token || payload?.auth?.token;

      if (userData && token) {
        state.user = userData;
        state.token = token;
        state.isAuthenticated = true;
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

    // 2. Add the setTempEmail reducer logic here
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },

    updateUser: (state, action) => {
      if (state.user) {
        const updatedUser = { ...state.user, ...action.payload };
        state.user = updatedUser;
        storage.setUser(updatedUser);
      }
    },
  },
});

// 3. CRITICAL: Add 'setTempEmail' to this export list
export const { setLogin, setLogout, setLoading, updateUser, setTempEmail } =
  authSlice.actions;

export default authSlice.reducer;
