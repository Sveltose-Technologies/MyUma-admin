export const storage = {
  setToken: (token) => {
if (token) {
  state.token = token;
  localStorage.setItem("admin_token", token);
}
  },
  getToken: () => {
    const token = localStorage.getItem("admin_token");
    if (!token || token === "undefined") return null;
    return token;
  },
  clear: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  },
};
