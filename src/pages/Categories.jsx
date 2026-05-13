import React, { useEffect, useState, useRef } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import { useUtils } from "../hook/useUtils"; // Import for getImgURL
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
  const { getImgURL } = useUtils(); // Utility to handle image paths
  const fileInputRef = useRef(null);

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

  // Image States
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

    // Use FormData for Multipart/Form-Data (Image Upload)
    const formData = new FormData();
    formData.append("name", name);
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
    setImageFile(null);
    setPreviewUrl("");
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setName(item.name);
    setPreviewUrl(getImgURL(item.image)); // Show existing image in preview
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
            Manage website categories and icons
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
                  {/* Category Name */}
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

                  {/* Image Upload */}
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
