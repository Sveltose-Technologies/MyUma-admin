import React, { useEffect, useState, useMemo } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllSubCategoriesApi,
  addSubCategoryApi,
  updateSubCategoryApi,
  deleteSubCategoryApi,
  getAllCategoriesApi,
} from "../services/authService";

const SUBCATEGORY_API_CONFIG = {
  getAll: getAllSubCategoriesApi,
  add: addSubCategoryApi,
  update: updateSubCategoryApi,
  delete: deleteSubCategoryApi,
};

const SubCategories = () => {
  // 1. Hook for CRUD operations (Fetches the nested JSON)
  const {
    data: rawData,
    loading,
    fetchAll,
    addItem,
    updateItem,
    deleteItem,
  } = useCrud(SUBCATEGORY_API_CONFIG);

  // 2. Local states for Modal and Parent Category Dropdown
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // 3. FLATTENING LOGIC: Converts nested JSON to a flat list for the table
  const flattenedSubCategories = useMemo(() => {
    const list = [];
    if (Array.isArray(rawData)) {
      rawData.forEach((group) => {
        // If this category has subcategories, map them out
        if (group.subcategories && Array.isArray(group.subcategories)) {
          group.subcategories.forEach((sub) => {
            list.push({
              _id: sub._id,
              subcategoryName: sub.subcategoryName,
              // Pull the name from the parent group object
              parentCategoryName:
                group.categoryId?.name || group.categoryId?.title || "N/A",
              parentCategoryId: group.categoryId?._id,
            });
          });
        }
      });
    }
    return list;
  }, [rawData]);

  // 4. Hook for Pagination
  const pagination = usePagination(flattenedSubCategories, 10);

  useEffect(() => {
    fetchAll();
    loadParentCategories();
  }, [fetchAll]);

  // Load Categories for the Dropdown
  const loadParentCategories = async () => {
    try {
      const res = await getAllCategoriesApi();
      setCategories(res.categories || res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please select a parent category");
      return;
    }

    const payload = { categoryId, subcategoryName };
    const success = editId
      ? await updateItem(editId, payload)
      : await addItem(payload);

    if (success) handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setSubcategoryName("");
    setCategoryId("");
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setSubcategoryName(item.subcategoryName);
    setCategoryId(item.parentCategoryId); // Use the ID we extracted during flattening
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
            Sub-Categories
          </h4>
          <p className="text-muted small m-0">
            Manage nested website sub-categories
          </p>
        </div>

        <CustomButton
          onClick={() => setShowModal(true)}
          className="px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i> Add Sub-Category
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
                <th className="py-3">Sub-Category Name</th>
                <th className="py-3 text-center">Parent Category</th>
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
                    {item.subcategoryName}
                  </td>
                  <td className="text-center">
                    <span
                      className="badge border fw-bold px-3 py-2 rounded-pill shadow-sm"
                      style={{
                        backgroundColor: "#f8f9fa",
                        color: "var(--navy)",
                        fontSize: "12px",
                        border: "1px solid #dee2e6 !important",
                      }}>
                      {item.parentCategoryName}
                    </span>
                  </td>
                  <td className="text-end px-4">
                    <button
                      className="btn btn-sm bg-light border-0 me-2 shadow-sm"
                      onClick={() => handleEdit(item)}
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
          {!loading && flattenedSubCategories.length === 0 && (
            <div className="text-center p-5 text-muted">
              No sub-categories found.
            </div>
          )}
        </div>
      </div>

      <Pagination {...pagination} />

      {/* Modal Section */}
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
                  {editId ? "Edit Sub-Category" : "New Sub-Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  {/* Category Dropdown */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Parent Category
                    </label>
                    <select
                      className="form-select form-control-lg border-2 shadow-none"
                      style={{ borderRadius: "12px", fontSize: "15px" }}
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required>
                      <option value="">Select Parent Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name || cat.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub-Category Name Input */}
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Sub-Category Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-2 shadow-none"
                      style={{ borderRadius: "12px" }}
                      value={subcategoryName}
                      onChange={(e) => setSubcategoryName(e.target.value)}
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
                        onClick={handleCloseModal}>
                        Cancel
                      </CustomButton>
                    </div>
                    <div className="col-6 p-0 ps-1">
                      <CustomButton
                        type="submit"
                        variant="gold"
                        className="w-100"
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

export default SubCategories;
