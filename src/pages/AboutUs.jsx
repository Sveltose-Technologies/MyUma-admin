import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllAboutUsApi,
  addAboutUsApi,
  updateAboutUsApi,
  deleteAboutUsApi,
} from "../services/authService";

const ABOUT_METHODS = {
  getAll: getAllAboutUsApi,
  add: addAboutUsApi,
  update: updateAboutUsApi,
  delete: deleteAboutUsApi,
};

const AboutUs = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(ABOUT_METHODS);
  const pagination = usePagination(data, 5);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = {
      webLink: e.target.webLink.value,
      email: e.target.email.value,
      content: e.target.content.value,
    };

    const success = editData
      ? await updateItem(editData._id, formData)
      : await addItem(formData);

    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const openModal = (item = null) => {
    setEditData(item);
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Header Section */}
      <div className="mb-4">
        <h4 className="fw-bold text-navy">About Us Management</h4>
        <p className="text-muted small">
          Edit the company profile, contact email, and website links
        </p>
      </div>

      {/* Action Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy m-0">About Content</h5>
        <CustomButton onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add About Info
        </CustomButton>
      </div>

      {/* Table Section (Consistent with Home/LegalDocs) */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3">#</th>
                <th>Email</th>
                <th>Web Link</th>
                <th>Content Preview</th>
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
                      {(pagination.currentPage - 1) * 5 + (i + 1)}
                    </td>
                    <td className="fw-bold text-navy">{item.email}</td>
                    <td className="small text-primary">{item.webLink}</td>
                    <td
                      className="small text-muted text-truncate"
                      style={{ maxWidth: "300px" }}>
                      {item.content}
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
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No about info found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination {...pagination} />

      {/* AboutUs Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}>
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold text-navy m-0">
                  {editData ? "Update About Us" : "New About Entry"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold text-muted">
                        SUPPORT EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-2 shadow-none"
                        defaultValue={editData?.email || ""}
                        placeholder="e.g. info@company.com"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold text-muted">
                        WEBSITE LINK
                      </label>
                      <input
                        type="url"
                        name="webLink"
                        className="form-control border-2 shadow-none"
                        defaultValue={editData?.webLink || ""}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted">
                        ABOUT CONTENT
                      </label>
                      <textarea
                        name="content"
                        className="form-control border-2 shadow-none"
                        defaultValue={editData?.content || ""}
                        rows="8"
                        placeholder="Describe your company here..."
                        required></textarea>
                    </div>
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
                        Save Changes
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

export default AboutUs;
