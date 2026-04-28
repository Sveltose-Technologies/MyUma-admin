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

  // Ratings are inside res.data based on your JSON
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

  // Fetch all service listings for the dropdown and lookup
  const fetchListings = async () => {
    try {
      const res = await getAllListingsApi();
      // Based on your console: res.listings contains the array
      setListings(res?.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    }
  };

  /**
   * LOOKUP LOGIC
   * Finds the title of the service based on the itemId
   */
  const getItemName = (id) => {
    if (!id) return "---";
    const searchId = typeof id === "object" ? id._id : id;
    const found = listings.find((item) => item._id === searchId);
    return found ? found.title : "Unknown Service";
  };

  // Render Stars UI
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi bi-star-fill ${i < rating ? "text-warning" : "text-light"}`}
        style={{ fontSize: "14px" }}></i>
    ));
  };

  const stripHtml = (html) => {
    if (!html) return "No comment";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, formData)
      : await addItem(formData);
    if (success) setShowModal(false);
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
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-800 text-navy mb-1 ls-1">REVIEW MANAGEMENT</h4>
          <p className="text-muted small">
            Manage and moderate customer feedback
          </p>
        </div>
        <button className="uma-btn-navy uma-btn" onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> ADD REVIEW
        </button>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-navy text-white">
              <tr className="small text-uppercase ls-1">
                <th className="px-4 py-3">#</th>
                <th>User</th>
                <th>Service Name</th>
                <th>Comment</th>
                <th>Rating</th>
                <th>Date</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && ratingList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-tan"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id} className="transition-hover">
                    <td className="px-4 text-muted small">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td>
                      <div className="fw-bold text-navy">
                        {item.userId?.fullName || "Customer"}
                      </div>
                      <div
                        className="text-muted small"
                        style={{ fontSize: "10px" }}>
                        ID:{" "}
                        {typeof item.userId === "string"
                          ? item.userId
                          : item.userId?._id}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-tan text-navy border-0 px-2 py-1">
                        {getItemName(item.itemId)}
                      </span>
                    </td>
                    <td
                      className="text-muted small"
                      style={{ maxWidth: "200px" }}>
                      <div className="text-truncate">
                        {stripHtml(item.comment)}
                      </div>
                    </td>
                    <td>{renderStars(item.rating)}</td>
                    <td className="text-muted small">
                      {item.createdAt ? item.createdAt.split("T")[0] : "---"}
                    </td>
                    <td className="text-end px-4">
                      <div className="btn-group border rounded shadow-sm bg-white">
                        <button
                          className="btn btn-sm btn-white border-end"
                          onClick={() => openModal(item)}>
                          <i className="bi bi-pencil-square text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-white text-danger"
                          onClick={() => deleteItem(item._id)}>
                          <i className="bi bi-trash3"></i>
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

      {/* Pagination */}
      <div className="mt-4">
        <Pagination {...pagination} />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-navy text-white border-0 p-4">
                <h5 className="fw-800 m-0 ls-1">
                  {editId ? "UPDATE REVIEW" : "WRITE NEW REVIEW"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body p-4 bg-light">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="small fw-800 text-navy mb-2 ls-1">
                        SELECT SERVICE
                      </label>
                      <select
                        className="form-select border-gold"
                        value={formData.itemId}
                        onChange={(e) =>
                          setFormData({ ...formData, itemId: e.target.value })
                        }
                        required>
                        <option value="">-- Choose Listing --</option>
                        {listings.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="small fw-800 text-navy mb-2 ls-1">
                        SCORE (1-5)
                      </label>
                      <input
                        type="number"
                        className="form-control border-gold"
                        min="1"
                        max="5"
                        placeholder="e.g. 5"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="small fw-800 text-navy mb-2 ls-1">
                        USER REFERENCE ID
                      </label>
                      <input
                        type="text"
                        className="form-control border-gold"
                        placeholder="Paste User ID"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="small fw-800 text-navy mb-2 ls-1">
                        REVIEW DETAILS
                      </label>
                      <div className="bg-white rounded">
                        <TextEditor
                          value={formData.comment}
                          onChange={(val) =>
                            setFormData({ ...formData, comment: val })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-white border-0 p-4 pt-0">
                  <button
                    type="button"
                    className="btn btn-light px-4 fw-bold"
                    onClick={() => setShowModal(false)}>
                    CANCEL
                  </button>
                  <button type="submit" className="uma-btn-navy uma-btn px-5">
                    {editId ? "UPDATE REVIEW" : "PUBLISH REVIEW"}
                  </button>
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
