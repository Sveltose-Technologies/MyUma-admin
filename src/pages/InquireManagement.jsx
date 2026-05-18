import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import { useUtils } from "../hook/useUtils";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getInquiriesApi,
  sendInquireApi,
  updateInquireApi,
  deleteInquireApi,
} from "../services/authService";

const INQUIRE_CONFIG = {
  getAll: getInquiriesApi,
  add: sendInquireApi,
  update: updateInquireApi,
  delete: deleteInquireApi,
};

const InquireManagement = () => {
  const { formatDate } = useUtils();
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    itemId: "",
    fullName: "",
    email: "",
    phoneNo: "",
    comment: "",
  });

  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(INQUIRE_CONFIG);
  const pagination = usePagination(data, 10);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
    setViewData(null);
    setFormData({
      itemId: "",
      fullName: "",
      email: "",
      phoneNo: "",
      comment: "",
    });
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setFormData({
      itemId: item.itemId?._id || item.itemId || "",
      fullName: item.fullName,
      email: item.email,
      phoneNo: item.phoneNo,
      comment: item.comment,
    });
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-4">
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold m-0 text-navy">Inquire List</h4>
          <p className="text-muted small m-0">
            Detailed list of all customer leads
          </p>
        </div>
    
      </div>

      {/* TABLE SECTION */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="py-3">Name</th>
                <th className="py-3">Email Address</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Inquired Item</th>
                <th className="py-3">Date</th>
                <th className="py-3" style={{ minWidth: "200px" }}>
                  Comment
                </th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </td>
                </tr>
              ) : pagination.paginatedData.length > 0 ? (
                pagination.paginatedData.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="fw-bold text-navy">{item.fullName}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNo}</td>
                    <td>
                      <span className="badge bg-light text-black border">
                        {item.itemId?.title || "N/A"}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                        title={item.comment}>
                        {item.comment}
                      </div>
                    </td>
                    <td className="text-center px-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm bg-light border shadow-sm"
                          onClick={() => setViewData(item)}>
                          <i className="bi bi-eye text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm bg-light border shadow-sm"
                          onClick={() => openEdit(item)}>
                          <i className="bi bi-pencil-square text-navy"></i>
                        </button>
                        <button
                          className="btn btn-sm bg-light border shadow-sm"
                          onClick={() => deleteItem(item._id)}>
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination {...pagination} />

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4">
                <h5 className="fw-bold m-0 text-navy">
                  {editId ? "Update Inquiry Info" : "Add New Inquiry"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4 pt-0">
                  <div className="mb-3">
                    <label className="small fw-bold text-muted text-uppercase mb-1">
                      Property / Item MongoDB ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.itemId}
                      onChange={(e) =>
                        setFormData({ ...formData, itemId: e.target.value })
                      }
                      placeholder="e.g. 6a05a339..."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted text-uppercase mb-1">
                      Customer Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="small fw-bold text-muted text-uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="small fw-bold text-muted text-uppercase mb-1">
                        Phone No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phoneNo}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNo: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-0">
                    <label className="small fw-bold text-muted text-uppercase mb-1">
                      Customer Message / Comment
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={handleClose}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-navy rounded-pill px-4 text-white"
                    style={{ backgroundColor: "var(--navy)" }}>
                    {editId ? "Update Record" : "Save Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL (DETAILS) */}
      {viewData && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 p-2 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="fw-bold m-0 text-navy">Lead Details</h5>
                <button
                  className="btn-close shadow-none"
                  onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <div
                  className="p-3 rounded-4 mb-3"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                  }}>
                  <small className="text-muted text-uppercase fw-bold d-block mb-1">
                    Inquired Property
                  </small>
                  <h6 className="fw-bold text-navy mb-1">
                    {viewData.itemId?.title || "N/A"}
                  </h6>
                  <p className="small m-0 text-muted">
                    <i className="bi bi-geo-alt me-1"></i>
                    {viewData.itemId?.address}
                  </p>
                </div>
                <div className="row mb-3 g-3">
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold d-block mb-1">
                      Customer Name
                    </small>
                    <p className="fw-bold m-0 text-navy">{viewData.fullName}</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold d-block mb-1">
                      Contact No
                    </small>
                    <p className="fw-bold m-0 text-navy">{viewData.phoneNo}</p>
                  </div>
                  <div className="col-12">
                    <small className="text-muted text-uppercase fw-bold d-block mb-1">
                      Email Address
                    </small>
                    <p className="fw-bold m-0 text-navy">{viewData.email}</p>
                  </div>
                </div>
                <div
                  className="p-3 rounded-4"
                  style={{ backgroundColor: "var(--navy)", color: "#fff" }}>
                  <small className="opacity-75 text-uppercase fw-bold d-block mb-2">
                    Customer Message
                  </small>
                  <p className="m-0 small" style={{ lineHeight: "1.6" }}>
                    {viewData.comment}
                  </p>
                </div>
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Lead generated on {formatDate(viewData.createdAt)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquireManagement;
