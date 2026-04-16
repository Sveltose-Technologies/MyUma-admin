import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUserByIdApi, updateProfileApi } from "../services/authService";
import { setLoading, setLogin } from "../store/slices/authSlice";
import CustomButton from "../components/common/CustomButton";
import { useUtils } from "../hook/useUtils";

const EditProfile = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { getImgURL } = useUtils();

  // Get data from Redux
  const user = auth.user;
  const token = auth.token;
  const loading = auth.loading;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    role: "admin",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Now that state is flattened, user._id should exist
      const userId = user?._id || user?.id;

      if (!userId) {
        console.log("Waiting for User ID... Current user state:", user);
        return;
      }

      try {
        const response = await getUserByIdApi(userId);
        // Path: response.user OR response.data OR response
        const data = response?.user || response?.data || response;

        if (data) {
          setFormData({
            fullName: data.fullName || "",
            email: data.email || "",
            address: data.address || "",
            role: data.role || "admin",
          });
          if (data.profileImage) {
            setPreview(getImgURL(data.profileImage));
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load profile data from server");
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const dataToSend = new FormData();
      dataToSend.append("fullName", formData.fullName);
      dataToSend.append("email", formData.email);
      dataToSend.append("address", formData.address);
      dataToSend.append("role", formData.role);

      if (formData.profileImage instanceof File) {
        dataToSend.append("profileImage", formData.profileImage);
      }

      const response = await updateProfileApi(userId, dataToSend);

      if (response) {
        const updatedUser = response.user || response.data || response;
        // Re-dispatch with existing token to keep interceptor working
        dispatch(setLogin({ auth: { user: updatedUser, token: token } }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-header bg-white py-3 border-bottom text-center">
              <h5 className="mb-0 fw-bold">EDIT PROFILE</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <div className="mb-3">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="rounded-circle border"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle border bg-light d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: "120px", height: "120px" }}>
                        <i className="bi bi-person fs-1"></i>
                      </div>
                    )}
                  </div>
                  <label className="btn btn-outline-dark btn-sm fw-bold">
                    CHANGE PHOTO
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({ ...formData, profileImage: file });
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                      accept="image/*"
                    />
                  </label>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold">FULL NAME</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="small fw-bold">EMAIL</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="small fw-bold">ROLE</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.role.toUpperCase()}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="small fw-bold">ADDRESS</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }></textarea>
                </div>

                <div className="d-flex gap-2">
                  <CustomButton
                    type="submit"
                    loading={loading}
                    variant="gold"
                    className="w-100">
                    SAVE
                  </CustomButton>
                  <CustomButton
                    type="button"
                    variant="cancel"
                    className="w-100"
                    onClick={() => window.history.back()}>
                    CANCEL
                  </CustomButton>
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
