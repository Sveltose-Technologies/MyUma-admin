import React, { useEffect, useState, useMemo } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  reviewMethods,
  getAllUsersApi,
  getAllListingsApi,
} from "../services/authService";

const Reviews = () => {
  // 1. CRUD Hook
  const {
    data: rawReviews,
    loading,
    fetchAll,
    addItem,
    updateItem,
    deleteItem,
  } = useCrud(reviewMethods);

  // 2. Local States for Data Mapping & UI
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // 3. Form State
  const [formData, setFormData] = useState({
    userId: "",
    itemId: "",
    comment: "",
  });

  useEffect(() => {
    fetchAll();
    loadHelpers();
  }, [fetchAll]);

  // Load Users and Listings to show names in the table and dropdown
  const loadHelpers = async () => {
    try {
      const [uRes, iRes] = await Promise.all([
        getAllUsersApi(),
        getAllListingsApi(),
      ]);
      setUsers(uRes.data || uRes.users || []);
      setItems(iRes.listings || iRes.data || []);
    } catch (err) {
      console.error("Failed to load helper data", err);
    }
  };

  // 4. Data Mapping Logic
  // Matches the ID from the review to the Name from the users/items list
  const mappedReviews = useMemo(() => {
    return rawReviews.map((review) => {
      const userObj = users.find((u) => u._id === review.userId);
      const itemObj = items.find((i) => i._id === review.itemId);
      return {
        ...review,
        userName: userObj ? userObj.fullName : "Unknown User",
        userEmail: userObj ? userObj.email : review.userId,
        itemName: itemObj ? itemObj.title : review.itemId,
      };
    });
  }, [rawReviews, users, items]);

  const pagination = usePagination(mappedReviews, 10);

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, formData)
      : await addItem(formData);
    if (success) handleClose();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ userId: "", itemId: "", comment: "" });
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setFormData({
      userId: item.userId,
      itemId: item.itemId,
      comment: item.comment,
    });
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold m-0 text-navy">Manage Reviews</h4>
          <p className="text-muted small m-0">View and handle user feedback</p>
        </div>
        <CustomButton
          onClick={() => setShowModal(true)}
          className="px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i> Add Review
        </CustomButton>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="py-3">User</th>
                <th className="py-3">Item / Listing</th>
                <th className="py-3">Comment</th>
                <th className="text-end px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-4 text-muted small">
                    {(pagination.currentPage - 1) * 10 + (index + 1)}
                  </td>
                  <td>
                    <div className="fw-bold text-navy">{item.userName}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>
                      {item.userEmail}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-navy border px-2 py-1">
                      {item.itemName}
                    </span>
                  </td>
                  <td
                    className="small text-secondary"
                    style={{ maxWidth: "300px" }}>
                    "{item.comment}"
                  </td>
                  <td className="text-end px-4">
                    <button
                      className="btn btn-sm bg-light border-0 me-2 shadow-sm"
                      onClick={() => startEdit(item)}>
                      <i className="bi bi-pencil-square text-navy"></i>
                    </button>
                    <button
                      className="btn btn-sm bg-light border-0 shadow-sm"
                      onClick={() => deleteItem(item._id)}>
                      <i className="bi bi-trash3 text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && mappedReviews.length === 0 && (
            <div className="text-center p-5 text-muted">No reviews found.</div>
          )}
        </div>
      </div>

      <Pagination {...pagination} />

      {/* Responsive Modal Popup */}
      {showModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0, 21, 41, 0.6)",
            backdropFilter: "blur(4px)",
          }}>
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold m-0 text-navy">
                  {editId ? "Edit Review" : "New Review"}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  {/* User Selection */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      User
                    </label>
                    <select
                      className="form-select shadow-none border-2"
                      style={{ borderRadius: "10px" }}
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      required>
                      <option value="">Select User</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Selection */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Item / Listing
                    </label>
                    <select
                      className="form-select shadow-none border-2"
                      style={{ borderRadius: "10px" }}
                      value={formData.itemId}
                      onChange={(e) =>
                        setFormData({ ...formData, itemId: e.target.value })
                      }
                      required>
                      <option value="">Select Listing</option>
                      {items.map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Comment
                    </label>
                    <textarea
                      className="form-control shadow-none border-2"
                      style={{ borderRadius: "10px" }}
                      rows="3"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6 p-0 pe-1">
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={handleClose}>
                        Cancel
                      </CustomButton>
                    </div>
                    <div className="col-6 p-0 ps-1">
                      <CustomButton
                        type="submit"
                        variant="gold"
                        className="w-100 shadow-sm"
                        loading={loading}>
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

export default Reviews;
