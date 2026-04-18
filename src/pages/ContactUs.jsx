import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import TextEditor from "../components/common/TextEditor";
import {
  getAllContactUsApi,
  addContactUsApi,
  updateContactUsApi,
  deleteContactUsApi,
} from "../services/authService";

const CONTACT_METHODS = {
  getAll: getAllContactUsApi,
  add: addContactUsApi,
  update: updateContactUsApi,
  delete: deleteContactUsApi,
};

const ContactUs = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(CONTACT_METHODS);
  const pagination = usePagination(data, 10);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    address: "",
    message: "",
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Function to display exactly 5 words in the table preview
  const getPreviewText = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const plainText = doc.body.textContent || "";
    const words = plainText.trim().split(/\s+/);
    return words.length > 5 ? words.slice(0, 5).join(" ") + "..." : plainText;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await updateItem(editId, formData)
      : await addItem(formData);
    if (success) setShowModal(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        fullName: item.fullName || "",
        email: item.email || "",
        contactNo: item.contactNo || "",
        address: item.address || "",
        message: item.message || "",
      });
    } else {
      setEditId(null);
      setFormData({
        fullName: "",
        email: "",
        contactNo: "",
        address: "",
        message: "",
      });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Page Heading */}
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Contact Us Management</h4>
        <p className="text-muted small">
          Manage customer inquiries and contact details
        </p>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
        <h5 className="fw-bold text-navy m-0">Inquiry List</h5>
        <CustomButton
          onClick={() => openModal()}
          className="w-100 w-sm-auto shadow-sm">
          <i className="bi bi-person-plus me-2"></i> Add Inquiry
        </CustomButton>
      </div>

      {/* Responsive Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr className="small text-uppercase">
                <th className="px-4 py-3">#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Message Preview</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-gold"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td className="fw-bold text-navy">{item.fullName}</td>
                    <td className="small">{item.email}</td>
                    <td className="small">{item.contactNo}</td>
                    <td className="small text-muted">
                      {getPreviewText(item.message)}
                    </td>
                    <td className="text-end px-4">
                      <button
                        className="btn btn-sm btn-light border-0 me-2 shadow-sm"
                        onClick={() => openModal(item)}>
                        <i className="bi bi-pencil-square text-info"></i>
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
      <div className="mt-3">
        <Pagination {...pagination} />
      </div>

      {/* Inquiry Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
          }}>
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold text-navy m-0">
                  {editId ? "Update Inquiry" : "New Inquiry Entry"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none rounded-3"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control border-2 shadow-none rounded-3"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Contact No
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none rounded-3"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control border-2 shadow-none rounded-3"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Message Content
                      </label>
                      <TextEditor
                        value={formData.message}
                        onChange={(val) =>
                          setFormData({ ...formData, message: val })
                        }
                        placeholder="Type message content here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0 mt-3">
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

export default ContactUs;
