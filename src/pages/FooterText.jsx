import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import TextEditor from "../components/common/TextEditor";
import {
  getAllFooterApi,
  addFooterApi,
  updateFooterApi,
  deleteFooterApi,
} from "../services/authService";

const FOOTER_METHODS = {
  getAll: getAllFooterApi,
  add: addFooterApi,
  update: updateFooterApi,
  delete: deleteFooterApi,
};

const FooterText = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(FOOTER_METHODS);
  const pagination = usePagination(data, 5);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    content: "",
    address: "",
    email: "",
    contactNo: "",
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Clean 5-word preview helper
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
        content: item.content || "",
        address: item.address || "",
        email: item.email || "",
        contactNo: item.contactNo || "",
      });
    } else {
      setEditId(null);
      setFormData({ content: "", address: "", email: "", contactNo: "" });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Header Section */}
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Footer Management</h4>
        <p className="text-muted small">
          Manage website footer details like contact info and address
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy m-0">Footer Information</h5>
        <CustomButton onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add Footer Info
        </CustomButton>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr className="small text-uppercase">
                <th className="px-4 py-3">#</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Content Preview</th>
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
                      {(pagination.currentPage - 1) * 5 + (i + 1)}
                    </td>
                    <td className="fw-bold text-navy">{item.email}</td>
                    <td className="small">{item.contactNo}</td>
                    <td className="small text-muted">{item.address}</td>
                    <td className="small text-muted">
                      {getPreviewText(item.content)}
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
      <Pagination {...pagination} />

      {/* Footer Modal */}
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
                  {editId ? "Update Footer" : "New Footer Entry"}
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
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Physical Address
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
                        Footer Content (Description)
                      </label>
                      <TextEditor
                        value={formData.content}
                        onChange={(val) =>
                          setFormData({ ...formData, content: val })
                        }
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

export default FooterText;
