import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUserByIdApi, updateProfileApi } from "../services/authService";
import { setLoading, setLogin } from "../store/slices/authSlice";
import CustomButton from "../components/common/CustomButton";
import { useUtils } from "../hook/useUtils";

const EditProfile = () => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { getImgURL } = useUtils();

  // local state for inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    role: "admin",
  });
  const [preview, setPreview] = useState(null);

  // Logic to find ID
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.log("Waiting for User ID...");
        return;
      }

      try {
        const response = await getUserByIdApi(userId);
        // Extract the user data from response
        const data = response?.auth || response?.user || response;

        if (data) {
          // THIS SETS THE PREVIEW DATA IN INPUTS
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
        console.error("Fetch Error:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("User ID not found");

    dispatch(setLoading(true));
    try {
      const dataToSend = new FormData();
      dataToSend.append("fullName", formData.fullName);
      dataToSend.append("email", formData.email);
      dataToSend.append("address", formData.address);

      if (formData.profileImage instanceof File) {
        dataToSend.append("profileImage", formData.profileImage);
      }

      const response = await updateProfileApi(userId, dataToSend);

      if (response) {
        const updatedUser = response.auth || response.user || response;
        // Update Redux with new data + existing token
        dispatch(setLogin({ auth: updatedUser, token: token }));
        toast.success("Profile Updated!");
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container py-5">
      <div
        className="card shadow border-0 mx-auto"
        style={{ maxWidth: "700px" }}>
        <div className="card-header bg-white text-center fw-bold py-3">
          EDIT PROFILE
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Image Preview */}
            <div className="text-center mb-4">
              <img
                src={preview || "https://placehold.co/120"}
                className="rounded-circle border mb-2"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                alt="preview"
              />
              <br />
              <label className="btn btn-sm btn-outline-dark">
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
              />
            </div>

            <div className="mb-4">
              <label className="small fw-bold">ADDRESS</label>
              <textarea
                className="form-control"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <CustomButton
              type="submit"
              loading={loading}
              variant="gold"
              className="w-100">
              SAVE
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
