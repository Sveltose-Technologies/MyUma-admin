import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllCategoriesApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../services/authService";

const CATEGORY_API_CONFIG = {
  getAll: getAllCategoriesApi,
  add: addCategoryApi,
  update: updateCategoryApi,
  delete: deleteCategoryApi,
};

const Categories = () => {
  const {
    data: categories,
    loading,
    fetchAll,
    addItem,
    updateItem,
    deleteItem,
  } = useCrud(CATEGORY_API_CONFIG);
  const pagination = usePagination(categories, 10);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, { name })
      : await addItem({ name });
    if (success) handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setName("");
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
            Categories
          </h4>
          <p className="text-muted small m-0">Manage website categories</p>
        </div>

        {/* Reusable Button for Header */}
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
            <thead style={{ backgroundColor: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3" style={{ width: "80px" }}>
                  #
                </th>
                <th className="py-3">Category Name</th>
                <th className="text-end px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-4 fw-bold text-muted">
                    {(pagination.currentPage - 1) * 10 + (index + 1)}
                  </td>
                  <td className="fw-bold" style={{ color: "var(--navy)" }}>
                    {item.name}
                  </td>
                  <td className="text-end px-4">
                    <button
                      className="btn btn-sm bg-light border-0 me-2 shadow-sm"
                      onClick={() => {
                        setEditId(item._id);
                        setName(item.name);
                        setShowModal(true);
                      }}
                      style={{ borderRadius: "8px" }}>
                      <i
                        className="bi bi-pencil-square"
                        style={{ color: "var(--navy)" }}></i>
                    </button>
                    <button
                      className="btn btn-sm bg-light border-0 shadow-sm"
                      onClick={() => deleteItem(item._id)}
                      style={{ borderRadius: "8px" }}>
                      <i className="bi bi-trash3 text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <h5 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
                  {editId ? "Edit Category" : "New Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-2 shadow-none"
                    style={{ borderRadius: "12px" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6 p-0 pe-1">
                      {/* Reusable Cancel Button */}
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={handleCloseModal}>
                        Cancel
                      </CustomButton>
                    </div>
                    <div className="col-6 p-0 ps-1">
                      {/* Reusable Submit/Save Button */}
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

export default Categories;
