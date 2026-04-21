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
  getAllListingsApi,
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

  // Extracting the rating array from API response
  const ratingList = Array.isArray(data) ? data : data?.data || [];
  const pagination = usePagination(ratingList, 10);

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
      // Ensure we store the array of items/properties
      setListings(res?.data || res?.listings || res || []);
    } catch (err) {
      console.error("Failed to fetch listings");
    }
  };

  /**
   * LOOKUP LOGIC
   * This function finds the 'title' from the listings array
   * using the itemId provided in the rating.
   */
  const getItemName = (id) => {
    if (!id) return "Unknown Item";
    const found = listings.find((item) => item._id === id);
    return found ? found.title : id; // Returns title if found, otherwise the ID
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, formData)
      : await addItem(formData);
    if (success) setShowModal(false);
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "---");

  const getPreviewText = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const plainText = doc.body.textContent || "";
    return plainText.length > 25
      ? plainText.substring(0, 25) + "..."
      : plainText;
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
          Managing all review data and item associations
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy m-0">Review Logs</h5>
        <CustomButton onClick={() => openModal()} className="shadow-sm">
          <i className="bi bi-plus-lg me-1"></i> Add Review
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr className="small text-uppercase">
                <th className="px-4 py-3">#</th>
                <th>ID</th>
                <th>User Name / ID</th>
                <th>Item / Property Name</th>
                <th>Rating</th>
                <th>Comment</th>
             
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && ratingList.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-5">
                    <div className="spinner-border text-gold"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id} className="small">
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td
                      className="text-muted font-monospace"
                      style={{ fontSize: "11px" }}>
                      {item._id}
                    </td>
                    <td>
                      {/* If the backend populates name, show it. Otherwise show ID */}
                      <div className="fw-bold text-navy">
                        {item.userId?.fullName || "User"}
                      </div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {item.userId?._id || item.userId}
                      </div>
                    </td>
                    <td>
                      <div className="badge bg-info-subtle text-info border border-info-subtle px-2">
                        {getItemName(item.itemId)}
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold text-gold">
                        {item.rating} <i className="bi bi-star-fill small"></i>
                      </span>
                    </td>
                    <td className="text-muted">
                      {getPreviewText(item.comment)}
                    </td>
            
                 
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => openModal(item)}>
                          <i className="bi bi-pencil-square text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => deleteItem(item._id)}>
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
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
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4">
                <h5 className="fw-bold text-navy m-0">
                  {editId ? "Update Review" : "New Rating"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4 pt-0">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">
                        SELECT ITEM
                      </label>
                      <select
                        className="form-select border-2"
                        value={formData.itemId}
                        onChange={(e) =>
                          setFormData({ ...formData, itemId: e.target.value })
                        }
                        required>
                        <option value="">-- Choose Item --</option>
                        {listings.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">
                        RATING (1-5)
                      </label>
                      <input
                        type="number"
                        className="form-control border-2"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">
                        USER ID
                      </label>
                      <input
                        type="text"
                        className="form-control border-2"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">
                        COMMENT
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
                <div className="modal-footer border-0 p-4">
                  <CustomButton
                    variant="cancel"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" loading={loading}>
                    {editId ? "Update" : "Save"}
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

export default Rating;
