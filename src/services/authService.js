import api from "./api"; // Yeh small letters mein hai

// 1. Login API
export const loginApi = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// 2. Signup API
export const signupApi = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// 3. Verify OTP API
export const verifyOtpApi = async (otpData) => {
  const response = await api.post("/auth/verify-otp", otpData);
  return response.data;
};

// 4. Forgot Password API
export const forgotPasswordApi = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// 5. Reset Password API
export const resetPasswordApi = async (resetData) => {
  const response = await api.put("/auth/reset-password", resetData);
  return response.data;
};

// ==========================================
// 4. BLOG CATEGORY APIS
// ==========================================
export const addBlogCategoryApi = async (data) => {
  const response = await api.post("/blog-category/add", data);
  return response.data;
};

export const getAllBlogCategoriesApi = async () => {
  const response = await api.get("/blog-category/get-all");
  return response.data;
};

export const updateBlogCategoryApi = async (id, data) => {
  const response = await api.put(`/blog-category/update/${id}`, data);
  return response.data;
};

export const deleteBlogCategoryApi = async (id) => {
  const response = await api.delete(`/blog-category/delete/${id}`);
  return response.data;
};

// ==========================================
// 5. BLOG APIS
// ==========================================
export const addBlogApi = async (formData) => {
  const response = await api.post("/blog/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllBlogsApi = async () => {
  const response = await api.get("/blog/get-all");
  return response.data;
};

export const updateBlogApi = async (id, formData) => {
  const response = await api.put(`/blog/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBlogApi = async (id) => {
  const response = await api.delete(`/blog/delete/${id}`);
  return response.data;
};

// ==========================================
// 6. GENERAL CATEGORY APIS (FIXED API -> api)
// ==========================================

// 1. GET ALL CATEGORIES
export const getAllCategoriesApi = async () => {
  try {
    console.log("--- API CALL: Fetching All Categories ---");
    const response = await api.get("/category/get-all"); // FIXED: small api
    console.log("SUCCESS: Categories fetched:", response.data);
    return response.data; // Added .data for useCrud
  } catch (error) {
    console.error(
      "ERROR: Fetching failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 2. ADD CATEGORY
export const addCategoryApi = async (payload) => {
  try {
    console.log("--- API CALL: Adding Category ---", payload);
    const response = await api.post("/category/add", payload); // FIXED: small api
    console.log("SUCCESS: Category Added:", response.data);
    return response.data; // Added .data
  } catch (error) {
    console.error(
      "ERROR: Adding failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 3. UPDATE CATEGORY
export const updateCategoryApi = async (id, payload) => {
  try {
    console.log(`--- API CALL: Updating Category ID: ${id} ---`, payload);
    const response = await api.put(`/category/update/${id}`, payload); // FIXED: small api
    console.log("SUCCESS: Category Updated:", response.data);
    return response.data; // Added .data
  } catch (error) {
    console.error(
      "ERROR: Update failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 4. DELETE CATEGORY
export const deleteCategoryApi = async (id) => {
  try {
    console.log(`--- API CALL: Deleting Category ID: ${id} ---`);
    const response = await api.delete(`/category/delete/${id}`); // FIXED: small api
    console.log("SUCCESS: Category Deleted:", response.data);
    return response.data; // Added .data
  } catch (error) {
    console.error(
      "ERROR: Delete failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
