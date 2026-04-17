import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllPricingApi,
  addPricingApi,
  updatePricingApi,
  deletePricingApi,
} from "../services/authService";

const PRICING_METHODS = {
  getAll: getAllPricingApi,
  add: addPricingApi,
  update: updatePricingApi,
  delete: deletePricingApi,
};

const Pricing = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(PRICING_METHODS);
  const pagination = usePagination(data, 5);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Form state structure matching your nested API
  const [formData, setFormData] = useState({
    bannerText: "",
    basicPlan: { name: "", price: "", features: "" },
    marketplacePlan: { name: "", price: "", features: "" },
    premiumPlan: { name: "", price: "", features: "" },
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handlePlanChange = (plan, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [field]: value },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = editData
      ? await updateItem(editData._id, formData)
      : await addItem(formData);

    if (success) {
      setShowModal(false);
      setEditData(null);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditData(item);
      setFormData({
        bannerText: item.bannerText || "",
        basicPlan: item.basicPlan || { name: "", price: "", features: "" },
        marketplacePlan: item.marketplacePlan || {
          name: "",
          price: "",
          features: "",
        },
        premiumPlan: item.premiumPlan || { name: "", price: "", features: "" },
      });
    } else {
      setEditData(null);
      setFormData({
        bannerText: "",
        basicPlan: { name: "Basic", price: "", features: "" },
        marketplacePlan: { name: "Marketplace", price: "", features: "" },
        premiumPlan: { name: "Premium", price: "", features: "" },
      });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Pricing Management</h4>
        <p className="text-muted small">
          Manage your subscription plans and banner text
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy m-0">Pricing Lists</h5>
        <CustomButton onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add Pricing
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead style={{ background: "var(--navy)", color: "white" }}>
              <tr>
                <th className="px-4 py-3">Banner Text</th>
                <th>Basic ($)</th>
                <th>Marketplace ($)</th>
                <th>Premium ($)</th>
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
                pagination.paginatedData.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 fw-bold">{item.bannerText}</td>
                    <td>{item.basicPlan?.price}</td>
                    <td>{item.marketplacePlan?.price}</td>
                    <td>{item.premiumPlan?.price}</td>
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

      {/* Pricing Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}>
          <div className="modal-dialog modal-xl modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold text-navy m-0">
                  {editData ? "Update" : "New"} Pricing
                </h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="small fw-bold text-muted">
                      BANNER TEXT
                    </label>
                    <input
                      type="text"
                      className="form-control border-2 shadow-none"
                      value={formData.bannerText}
                      onChange={(e) =>
                        setFormData({ ...formData, bannerText: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="row g-3">
                    {["basicPlan", "marketplacePlan", "premiumPlan"].map(
                      (planKey) => (
                        <div className="col-lg-4" key={planKey}>
                          <div className="p-3 border rounded-3 bg-light">
                            <h6 className="fw-bold text-navy text-uppercase mb-3 border-bottom pb-2">
                              {planKey.replace("Plan", "")} Plan
                            </h6>
                            <div className="mb-2">
                              <label className="extra-small fw-bold text-muted">
                                PLAN NAME
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={formData[planKey].name}
                                onChange={(e) =>
                                  handlePlanChange(
                                    planKey,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="mb-2">
                              <label className="extra-small fw-bold text-muted">
                                PRICE
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={formData[planKey].price}
                                onChange={(e) =>
                                  handlePlanChange(
                                    planKey,
                                    "price",
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="mb-0">
                              <label className="extra-small fw-bold text-muted">
                                FEATURES (COMMA SEPARATED)
                              </label>
                              <textarea
                                className="form-control form-control-sm"
                                rows="3"
                                value={formData[planKey].features}
                                onChange={(e) =>
                                  handlePlanChange(
                                    planKey,
                                    "features",
                                    e.target.value,
                                  )
                                }
                                placeholder="Feature 1, Feature 2..."
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    )}
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
                        Save Pricing
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

export default Pricing;
