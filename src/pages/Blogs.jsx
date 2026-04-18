import React, { useEffect, useState, useCallback } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import { useUtils } from "../hook/useUtils";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import TextEditor from "../components/common/TextEditor";
import {
  getAllBlogsApi,
  addBlogApi,
  updateBlogApi,
  deleteBlogApi,
  getAllBlogCategoriesApi,
} from "../services/authService";

const BLOG_METHODS = {
  getAll: getAllBlogsApi,
  add: addBlogApi,
  update: updateBlogApi,
  delete: deleteBlogApi,
};

const Blogs = () => {
  const { getImgURL } = useUtils();
  const {
    data: blogs,
    loading,
    fetchAll,
    addItem,
    updateItem,
    deleteItem,
  } = useCrud(BLOG_METHODS);
  const pagination = usePagination(blogs, 8);

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    blogCategoryId: "",
    image: null,
  });

  // FIXED: Improved function to remove &nbsp; and HTML tags properly
  const getPreviewText = (html) => {
    if (!html) return "";
    // Create a temporary element to decode HTML entities (like &nbsp;)
    const doc = new DOMParser().parseFromString(html, "text/html");
    const plainText = doc.body.textContent || "";

    // Clean extra whitespace and split into words
    const words = plainText.trim().split(/\s+/);
    return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : plainText;
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getAllBlogCategoriesApi();
      const catData =
        res?.blogCategories ||
        res?.categories ||
        res?.data ||
        (Array.isArray(res) ? res : []);
      setCategories(catData);
    } catch (err) {
      console.error("Failed to fetch blog categories", err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    fetchCategories();
  }, [fetchAll, fetchCategories]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setPreview(null);
    setFormData({
      title: "",
      description: "",
      blogCategoryId: "",
      image: null,
    });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      blogCategoryId: item.blogCategoryId?._id || item.blogCategoryId || "",
      image: null,
    });
    setPreview(getImgURL(item.image));
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("blogCategoryId", formData.blogCategoryId);
    if (formData.image instanceof File) data.append("image", formData.image);

    const success = editId
      ? await updateItem(editId, data)
      : await addItem(data);
    if (success) handleCloseModal();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold m-0 text-navy">Blogs</h4>
          <p className="text-muted small m-0">Manage blog posts and content</p>
        </div>
        <CustomButton onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i> Create Blog
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          {/* Removed text-nowrap from table to allow wrapping for long titles/descriptions */}
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light small fw-bold text-uppercase">
              <tr>
                <th className="px-4">#</th>
                <th>Image</th>
                <th style={{ minWidth: "150px" }}>Title</th>
                <th>Category</th>
                <th style={{ minWidth: "180px" }}>Description</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-4 text-muted">
                    {(pagination.currentPage - 1) * 8 + (index + 1)}
                  </td>
                  <td>
                    <img
                      src={getImgURL(item.image)}
                      alt=""
                      className="rounded border shadow-sm"
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td className="fw-bold text-navy small">{item.title}</td>
                  <td>
                    <span className="badge bg-light text-dark border fw-normal px-2 py-1">
                      {item.blogCategoryId?.title || "No Category"}
                    </span>
                  </td>
                  {/* CLEAN 4 WORD DESCRIPTION PREVIEW */}
                  <td className="small text-muted">
                    {getPreviewText(item.description)}
                  </td>
                  <td className="text-end px-4 text-nowrap">
                    <button
                      className="btn btn-sm btn-light border me-2 shadow-sm"
                      onClick={() => handleEdit(item)}>
                      <i className="bi bi-pencil text-info"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-light border shadow-sm"
                      onClick={() => deleteItem(item._id)}>
                      <i className="bi bi-trash text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3">
        <Pagination {...pagination} />
      </div>

      {/* Blog Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold m-0 text-navy">
                  {editId ? "Update Blog" : "Create New Blog"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-4 text-center">
                      <div
                        className="border rounded-3 bg-light mb-2 overflow-hidden d-flex align-items-center justify-content-center"
                        style={{ height: "180px" }}>
                        {preview ? (
                          <img
                            src={preview}
                            alt=""
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <span className="text-muted small">Select Image</span>
                        )}
                      </div>
                      <input
                        type="file"
                        className="form-control form-control-sm border-2 shadow-none"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData({ ...formData, image: file });
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-8">
                      <div className="mb-3">
                        <label className="small fw-bold text-muted text-uppercase mb-2">
                          Blog Title
                        </label>
                        <input
                          type="text"
                          className="form-control border-2 shadow-none rounded-3"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="small fw-bold text-muted text-uppercase mb-2">
                          Category
                        </label>
                        <select
                          className="form-select border-2 shadow-none rounded-3"
                          value={formData.blogCategoryId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              blogCategoryId: e.target.value,
                            })
                          }
                          required>
                          <option value="">-- Select Category --</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-0">
                        <label className="small fw-bold text-muted text-uppercase mb-2">
                          Description
                        </label>
                        <TextEditor
                          value={formData.description}
                          onChange={(val) =>
                            setFormData({ ...formData, description: val })
                          }
                          placeholder="Write blog content here..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0 mt-3">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6">
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={handleCloseModal}>
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

export default Blogs;
