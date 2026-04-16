import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { useUtils } from "../hook/useUtils";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllLogosApi,
  addLogoApi,
  updateLogoApi,
  deleteLogoApi,
  getAllHomeBannersApi,
  addHomeBannerApi,
  updateHomeBannerApi,
  deleteHomeBannerApi,
} from "../services/authService";

// API Configs defined outside to prevent infinite loops
const LOGO_METHODS = {
  getAll: getAllLogosApi,
  add: addLogoApi,
  update: updateLogoApi,
  delete: deleteLogoApi,
};

const BANNER_METHODS = {
  getAll: getAllHomeBannersApi,
  add: addHomeBannerApi,
  update: updateHomeBannerApi,
  delete: deleteHomeBannerApi,
};

const Home = () => {
  const { getImgURL, formatDate } = useUtils();
  const [activeTab, setActiveTab] = useState("logos"); // 'logos' or 'banners'

  // --- LOGO CRUD & PAGINATION ---
  const logoCrud = useCrud(LOGO_METHODS);
  const logoPagination = usePagination(logoCrud.data, 5); // 5 per page
  const [logoModal, setLogoModal] = useState(false);
  const [editLogoId, setEditLogoId] = useState(null);

  // --- BANNER CRUD & PAGINATION ---
  const bannerCrud = useCrud(BANNER_METHODS);
  const bannerPagination = usePagination(bannerCrud.data, 5); // 5 per page
  const [bannerModal, setBannerModal] = useState(false);
  const [editBannerData, setEditBannerData] = useState(null);

  useEffect(() => {
    logoCrud.fetchAll();
    bannerCrud.fetchAll();
  }, []);

  // --- HANDLERS ---
  const handleLogoSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = editLogoId
      ? await logoCrud.updateItem(editLogoId, formData)
      : await logoCrud.addItem(formData);
    if (success) {
      setLogoModal(false);
      setEditLogoId(null);
    }
  };

  const handleBannerSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = editBannerData
      ? await bannerCrud.updateItem(editBannerData._id, formData)
      : await bannerCrud.addItem(formData);
    if (success) {
      setBannerModal(false);
      setEditBannerData(null);
    }
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Home Page Management</h4>
        <p className="text-muted small">
          Update your website's Branding (Logos) and Slider (Banners)
        </p>
      </div>

      {/* Tabs Navigation */}
      <ul className="nav nav-pills mb-4 gap-2 bg-white p-2 rounded-4 shadow-sm d-inline-flex border">
        <li className="nav-item">
          <button
            className={`nav-link border-0 px-4 fw-bold ${activeTab === "logos" ? "active shadow-sm" : "text-muted"}`}
            style={
              activeTab === "logos"
                ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                : {}
            }
            onClick={() => setActiveTab("logos")}>
            <i className="bi bi-shield-check me-2"></i>Logos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 px-4 fw-bold ${activeTab === "banners" ? "active shadow-sm" : "text-muted"}`}
            style={
              activeTab === "banners"
                ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                : {}
            }
            onClick={() => setActiveTab("banners")}>
            <i className="bi bi-image me-2"></i>Home Banners
          </button>
        </li>
      </ul>

      {/* TABS CONTENT */}
      <div className="tab-content">
        {/* LOGO TAB */}
        {activeTab === "logos" && (
          <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-navy m-0">Logo List</h5>
             
            </div>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 text-nowrap">
                  <thead style={{ background: "var(--navy)", color: "white" }}>
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th>Preview</th>
                      {/* <th>Reference ID</th> */}
                      <th className="text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logoPagination.paginatedData.map((item, i) => (
                      <tr key={item._id}>
                        <td className="px-4">{i + 1}</td>
                        <td>
                          <img
                            src={getImgURL(item.logo)}
                            alt="Logo"
                            className="rounded p-1 bg-light border"
                            style={{ height: "40px" }}
                          />
                        </td>
                        <td className="text-end px-4">
                          <button
                            className="btn btn-sm btn-light border-0 me-2"
                            onClick={() => {
                              setEditLogoId(item._id);
                              setLogoModal(true);
                            }}>
                            <i className="bi bi-pencil-square text-primary"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light border-0"
                            onClick={() => logoCrud.deleteItem(item._id)}>
                            <i className="bi bi-trash3 text-danger"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination {...logoPagination} />
          </div>
        )}

        {/* BANNER TAB */}
        {activeTab === "banners" && (
          <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-navy m-0">Home Banners</h5>
              <CustomButton
                onClick={() => {
                  setEditBannerData(null);
                  setBannerModal(true);
                }}>
                + Add Banner
              </CustomButton>
            </div>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 text-nowrap">
                  <thead style={{ background: "var(--navy)", color: "white" }}>
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th>Banner</th>
                      <th>Content</th>
                      {/* <th>Created</th> */}
                      <th className="text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannerPagination.paginatedData.map((item, i) => (
                      <tr key={item._id}>
                        <td className="px-4">{i + 1}</td>
                        <td>
                          <img
                            src={getImgURL(item.bannerImage)}
                            alt="Banner"
                            className="rounded shadow-sm"
                            style={{
                              width: "100px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td className="small fw-bold">
                          {item.contant || "N/A"}
                        </td>
                        {/* <td className="small text-muted">
                          {formatDate(item.createdAt)}
                        </td> */}
                        <td className="text-end px-4">
                          <button
                            className="btn btn-sm btn-light border-0 me-2"
                            onClick={() => {
                              setEditBannerData(item);
                              setBannerModal(true);
                            }}>
                            <i className="bi bi-pencil-square text-primary"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-light border-0"
                            onClick={() => bannerCrud.deleteItem(item._id)}>
                            <i className="bi bi-trash3 text-danger"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination {...bannerPagination} />
          </div>
        )}
      </div>

      {/* --- LOGO MODAL --- */}
      {logoModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}>
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold text-navy m-0">
                  {editLogoId ? "Update Logo" : "New Logo"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setLogoModal(false)}></button>
              </div>
              <form onSubmit={handleLogoSave}>
                <div className="modal-body p-4">
                  <label className="small fw-bold text-muted">LOGO IMAGE</label>
                  <input
                    type="file"
                    name="logo"
                    className="form-control border-2 shadow-none"
                    required={!editLogoId}
                    accept="image/*"
                  />
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6">
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={() => setLogoModal(false)}>
                        Cancel
                      </CustomButton>
                    </div>
                    <div className="col-6">
                      <CustomButton
                        type="submit"
                        loading={logoCrud.loading}
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

      {/* --- BANNER MODAL --- */}
      {bannerModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}>
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold text-navy m-0">
                  {editBannerData ? "Update Banner" : "New Banner"}
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setBannerModal(false)}></button>
              </div>
              <form onSubmit={handleBannerSave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="small fw-bold text-muted">
                      BANNER IMAGE
                    </label>
                    <input
                      type="file"
                      name="bannerImage"
                      className="form-control border-2 shadow-none"
                      required={!editBannerData}
                      accept="image/*"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted">
                      BANNER CONTENT
                    </label>
                    <textarea
                      name="contant"
                      className="form-control border-2 shadow-none"
                      defaultValue={editBannerData?.contant || ""}
                      rows="3"
                      required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <div className="row w-100 g-2 m-0">
                    <div className="col-6">
                      <CustomButton
                        variant="cancel"
                        className="w-100"
                        onClick={() => setBannerModal(false)}>
                        Cancel
                      </CustomButton>
                    </div>
                    <div className="col-6">
                      <CustomButton
                        type="submit"
                        loading={bannerCrud.loading}
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

export default Home;
