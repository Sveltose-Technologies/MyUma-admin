import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import TextEditor from "../components/common/TextEditor";
import {
  getAllTermsApi,
  addTermsApi,
  updateTermsApi,
  deleteTermsApi,
  getAllPrivacyApi,
  addPrivacyApi,
  updatePrivacyApi,
  deletePrivacyApi,
} from "../services/authService";

const TC_METHODS = {
  getAll: getAllTermsApi,
  add: addTermsApi,
  update: updateTermsApi,
  delete: deleteTermsApi,
};
const PP_METHODS = {
  getAll: getAllPrivacyApi,
  add: addPrivacyApi,
  update: updatePrivacyApi,
  delete: deletePrivacyApi,
};

const LegalDocs = () => {
  const [activeTab, setActiveTab] = useState("tc");

  const tcCrud = useCrud(TC_METHODS);
  const tcPagination = usePagination(tcCrud.data, 5);
  const ppCrud = useCrud(PP_METHODS);
  const ppPagination = usePagination(ppCrud.data, 5);

  const currentPagination = activeTab === "tc" ? tcPagination : ppPagination;
  const currentCrud = activeTab === "tc" ? tcCrud : ppCrud;

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    webLink: "",
    content: "",
  });

  useEffect(() => {
    tcCrud.fetchAll();
    ppCrud.fetchAll();
  }, []);

  const getPreviewText = (html) => {
    const plainText = html.replace(/<[^>]*>/g, " ").trim();
    const words = plainText.split(/\s+/);
    return words.length > 5 ? words.slice(0, 5).join(" ") + "..." : plainText;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editId
      ? await currentCrud.updateItem(editId, formData)
      : await currentCrud.addItem(formData);
    if (success) setShowModal(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        email: item.email || "",
        webLink: item.webLink || "",
        content: item.content || "",
      });
    } else {
      setEditId(null);
      setFormData({ email: "", webLink: "", content: "" });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Legal Documentation</h4>
        <p className="text-muted small">
          Manage website Terms & Privacy Policy
        </p>
      </div>

      <ul className="nav nav-pills mb-4 gap-2 bg-white p-2 rounded-4 shadow-sm d-inline-flex border">
        <li className="nav-item">
          <button
            className={`nav-link border-0 px-4 fw-bold ${activeTab === "tc" ? "active" : "text-muted"}`}
            style={
              activeTab === "tc"
                ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                : {}
            }
            onClick={() => setActiveTab("tc")}>
            Terms
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 px-4 fw-bold ${activeTab === "pp" ? "active" : "text-muted"}`}
            style={
              activeTab === "pp"
                ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                : {}
            }
            onClick={() => setActiveTab("pp")}>
            Privacy
          </button>
        </li>
      </ul>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
        <h5 className="fw-bold text-navy m-0">
          {activeTab === "tc" ? "Terms" : "Privacy"} List
        </h5>
        <CustomButton onClick={() => openModal()}>+ Add New</CustomButton>
      </div>

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
              {currentPagination.paginatedData.map((item, i) => (
                <tr key={item._id}>
                  <td className="px-4">
                    {(currentPagination.currentPage - 1) * 5 + (i + 1)}
                  </td>
                  <td className="fw-bold text-navy">{item.email}</td>
                  <td className="small text-info">{item.webLink}</td>
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
                      onClick={() => currentCrud.deleteItem(item._id)}>
                      <i className="bi bi-trash3 text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination {...currentPagination} />

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
                  {editId ? "Update" : "New"}{" "}
                  {activeTab === "tc" ? "Terms" : "Policy"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        className="form-control border-2 shadow-none"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">
                        WEB LINK
                      </label>
                      <input
                        type="url"
                        className="form-control border-2 shadow-none"
                        value={formData.webLink}
                        onChange={(e) =>
                          setFormData({ ...formData, webLink: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">
                        CONTENT
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
                        loading={currentCrud.loading}
                        className="w-100">
                        Save
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

export default LegalDocs;
