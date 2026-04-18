import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import TextEditor from "../components/common/TextEditor";
import {
  getAllRatingsApi,
  addRatingApi,
  updateRatingApi,
  deleteRatingApi,
  getAllListingsApi, // For Item Selection
} from "../services/authService";

const RATING_METHODS = {
  getAll: getAllRatingsApi,
  add: addRatingApi,
  update: updateRatingApi,
  delete: deleteRatingApi,
};

const Rating = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(RATING_METHODS);
  const pagination = usePagination(data, 10);

  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    itemId: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    fetchAll();
    fetchListings();
  }, [fetchAll]);

  const fetchListings = async () => {
    try {
      const res = await getAllListingsApi();
      setListings(res?.data || res?.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, formData)
      : await addItem(formData);
    if (success) setShowModal(false);
  };

  const getPreviewText = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const plainText = doc.body.textContent || "";
    const words = plainText.trim().split(/\s+/);
    return words.length > 5 ? words.slice(0, 5).join(" ") + "..." : plainText;
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        userId: item.userId?._id || item.userId || "",
        itemId: item.itemId?._id || item.itemId || "",
        rating: item.rating || "",
        comment: item.comment || "",
      });
    } else {
      setEditId(null);
      setFormData({ userId: "", itemId: "", rating: "", comment: "" });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Rating Management</h4>
        <p className="text-muted small">
          Manage and moderate user reviews and ratings
        </p>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
        <h5 className="fw-bold text-navy m-0">All Ratings</h5>
        <CustomButton
          onClick={() => openModal()}
          className="w-100 w-sm-auto shadow-sm">
          <i className="bi bi-star me-2"></i> Add Review
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr className="small text-uppercase">
                <th className="px-4 py-3">#</th>
                <th>User</th>
                <th>Item / Property</th>
                <th>Rating</th>
                <th>Comment Preview</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-gold"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td className="fw-bold text-navy">
                      {item.userId?.fullName || "User"}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {item.itemId?.title || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-gold">
                        {item.rating} <i className="bi bi-star-fill small"></i>
                      </span>
                    </td>
                    <td className="small text-muted">
                      {getPreviewText(item.comment)}
                    </td>
                    <td className="text-end px-4">
                      <button
                        className="btn btn-sm btn-light border-0 me-2 shadow-sm"
                        onClick={() => openModal(item)}>
                        <i className="bi bi-pencil-square text-info"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-light border-0 shadow-sm"
                        onClick={() => deleteItem(item._id)}>
                        <i className="bi bi-trash3 text-danger"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3">
        <Pagination {...pagination} />
      </div>

      {showModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
          }}>
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold text-navy m-0">
                  {editId ? "Update Review" : "New Rating Entry"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Select Item
                      </label>
                      <select
                        className="form-select border-2 shadow-none rounded-3"
                        value={formData.itemId}
                        onChange={(e) =>
                          setFormData({ ...formData, itemId: e.target.value })
                        }
                        required>
                        <option value="">-- Choose Item --</option>
                        {listings.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="form-control border-2 shadow-none rounded-3"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        User ID
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none rounded-3"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Review Comment
                      </label>
                      <TextEditor
                        value={formData.comment}
                        onChange={(val) =>
                          setFormData({ ...formData, comment: val })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0 mt-3">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6">
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={() => setShowModal(false)}>
                        Cancel
                      </CustomButton>
                    </div>
                    <div className="col-6">
                      <CustomButton
                        type="submit"
                        loading={loading}
                        className="w-100">
                        {editId ? "Update" : "Save"}
                      </CustomButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rating;
