import api from "./api";

// ==========================================
// 1. AUTHENTICATION APIS
// ==========================================
export const loginApi = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const signupApi = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

export const verifyOtpApi = async (otpData) => {
  const response = await api.post("/auth/verify-otp", otpData);
  return response.data;
};

export const forgotPasswordApi = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (resetData) => {
  const response = await api.put("/auth/reset-password", resetData); 
  return response.data;
};

export const getUserByIdApi = async (id) => {
  const response = await api.get(`/auth/get-by-id/${id}`);
  return response.data;
};

export const updateProfileApi = async (id, userData) => {
  try {
    console.log(">>> API CALL: updateProfileApi | ID:", id);
    const response = await api.put(`/auth/update/${id}`, userData);
    console.log("<<< SUCCESS: updateProfileApi | Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "!!! ERROR: updateProfileApi | Details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// 2. BLOG CATEGORY APIS
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
// 3. BLOG APIS
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
// 4. GENERAL CATEGORY APIS
// ==========================================
export const getAllCategoriesApi = async () => {
  try {
    console.log(">>> API CALL: getAllCategoriesApi");
    const response = await api.get("/category/get-all");
    console.log("<<< SUCCESS: Categories fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("!!! ERROR: Categories failed:", error.message);
    throw error;
  }
};

export const addCategoryApi = async (payload) => {
  const response = await api.post("/category/add", payload);
  return response.data;
};

export const updateCategoryApi = async (id, payload) => {
  const response = await api.put(`/category/update/${id}`, payload);
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await api.delete(`/category/delete/${id}`);
  return response.data;
};

// ==========================================
// 5. HOME BANNER APIS
// ==========================================
export const addHomeBannerApi = async (formData) => {
  const response = await api.post("/home-banner/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllHomeBannersApi = async () => {
  const response = await api.get("/home-banner/get-all");
  console.log("<<< SUCCESS: getAllHomeBannersApi | Response:", response.data);
  return response.data;
};

export const updateHomeBannerApi = async (id, formData) => {
  const response = await api.put(`/home-banner/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteHomeBannerApi = async (id) => {
  const response = await api.delete(`/home-banner/delete/${id}`);
  return response.data;
};

// ==========================================
// 6. LOGO MANAGEMENT APIS
// ==========================================
export const getAllLogosApi = async () => {
  try {
    const response = await api.get("/logo/get-all");
    console.log("<<< SUCCESS: Logos fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("!!! ERROR: Logos failed:", error.message);
    throw error;
  }
};

export const addLogoApi = async (formData) => {
  const response = await api.post("/logo/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateLogoApi = async (id, formData) => {
  const response = await api.put(`/logo/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteLogoApi = async (id) => {
  const response = await api.delete(`/logo/delete/${id}`);
  return response.data;
};

// ==========================================
// 7. LEGAL & ABOUT US APIS
// ==========================================
export const getAllTermsApi = async () => {
  const res = await api.get("/termcondition/get-all");
  console.log("TC GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addTermsApi = async (data) => {
  const res = await api.post("/termcondition/add", data);
  return res.data;
};
export const updateTermsApi = async (id, data) => {
  const res = await api.put(`/termcondition/update/${id}`, data);
  return res.data;
};
export const deleteTermsApi = async (id) => {
  const res = await api.delete(`/termcondition/delete/${id}`);
  return res.data;
};

export const getAllPrivacyApi = async () => {
  const res = await api.get("/privacy-policy/get-all");
  console.log("PRIVACY GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addPrivacyApi = async (data) => {
  const res = await api.post("/privacy-policy/add", data);
  return res.data;
};
export const updatePrivacyApi = async (id, data) => {
  const res = await api.put(`/privacy-policy/update/${id}`, data);
  return res.data;
};
export const deletePrivacyApi = async (id) => {
  const res = await api.delete(`/privacy-policy/delete/${id}`);
  return res.data;
};

export const getAllAboutUsApi = async () => {
  const res = await api.get("/aboutus/get-all");
  console.log("ABOUTUS GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addAboutUsApi = async (data) => {
  const res = await api.post("/aboutus/add", data);
  return res.data;
};
export const updateAboutUsApi = async (id, data) => {
  const res = await api.put(`/aboutus/update/${id}`, data);
  return res.data;
};
export const deleteAboutUsApi = async (id) => {
  const res = await api.delete(`/aboutus/delete/${id}`);
  return res.data;
};

// ==========================================
// 8. PRICING & COMMENTS APIS
// ==========================================
export const getAllPricingApi = async () => {
  const res = await api.get("/pricing/get-all");
  console.log("PRICING GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addPricingApi = async (data) => {
  const res = await api.post("/pricing/add", data);
  return res.data;
};
export const updatePricingApi = async (id, data) => {
  const res = await api.put(`/pricing/update/${id}`, data);
  return res.data;
};
export const deletePricingApi = async (id) => {
  const res = await api.delete(`/pricing/delete/${id}`);
  return res.data;
};

export const getAllCommentsApi = async () => {
  const res = await api.get("/comment/get-all");
  console.log("COMMENT GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addCommentApi = async (data) => {
  console.log("COMMENT ADD REQUEST:", data);
  const res = await api.post("/comment/send", data);
  return res.data;
};
export const updateCommentApi = async (id, data) => {
  const res = await api.put(`/comment/update/${id}`, data);
  return res.data;
};
export const deleteCommentApi = async (id) => {
  const res = await api.delete(`/comment/delete/${id}`);
  return res.data;
};

// ==========================================
// 9. NEW LISTING & FOOTER APIS
// ==========================================
export const getAllListingsApi = async () => {
  const res = await api.get("/newListing/get-all");
  console.log("LISTING GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addListingApi = async (formData) => {
  const res = await api.post("/newListing/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const updateListingApi = async (id, formData) => {
  const res = await api.put(`/newListing/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const deleteListingApi = async (id) => {
  const res = await api.delete(`/newListing/delete/${id}`);
  return res.data;
};

export const getAllFooterApi = async () => {
  const res = await api.get("/footer-text/get-all");
  console.log("FOOTER GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addFooterApi = async (formData) => {
  const res = await api.post("/footer-text/add", formData);
  return res.data;
};
export const updateFooterApi = async (id, formData) => {
  const res = await api.put(`/footer-text/update/${id}`, formData);
  return res.data;
};
export const deleteFooterApi = async (id) => {
  const res = await api.delete(`/footer-text/delete/${id}`);
  return res.data;
};

// ==========================================
// 10. CONTACT US APIS
// ==========================================
export const getAllContactUsApi = async () => {
  const res = await api.get("/contactus/get-all");
  console.log("CONTACT GET ALL RESPONSE:", res.data);
  return res.data;
};
export const addContactUsApi = async (formData) => {
  const res = await api.post("/contactus/send", formData);
  return res.data;
};
export const updateContactUsApi = async (id, formData) => {
  const res = await api.put(`/contactus/update/${id}`, formData);
  return res.data;
};
export const deleteContactUsApi = async (id) => {
  const res = await api.delete(`/contactus/delete/${id}`);
  return res.data;
};
