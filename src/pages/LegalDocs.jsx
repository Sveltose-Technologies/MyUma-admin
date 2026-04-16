import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
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
  const [activeTab, setActiveTab] = useState("tc"); // 'tc' or 'pp'

  // CRUD Hooks
  const tcCrud = useCrud(TC_METHODS);
  const tcPagination = usePagination(tcCrud.data, 5);

  const ppCrud = useCrud(PP_METHODS);
  const ppPagination = usePagination(ppCrud.data, 5);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    tcCrud.fetchAll();
    ppCrud.fetchAll();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = {
      webLink: e.target.webLink.value,
      email: e.target.email.value,
      content: e.target.content.value,
    };

    const currentCrud = activeTab === "tc" ? tcCrud : ppCrud;

    const success = editData
      ? await currentCrud.updateItem(editData._id, formData)
      : await currentCrud.addItem(formData);

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
      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Legal Documentation</h4>
        <p className="text-muted small">
          Manage your website's Terms & Conditions and Privacy Policy content
        </p>
      </div>

      {/* Tabs Navigation (Same style as Home Page) */}
      <ul className="nav nav-pills mb-4 gap-2 bg-white p-2 rounded-4 shadow-sm d-inline-flex border">
        <li className="nav-item">
          <button
            className={`nav-link border-0 px-4 fw-bold ${activeTab === "tc" ? "active shadow-sm" : "text-muted"}`}
            style={
              activeTab === "tc"
                ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                : {}
            }
            onClick={() => setActiveTab("tc")}>
            <i className="bi bi-file-earmark-text me-2"></i>Terms & Conditions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 px-4 fw-bold ${activeTab === "pp" ? "active shadow-sm" : "text-muted"}`}
            style={
              activeTab === "pp"
                ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                : {}
            }
            onClick={() => setActiveTab("pp")}>
            <i className="bi bi-shield-lock me-2"></i>Privacy Policy
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        <div className="animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-navy m-0">
              {activeTab === "tc"
                ? "Terms & Conditions List"
                : "Privacy Policy List"}
            </h5>
            <CustomButton onClick={() => openModal()}>
              + Add {activeTab === "tc" ? "Terms" : "Policy"}
            </CustomButton>
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
                  {(activeTab === "tc"
                    ? tcPagination
                    : ppPagination
                  ).paginatedData.map((item, i) => (
                    <tr key={item._id}>
                      <td className="px-4">{i + 1}</td>
                      <td className="fw-bold">{item.email}</td>
                      <td className="small text-primary">{item.webLink}</td>
                      <td
                        className="small text-muted text-truncate"
                        style={{ maxWidth: "250px" }}>
                        {item.content}
                      </td>
                      <td className="text-end px-4">
                        <button
                          className="btn btn-sm btn-light border-0 me-2"
                          onClick={() => openModal(item)}>
                          <i className="bi bi-pencil-square text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border-0"
                          onClick={() =>
                            (activeTab === "tc" ? tcCrud : ppCrud).deleteItem(
                              item._id,
                            )
                          }>
                          <i className="bi bi-trash3 text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === "tc" ? tcCrud : ppCrud).data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination {...(activeTab === "tc" ? tcPagination : ppPagination)} />
        </div>
      </div>

      {/* Shared Modal (Same style as Home Page) */}
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
                  {editData ? "Update" : "New"}{" "}
                  {activeTab === "tc" ? "Terms" : "Policy"}
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
                        CONTACT EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-2 shadow-none"
                        defaultValue={editData?.email || ""}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold text-muted">
                        WEB LINK
                      </label>
                      <input
                        type="url"
                        name="webLink"
                        className="form-control border-2 shadow-none"
                        defaultValue={editData?.webLink || ""}
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="small fw-bold text-muted">
                        CONTENT
                      </label>
                      <textarea
                        name="content"
                        className="form-control border-2 shadow-none"
                        defaultValue={editData?.content || ""}
                        rows="6"
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
                        loading={
                          activeTab === "tc" ? tcCrud.loading : ppCrud.loading
                        }
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
