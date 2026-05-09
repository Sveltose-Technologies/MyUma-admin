import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateProfileApi } from "../services/authService";
import { updateUser, setLoading } from "../store/slices/authSlice";
import { useUtils } from "../hook/useUtils";
import CustomButton from "../components/common/CustomButton";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { getImgURL } = useUtils();

  // 1. Local State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    address: "",
    businessName: "",
    country: "",
    city: "",
    role: "",
    status: "",
    password: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoaded, setIsLoaded] = useState(false); // Flag to prevent "locking"

  // 2. Load data ONLY ONCE when user object is available
  useEffect(() => {
    if (user && !isLoaded) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        contactNo: user.contactNo || "",
        address: user.address || "",
        businessName: user.businessName || "",
        country: user.country || "",
        city: user.city || "",
        role: user.role || "admin",
        status: user.status || "active",
        password: "",
      });
      if (user.profileImage) {
        setImagePreview(getImgURL(user.profileImage));
      }
      setIsLoaded(true); // Mark as loaded so typing doesn't trigger a reset
    }
  }, [user, getImgURL, isLoaded]);

  // 3. Handle Changes (Ensures state updates when you type)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Typing in ${name}: ${value}`); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 4. Save Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) return toast.error("User ID not found");

    dispatch(setLoading(true));
    try {
      const data = new FormData();

      // Append all text fields
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("contactNo", formData.contactNo);
      data.append("address", formData.address);
      data.append("businessName", formData.businessName);
      data.append("country", formData.country);
      data.append("city", formData.city);
      data.append("role", formData.role);
      data.append("status", formData.status);

      // Only append password if the user actually typed a new one
      if (formData.password) {
        data.append("password", formData.password);
      }

      // Append image if selected
      if (selectedFile) {
        data.append("profileImage", selectedFile);
      }

      const response = await updateProfileApi(userId, data);

      if (response?.auth) {
        dispatch(updateUser(response.auth)); // Updates Redux & LocalStorage
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row">
        <div className="col-12 mb-4">
          <h3 className="fw-bold text-navy">Account Settings</h3>
          <p className="text-muted">
            Update your administrative profile details below.
          </p>
        </div>

        {/* LEFT SIDE: AVATAR CARD */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 text-center p-4 mb-4 bg-white">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src={imagePreview || "https://placehold.co/150x150?text=Admin"}
                alt="Admin"
                className="rounded-circle shadow border border-4 border-white"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <label
                htmlFor="profileImage"
                className="position-absolute bottom-0 end-0 bg-gold rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid white",
                  cursor: "pointer",
                }}>
                <i className="bi bi-camera-fill text-navy"></i>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  className="d-none"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <h5 className="fw-bold m-0">{formData.fullName || "Admin Name"}</h5>
            <p className="text-muted small mb-3">{formData.email}</p>
            <div className="d-flex justify-content-center gap-2">
              <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">
                ROLE: {formData.role?.toUpperCase()}
              </span>
              <span
                className={`badge ${formData.status === "active" ? "bg-success" : "bg-danger"} px-3 py-2 rounded-pill`}>
                {formData.status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: EDITABLE FORM */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-white">
            <div className="card-header bg-transparent border-bottom p-4">
              <h5 className="fw-bold m-0 text-navy">
                <i className="bi bi-person-lines-fill me-2 text-gold"></i>{" "}
                Personal Information
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control bg-light border-0 py-2"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-light border-0 py-2"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Contact */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      CONTACT NUMBER
                    </label>
                    <input
                      type="text"
                      name="contactNo"
                      className="form-control bg-light border-0 py-2"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Business Name */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      BUSINESS NAME
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      className="form-control bg-light border-0 py-2"
                      value={formData.businessName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Country */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      COUNTRY
                    </label>
                    <input
                      type="text"
                      name="country"
                      className="form-control bg-light border-0 py-2"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* City */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      CITY
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="form-control bg-light border-0 py-2"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">
                      OFFICE ADDRESS
                    </label>
                    <textarea
                      name="address"
                      className="form-control bg-light border-0 py-2"
                      rows="2"
                      value={formData.address}
                      onChange={handleInputChange}></textarea>
                  </div>

                  {/* Security Header */}
                  <div className="col-12 mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-3 text-navy">
                      <i className="bi bi-lock-fill me-2 text-gold"></i>{" "}
                      Security & Role
                    </h6>
                  </div>

                  {/* Password */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      CHANGE PASSWORD
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control bg-light border-0 py-2"
                      placeholder="Leave empty to keep current"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Role (Read Only as requested) */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      ADMIN ROLE
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0 py-2 text-muted"
                      value={formData.role}
                      disabled
                    />
                  </div>

                  {/* Buttons */}
                  <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <CustomButton
                      variant="cancel"
                      onClick={() => window.history.back()}>
                      Discard Changes
                    </CustomButton>
                    <CustomButton type="submit" loading={loading}>
                      Save All Updates
                    </CustomButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
