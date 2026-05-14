import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllFavoritesApi,
  updateFavoriteApi,
  deleteFavoriteApi,
  getAllUsersApi,
  getAllListingsApi, // Items are in the "listings" key
} from "../services/authService";

const FAVORITE_METHODS = {
  getAll: getAllFavoritesApi,
  update: updateFavoriteApi,
  delete: deleteFavoriteApi,
};

const Favorites = () => {
  const { data, loading, fetchAll, updateItem, deleteItem } =
    useCrud(FAVORITE_METHODS);
  const pagination = usePagination(data, 10);

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    itemId: "",
  });

  useEffect(() => {
    fetchAll();
    fetchDropdowns();
  }, [fetchAll]);

  const fetchDropdowns = async () => {
    try {
      const [uRes, iRes] = await Promise.all([
        getAllUsersApi(),
        getAllListingsApi(),
      ]);

      // Using your JSON keys: "auths" and "listings"
      const userData = uRes?.auths || [];
      const itemData = iRes?.listings || [];

      setUsers(userData);
      setItems(itemData);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editData) {
      const success = await updateItem(editData._id, formData);
      if (success) {
        setShowModal(false);
        setEditData(null);
      }
    }
  };

  const openEditModal = (item) => {
    setEditData(item);
    setFormData({
      userId: item.userId?._id || item.userId || "",
      itemId: item.itemId?._id || item.itemId || "",
    });
    setShowModal(true);
  };

  // Helper to show User Name (fullName)
  const getUserDisplay = (uid) => {
    const id = uid?._id || uid;
    const found = users.find((u) => u._id === id);
    return found ? found.fullName : "Unknown User";
  };

  // Helper to show Item Title (title)
  const getItemDisplay = (iid) => {
    const id = iid?._id || iid;
    const found = items.find((i) => i._id === id);
    return found ? found.title : "Unknown Item";
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Favorite Management</h4>
        <p className="text-muted small">
          Update or delete user favorite records
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy m-0">All Favorites</h5>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3">#</th>
                <th>User Name</th>
                <th>Listing Title</th>
                <th>Date Added</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
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
                      {getUserDisplay(item.userId)}
                    </td>
                    <td className="text-muted">
                      {getItemDisplay(item.itemId)}
                    </td>
                    <td className="small text-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end px-4">
                      <button
                        className="btn btn-sm btn-light border-0 me-2 shadow-sm"
                        onClick={() => openEditModal(item)}>
                        <i className="bi bi-pencil-square text-primary"></i>
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
      <Pagination {...pagination} />

      {/* EDIT MODAL */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 1060,
            }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="fw-bold text-navy m-0">Edit Favorite</h5>
                  <button
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="small fw-bold text-muted">USER</label>
                      <select
                        className="form-select border-2 shadow-none"
                        value={formData.userId}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                        required>
                        <option value="">-- Choose User --</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-0">
                      <label className="small fw-bold text-muted">
                        LISTING ITEM
                      </label>
                      <select
                        className="form-select border-2 shadow-none"
                        value={formData.itemId}
                        onChange={(e) =>
                          setFormData({ ...formData, itemId: e.target.value })
                        }
                        required>
                        <option value="">-- Choose Listing --</option>
                        {items.map((it) => (
                          <option key={it._id} value={it._id}>
                            {it.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 pt-0">
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
                          Update Favorite
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}></div>
        </>
      )}
    </div>
  );
};

export default Favorites;
