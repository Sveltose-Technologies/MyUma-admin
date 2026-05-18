import React, { useEffect, useState, useRef } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import { useUtils } from "../hook/useUtils";
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
  const { getImgURL } = useUtils();
  const fileInputRef = useRef(null);

  // 1. Logic: Data is now fetched directly from Backend
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
  const [featured, setFeatured] = useState(false); // Maps to favoriteCategories

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    // 2. Logic: Send the checkbox value as 'favoriteCategories'
    formData.append("favoriteCategories", featured);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const success = editId
      ? await updateItem(editId, formData)
      : await addItem(formData);

    if (success) handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setName("");
    setFeatured(false);
    setImageFile(null);
    setPreviewUrl("");
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setName(item.name);
    // 3. Logic: Read 'favoriteCategories' from the database response
    // Handle both boolean and string "true" from API
    setFeatured(
      item.favoriteCategories === true || item.favoriteCategories === "true",
    );
    setPreviewUrl(getImgURL(item.image));
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
            Categories
          </h4>
          <p className="text-muted small m-0">
            Manage website categories and featured status
          </p>
        </div>

        <CustomButton
          onClick={() => setShowModal(true)}
          className="px-4 shadow-sm">
          <i className="bi bi-plus-lg me-2"></i> Add Category
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="py-3">Image</th>
                <th className="py-3">Category Name</th>
                <th className="py-3">Featured</th>
                <th className="text-end px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-4 fw-bold text-muted">
                    {(pagination.currentPage - 1) * 10 + (index + 1)}
                  </td>
                  <td>
                    <img
                      src={getImgURL(item.image)}
                      alt={item.name}
                      className="rounded border shadow-sm"
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/45x45?text=No+Img")
                      }
                    />
                  </td>
                  <td className="fw-bold" style={{ color: "var(--navy)" }}>
                    {item.name}
                  </td>
                  <td>
                    {/* 4. Logic: Use item.favoriteCategories from API */}
                    {item.favoriteCategories === true ||
                    item.favoriteCategories === "true" ? (
                      <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3">
                        Yes
                      </span>
                    ) : (
                      <span className="badge rounded-pill bg-light text-muted border px-3">
                        No
                      </span>
                    )}
                  </td>
                  <td className="text-end px-4">
                    <button
                      className="btn btn-sm bg-light border-0 me-2 shadow-sm"
                      onClick={() => openEditModal(item)}
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
                  <div className="mb-3">
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

                  {/* Checkbox for favoriteCategories */}
                  <div className="mb-4">
                    <div className="form-check form-switch p-0 d-flex align-items-center gap-3">
                      <label
                        className="form-check-label fw-bold text-muted small text-uppercase m-0"
                        htmlFor="featuredCheck"
                        style={{ cursor: "pointer" }}>
                        Display in Featured
                      </label>
                      <input
                        className="form-check-input shadow-none m-0"
                        type="checkbox"
                        role="switch"
                        id="featuredCheck"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        style={{
                          cursor: "pointer",
                          width: "40px",
                          height: "20px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold text-muted text-uppercase">
                      Category Image
                    </label>
                    <div
                      className="border-2 border-dashed rounded-4 p-3 text-center position-relative bg-light"
                      style={{
                        border: "2px dashed #dee2e6",
                        cursor: "pointer",
                      }}
                      onClick={() => fileInputRef.current.click()}>
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ height: "100px", objectFit: "contain" }}
                          className="rounded"
                        />
                      ) : (
                        <div className="py-3">
                          <i className="bi bi-cloud-arrow-up fs-2 text-muted"></i>
                          <p className="m-0 small text-muted">
                            Click to upload image
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
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
