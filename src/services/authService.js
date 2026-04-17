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
// Get User By ID API
export const getUserByIdApi = async (id) => {
  const response = await api.get(`/auth/get-by-id/${id}`);
  return response.data;
};
// Update Profile API
export const updateProfileApi = async (id, userData) => {
  try {
    console.log("API Call: updateProfileApi");
    console.log("ID:", id);
    console.log("User Data:", userData);

    const response = await api.put(`/auth/update/${id}`, userData);

    console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error Response:", error.response);

    throw error; // important to handle in component
  }
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

export const addHomeBannerApi = async (formData) => {
  const response = await api.post("/home-banner/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllHomeBannersApi = async () => {
  const response = await api.get("/home-banner/get-all");
  console.log(
    "<<< API SUCCESS: getAllHomeBannersApi | Response:",
    response.data,
  );
  return response.data;
};

export const updateHomeBannerApi = async (id, formData) => {
  const response = await api.put(`/home-banner/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(
    "<<< API SUCCESS: updateHomeBannerApi | Response:",
    response.data,
  );
  return response.data;
};

export const deleteHomeBannerApi = async (id) => {
  const response = await api.delete(`/home-banner/delete/${id}`);
  return response.data;
};

// ==========================================
// 2. LOGO MANAGEMENT APIS
// ==========================================

export const getAllLogosApi = async () => {
  console.log(">>> API CALL: getAllLogosApi | Requesting All Logos...");
  try {
    const response = await api.get("/logo/get-all");
    console.log(
      "<<< API SUCCESS: getAllLogosApi | Count:",
      response.data?.logos?.length || 0,
      "Response:",
      response.data,
    );
    return response.data;
  } catch (error) {
    console.error(
      "!!! API ERROR: getAllLogosApi | Details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const addLogoApi = async (formData) => {
  console.log(">>> API CALL: addLogoApi | Uploading File...");
  try {
    const response = await api.post("/logo/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("<<< API SUCCESS: addLogoApi | Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "!!! API ERROR: addLogoApi | Details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateLogoApi = async (id, formData) => {
  console.log(`>>> API CALL: updateLogoApi | ID: ${id} | Updating File...`);
  try {
    const response = await api.put(`/logo/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("<<< API SUCCESS: updateLogoApi | Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "!!! API ERROR: updateLogoApi | Details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteLogoApi = async (id) => {
  console.log(`>>> API CALL: deleteLogoApi | Target ID: ${id}`);
  try {
    const response = await api.delete(`/logo/delete/${id}`);
    console.log("<<< API SUCCESS: deleteLogoApi | Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "!!! API ERROR: deleteLogoApi | Details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// --- Terms & Conditions API ---
export const getAllTermsApi = async () => {
  const res = await api.get("/termcondition/get-all");
  console.log("TC GET ALL:", res.data);
  return res.data;
};
export const addTermsApi = async (data) => {
  console.log("TC ADD PAYLOAD:", data);
  const res = await api.post("/termcondition/add", data);
  return res.data;
};
export const updateTermsApi = async (id, data) => {
  console.log("TC UPDATE ID:", id, "PAYLOAD:", data);
  const res = await api.put(`/termcondition/update/${id}`, data);
  return res.data;
};
export const deleteTermsApi = async (id) => {
  console.log("TC DELETE ID:", id);
  const res = await api.delete(`/termcondition/delete/${id}`);
  return res.data;
};

// --- Privacy Policy API ---
export const getAllPrivacyApi = async () => {
  const res = await api.get("/privacy-policy/get-all");
  console.log("PRIVACY GET ALL:", res.data);
  return res.data;
};
export const addPrivacyApi = async (data) => {
  console.log("PRIVACY ADD PAYLOAD:", data);
  const res = await api.post("/privacy-policy/add", data);
  return res.data;
};
export const updatePrivacyApi = async (id, data) => {
  console.log("PRIVACY UPDATE ID:", id, "PAYLOAD:", data);
  const res = await api.put(`/privacy-policy/update/${id}`, data);
  return res.data;
};
export const deletePrivacyApi = async (id) => {
  console.log("PRIVACY DELETE ID:", id);
  const res = await api.delete(`/privacy-policy/delete/${id}`);
  return res.data;
};

// --- About Us API ---
export const getAllAboutUsApi = async () => {
  const res = await api.get("/aboutus/get-all");
  console.log("ABOUTUS GET ALL RESPONSE:", res.data);
  return res.data;
};

export const addAboutUsApi = async (data) => {
  console.log("ABOUTUS ADD REQUEST PAYLOAD:", data);
  const res = await api.post("/aboutus/add", data);
  return res.data;
};

export const updateAboutUsApi = async (id, data) => {
  console.log("ABOUTUS UPDATE REQUEST ID:", id, "PAYLOAD:", data);
  const res = await api.put(`/aboutus/update/${id}`, data);
  return res.data;
};

export const deleteAboutUsApi = async (id) => {
  console.log("ABOUTUS DELETE REQUEST ID:", id);
  const res = await api.delete(`/aboutus/delete/${id}`);
  return res.data;
};

// --- Pricing API ---
export const getAllPricingApi = async () => {
  const res = await api.get("/pricing/get-all");
  console.log("PRICING GET ALL RESPONSE:", res.data);
  return res.data;
};

export const addPricingApi = async (data) => {
  console.log("PRICING ADD REQUEST PAYLOAD:", data);
  const res = await api.post("/pricing/add", data);
  return res.data;
};

export const updatePricingApi = async (id, data) => {
  console.log("PRICING UPDATE REQUEST ID:", id, "PAYLOAD:", data);
  const res = await api.put(`/pricing/update/${id}`, data);
  return res.data;
};

export const deletePricingApi = async (id) => {
  console.log("PRICING DELETE REQUEST ID:", id);
  const res = await api.delete(`/pricing/delete/${id}`);
  return res.data;
};

// --- Comment API ---
export const getAllCommentsApi = async () => {
  const res = await api.get("/comment/get-all");
  console.log("COMMENT GET ALL RESPONSE:", res.data);
  return res.data;
};

export const addCommentApi = async (data) => {
  console.log("COMMENT SEND REQUEST PAYLOAD:", data);
  const res = await api.post("/comment/send", data);
  return res.data;
};

export const updateCommentApi = async (id, data) => {
  console.log("COMMENT UPDATE REQUEST ID:", id, "PAYLOAD:", data);
  const res = await api.put(`/comment/update/${id}`, data);
  return res.data;
};

export const deleteCommentApi = async (id) => {
  console.log("COMMENT DELETE REQUEST ID:", id);
  const res = await api.delete(`/comment/delete/${id}`);
  return res.data;
};

// --- New Listing API ---
export const getAllListingsApi = async () => {
  const res = await api.get("/newListing/get-all");
  console.log("LISTING GET ALL RESPONSE:", res.data);
  return res.data;
};

export const addListingApi = async (formData) => {
  console.log("LISTING ADD REQUEST (Multipart)");
  const res = await api.post("/newListing/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateListingApi = async (id, formData) => {
  console.log("LISTING UPDATE REQUEST ID:", id);
  const res = await api.put(`/newListing/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteListingApi = async (id) => {
  console.log("API CALL: DELETE listing", id);

  const res = await api.delete(`/newListing/delete/${id}`);
  return res.data;
};