export const storage = {
  setToken: (token) => {
    if (token) {
      localStorage.setItem("admin_token", token);
    }
  },
  getToken: () => {
    const token = localStorage.getItem("admin_token");
    // Handle "undefined" string which sometimes happens with APIs
    if (!token || token === "undefined") return null;
    return token;
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem("admin_user", JSON.stringify(user));
    }
  },
  getUser: () => {
    const user = localStorage.getItem("admin_user");
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  clear: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  },
};
