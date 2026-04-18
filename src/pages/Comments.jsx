import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton"; // Path from your code
import {
  getAllCommentsApi,
  addCommentApi,
  updateCommentApi,
  deleteCommentApi,
  getAllBlogsApi,
} from "../services/authService";

const COMMENT_METHODS = {
  getAll: getAllCommentsApi,
  add: addCommentApi,
  update: updateCommentApi,
  delete: deleteCommentApi,
};

const Comments = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(COMMENT_METHODS);
  const pagination = usePagination(data, 10);

  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    blogId: "",
    comment: "",
  });

  useEffect(() => {
    fetchAll();
    fetchBlogs();
  }, [fetchAll]);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogsApi();
      setBlogs(res?.blogs || res?.data || []);
    } catch (err) {
      console.error("Failed to fetch blogs for dropdown");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editData
      ? await updateItem(editData._id, formData)
      : await addItem(formData);

    if (success) {
      setShowModal(false);
      setEditData(null);
      setFormData({ blogId: "", comment: "" });
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditData(item);
      setFormData({
        blogId: item.blogId?._id || item.blogId || "",
        comment: item.comment || "",
      });
    } else {
      setEditData(null);
      setFormData({ blogId: "", comment: "" });
    }
    setShowModal(true);
  };

  // --- FIX FOR UNKNOWN BLOG TITLE ---
  const getBlogTitle = (blogIdField) => {
    // Check if blogId is an object or a string (from your console, it is a string)
    const id = blogIdField?._id || blogIdField;
    const found = blogs.find((b) => b._id === id);
    return found ? found.title : "Unknown Blog";
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Comment Management</h4>
        <p className="text-muted small">
          Monitor and manage user comments on blog posts
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy m-0">All Comments</h5>
        {/* Swapped to CustomButton */}
        <CustomButton onClick={() => openModal()}>
          <i className="bi bi-chat-left-text me-2"></i> Add Comment
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3">#</th>
                <th>Blog Title</th>
                <th>Comment</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-gold"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td
                      className="fw-bold text-navy"
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      {/* FIXED: Using the lookup function */}
                      {getBlogTitle(item.blogId)}
                    </td>
                    <td
                      className="small text-muted text-wrap"
                      style={{ maxWidth: "400px" }}>
                      {item.comment}
                    </td>
                    <td className="text-end px-4">
                      <button
                        className="btn btn-sm btn-light border-0 me-2 shadow-sm"
                        onClick={() => openModal(item)}>
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

      {/* Comment Modal */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 1060, // Higher than sidebar
            }}>
            <div className="modal-dialog modal-dialog-centered px-3">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="fw-bold text-navy m-0">
                    {editData ? "Edit Comment" : "New Comment"}
                  </h5>
                  <button
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="small fw-bold text-muted">
                        SELECT BLOG
                      </label>
                      <select
                        className="form-select border-2 shadow-none"
                        value={formData.blogId}
                        onChange={(e) =>
                          setFormData({ ...formData, blogId: e.target.value })
                        }
                        required>
                        <option value="">-- Choose a Blog Post --</option>
                        {blogs.map((blog) => (
                          <option key={blog._id} value={blog._id}>
                            {blog.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-0">
                      <label className="small fw-bold text-muted">
                        COMMENT CONTENT
                      </label>
                      <textarea
                        className="form-control border-2 shadow-none"
                        rows="5"
                        value={formData.comment}
                        onChange={(e) =>
                          setFormData({ ...formData, comment: e.target.value })
                        }
                        placeholder="Write the comment here..."
                        required></textarea>
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
                          Send Comment
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Backdrop ensures it stays above sidebar */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}></div>
        </>
      )}
    </div>
  );
};

export default Comments;
