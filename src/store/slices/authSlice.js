import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper function: LocalStorage se user nikalne ke liye
 * Next.js ya SSR environment mein error se bachne ke liye typeof window check kiya hai
 */
const getSavedUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("admin_user");
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Helper function: LocalStorage se token nikalne ke liye
 */
const getSavedToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

const initialState = {
  user: getSavedUser(),
  token: getSavedToken(),
  isAuthenticated: !!getSavedToken(), // Agar token hai toh true, warna false
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN SUCCESS: Jab API se { message, auth: { ... } } aata hai
    setLogin: (state, action) => {
      const payload = action.payload;
      
      // Aapke console log ke mutabik data 'auth' key ke andar hai
      const userData = payload?.auth;
      const token = payload?.auth?.token;

      if (userData && token) {
        state.user = userData;
        state.token = token;
        state.isAuthenticated = true;

        // API Interceptor 'token' key dhoond raha hai, isliye 'token' naam se save karein
        localStorage.setItem("token", token);
        // Pura user object 'admin_user' naam se save karein
        localStorage.setItem("admin_user", JSON.stringify(userData));
        
        console.log("Redux: Login state updated and storage synced.");
      }
    },

    // LOGOUT: Pura data clear karne ke liye
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;

      // LocalStorage saaf karein
      localStorage.removeItem("token");
      localStorage.removeItem("admin_user");
      
      console.log("Redux: User logged out and storage cleared.");
    },

    // LOADING STATE: API call ke waqt spinner dikhane ke liye
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // UPDATE USER: Agar profile update ho toh state sync karne ke liye
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("admin_user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setLogin, setLogout, setLoading, updateUser } = authSlice.actions;

export default authSlice.reducer;