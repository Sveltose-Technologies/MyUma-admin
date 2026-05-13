// src/utils/storage.js

// 1. Individual Exports (For Messages.jsx)
export const setToken = (token) => {
  if (token) localStorage.setItem("admin_token", token);
};

export const getToken = () => {
  const token = localStorage.getItem("admin_token");
  if (!token || token === "undefined") return null;
  return token;
};

export const setUser = (user) => {
  if (user) localStorage.setItem("admin_user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("admin_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const clear = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};

// 2. Combined Export (For authSlice.js and the "storage" error)
export const storage = {
  setToken,
  getToken,
  setUser,
  getUser,
  clear,
};
