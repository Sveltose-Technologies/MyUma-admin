export const storage = {
  setToken: (token) => localStorage.setItem("admin_token", token),
  getToken: () => localStorage.getItem("admin_token"),
  clear: () => localStorage.removeItem("admin_token"),
};
