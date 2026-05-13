import React, { useEffect, useState, useRef } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import { useUtils } from "../hook/useUtils";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import { getAllUsersApi, updateProfileApi } from "../services/authService";
import api from "../services/api";

const OWNER_METHODS = {
  getAll: getAllUsersApi,
  update: updateProfileApi,
  delete: async (id) => await api.delete(`/auth/delete/${id}`),
};

const OwnerList = () => {
  const { getImgURL } = useUtils();
  const fileInputRef = useRef(null);

  const { data, loading, fetchAll, updateItem, deleteItem } =
    useCrud(OWNER_METHODS);

  // Filter only those with role "owner"
  const ownersOnly = data.filter((u) => u.role === "owner");
  const pagination = usePagination(ownersOnly, 10);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // States for Image Handling
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    businessName: "",
    address: "",
    city: "",
    country: "",
    status: "active",
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Show local preview
    }
  };

  const openEditModal = (owner) => {
    setEditId(owner._id);
    setFormData({
      fullName: owner.fullName || "",
      email: owner.email || "",
      contactNo: owner.contactNo || "",
      businessName: owner.businessName || "",
      address: owner.address || "",
      city: owner.city || "",
      country: owner.country || "",
      status: owner.status || "active",
    });
    // Set initial preview from existing image
    setPreviewImage(getImgURL(owner.profileImage));
    setImageFile(null);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Use FormData for multipart/form-data support
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    if (imageFile) {
      dataToSend.append("profileImage", imageFile);
    }

    const success = await updateItem(editId, dataToSend);
    if (success) {
      setShowModal(false);
      fetchAll(); // Refresh list to show updated photo
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="mb-4">
        <h4 className="fw-bold text-navy m-0">Owner Directory</h4>
        <p className="text-muted small">
          Manage all business owners and their profile parameters
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table
            className="table table-hover align-middle mb-0"
            style={{ minWidth: "1400px" }}>
            <thead className="bg-white text-secondary small text-uppercase border-bottom">
              <tr>
                <th className="ps-4 py-3">Photo</th>
                <th>Full Name</th>
                <th>Business Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pagination.paginatedData?.length > 0 ? (
                pagination.paginatedData.map((owner) => (
                  <tr key={owner._id}>
                    <td className="ps-4">
                      <img
                        src={getImgURL(owner.profileImage)}
                        alt="Owner"
                        className="rounded-circle border"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="fw-bold text-navy">{owner.fullName}</td>
                    <td className="text-gold fw-bold small">
                      {owner.businessName || "—"}
                    </td>
                    <td className="small">{owner.email}</td>
                    <td className="small">{owner.contactNo || "—"}</td>
                    <td className="small text-muted">
                      {owner.city}, {owner.country}
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${owner.status === "active" ? "bg-light-success text-success" : "bg-light-danger text-danger"}`}>
                        {owner.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-white border shadow-sm"
                          onClick={() => openEditModal(owner)}>
                          <i className="bi bi-pencil-square text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-white border shadow-sm"
                          onClick={() => deleteItem(owner._id)}>
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    No owners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination {...pagination} />
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold m-0 text-navy">Update Owner Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body p-4">
                  {/* --- PROFILE IMAGE UPLOAD --- */}
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="rounded-circle border shadow-sm"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/120x120?text=Owner";
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle shadow"
                        onClick={() => fileInputRef.current.click()}
                        style={{ width: "35px", height: "35px", padding: 0 }}>
                        <i className="bi bi-camera-fill"></i>
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="small text-muted mt-2">
                      Update Profile Photo
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control bg-light border-0"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        BUSINESS NAME
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        className="form-control bg-light border-0"
                        value={formData.businessName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control bg-light border-0"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        MOBILE NUMBER
                      </label>
                      <input
                        type="text"
                        name="contactNo"
                        className="form-control bg-light border-0"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        CITY
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="form-control bg-light border-0"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        COUNTRY
                      </label>
                      <input
                        type="text"
                        name="country"
                        className="form-control bg-light border-0"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-muted">
                        ACCOUNT STATUS
                      </label>
                      <select
                        name="status"
                        className="form-select bg-light border-0"
                        value={formData.status}
                        onChange={handleInputChange}>
                        <option value="active">Active</option>
                        <option value="deactive">Deactive</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted">
                        OFFICE ADDRESS
                      </label>
                      <textarea
                        name="address"
                        className="form-control bg-light border-0"
                        rows="2"
                        value={formData.address}
                        onChange={handleInputChange}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0 d-flex gap-3">
                  <CustomButton
                    variant="cancel"
                    className="flex-grow-1"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type="submit"
                    className="flex-grow-1"
                    loading={loading}>
                    Save Changes
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerList;
