import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllBlogCategoriesApi,
  addBlogCategoryApi,
  updateBlogCategoryApi,
  deleteBlogCategoryApi,
} from "../services/authService";

// Config moved outside to prevent infinite re-renders
const BLOG_CATEGORY_METHODS = {
  getAll: getAllBlogCategoriesApi,
  add: addBlogCategoryApi,
  update: updateBlogCategoryApi,
  delete: deleteBlogCategoryApi,
};

const BlogCategories = () => {
  // CRUD Hook
  const {
    data: categories,
    loading,
    fetchAll,
    addItem,
    updateItem,
    deleteItem,
  } = useCrud(BLOG_CATEGORY_METHODS);

  // Pagination Hook (10 items per page)
  const pagination = usePagination(categories, 10);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, { title })
      : await addItem({ title });

    if (success) {
      handleCloseModal();
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setTitle("");
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Responsive Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold m-0 text-navy">Blog Categories</h4>
          <p className="text-muted small m-0">
            Manage and organize blog topics
          </p>
        </div>

        {/* Using CustomButton for "Add" */}
        <CustomButton
          onClick={() => setShowModal(true)}
          className="px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i> Add Category
        </CustomButton>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-4 py-3" style={{ width: "80px" }}>
                  #
                </th>
                <th className="py-3">Category Title</th>
                <th className="text-end px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <div
                      className="spinner-border text-gold"
                      role="status"></div>
                  </td>
                </tr>
              ) : pagination.paginatedData.length > 0 ? (
                pagination.paginatedData.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 fw-bold text-muted">
                      {(pagination.currentPage - 1) * 10 + (index + 1)}
                    </td>
                    <td className="fw-bold text-navy">{item.title}</td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm bg-light border-0 shadow-sm"
                          onClick={() => handleEdit(item)}
                          style={{
                            borderRadius: "8px",
                            width: "35px",
                            height: "35px",
                          }}>
                          <i className="bi bi-pencil text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm bg-light border-0 shadow-sm"
                          onClick={() => deleteItem(item._id)}
                          style={{
                            borderRadius: "8px",
                            width: "35px",
                            height: "35px",
                          }}>
                          <i className="bi bi-trash text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination {...pagination} />

      {/* Responsive Modal */}
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
                <h5 className="fw-bold text-navy m-0">
                  {editId ? "Update Category" : "New Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Category Title
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-2 shadow-none"
                      style={{ borderRadius: "12px" }}
                      placeholder="e.g. Technology"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Responsive Modal Footer with Custom Buttons */}
                <div className="modal-footer border-0 p-4 pt-0">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6 p-0 pe-1">
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={handleCloseModal}>
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

export default BlogCategories;
