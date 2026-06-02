import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import { toast } from "react-toastify";
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
  const [editId, setEditId] = useState(null);

  // Strictly Month-based initial state
  const initialPlanState = [
    {
      name: "Basic Plan",
      price: "",
      features: "",
      duration: "month",
      durationCount: 1,
      listings: 0,
      chatIsActive: false,
    },
    {
      name: "Standard Plan",
      price: "",
      features: "",
      duration: "month",
      durationCount: 3,
      listings: 0,
      chatIsActive: false,
    },
    {
      name: "Premium Plan",
      price: "",
      features: "",
      duration: "month",
      durationCount: 12,
      listings: 0,
      chatIsActive: false,
    },
  ];

  const [formData, setFormData] = useState({
    bannerText: "",
    plans: initialPlanState,
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handlePlanChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = { ...updatedPlans[index], [field]: value };
      return { ...prev, plans: updatedPlans };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bannerText: String(formData.bannerText || ""),
        Plan: formData.plans.map((p) => ({
          ...p,
          price: Number(p.price),
          duration: "month", // Force duration to be 'month'
          durationCount: Number(p.durationCount),
          listings: Number(p.listings),
          features:
            typeof p.features === "string"
              ? p.features
                  .split(",")
                  .map((f) => f.trim())
                  .filter((f) => f !== "")
              : p.features,
        })),
      };

      const success = editId
        ? await updateItem(editId, payload)
        : await addItem(payload);

      if (success) {
        setShowModal(false);
        fetchAll();
        toast.success("Pricing updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to save pricing configuration.");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      const existingPlans = item.plan || item.Plan || [];
      setFormData({
        bannerText: item.bannerText || "",
        plans: existingPlans.map((p) => ({
          ...p,
          duration: "month", // Ensure consistency on load
          features: Array.isArray(p.features)
            ? p.features.join(", ")
            : p.features,
        })),
      });
    } else {
      setEditId(null);
      setFormData({ bannerText: "", plans: initialPlanState });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid p-4 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-navy">Monthly Pricing Management</h4>
          <p className="text-muted small">
            Configure monthly subscription tiers and limits.
          </p>
        </div>
        <CustomButton variant="gold" onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add New Config
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th className="p-3">Banner Text</th>
                <th className="text-center">Tier 1</th>
                <th className="text-center">Tier 2</th>
                <th className="text-center">Tier 3</th>
                <th className="text-end p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No pricing configurations found.
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item) => (
                  <tr key={item._id}>
                    <td
                      className="p-3 fw-semibold text-truncate"
                      style={{ maxWidth: "200px" }}>
                      {item.bannerText}
                    </td>
                    {[0, 1, 2].map((idx) => {
                      const p = item.Plan?.[idx] || item.plan?.[idx];
                      return (
                        <td key={idx} className="text-center">
                          <div className="fw-bold text-dark">
                            ${p?.price || 0}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "10px" }}>
                            {p?.durationCount} Month(s)
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-end p-3">
                      <button
                        className="btn btn-sm btn-outline-info me-2 border-0"
                        onClick={() => openModal(item)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => deleteItem(item._id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination {...pagination} />
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <form
                onSubmit={handleSave}
                className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="fw-bold">
                    {editId ? "Update Plans" : "Create Plans"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">
                      BANNER HEADING
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      value={formData.bannerText}
                      onChange={(e) =>
                        setFormData({ ...formData, bannerText: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="row g-3">
                    {formData.plans.map((plan, idx) => (
                      <div className="col-12 col-lg-4" key={idx}>
                        <div className="card h-100 border-0 bg-light p-3 rounded-3 shadow-sm border-top border-4 border-warning">
                          <input
                            type="text"
                            className="form-control fw-bold mb-3 border-0 bg-transparent text-navy p-0"
                            value={plan.name}
                            onChange={(e) =>
                              handlePlanChange(idx, "name", e.target.value)
                            }
                            style={{ fontSize: "1.1rem" }}
                          />

                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <label className="form-label extra-small fw-bold">
                                PRICE ($)
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm border-0 shadow-sm"
                                value={plan.price}
                                onChange={(e) =>
                                  handlePlanChange(idx, "price", e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label extra-small fw-bold">
                                LISTINGS LIMIT
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm border-0 shadow-sm"
                                value={plan.listings}
                                onChange={(e) =>
                                  handlePlanChange(
                                    idx,
                                    "listings",
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label extra-small fw-bold">
                              DURATION (IN MONTHS)
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="form-control form-control-sm border-0 shadow-sm"
                              value={plan.durationCount}
                              onChange={(e) =>
                                handlePlanChange(
                                  idx,
                                  "durationCount",
                                  e.target.value,
                                )
                              }
                              required
                            />
                          </div>

                          <div className="form-check form-switch mb-3 p-2 bg-white rounded border ps-5">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={plan.chatIsActive}
                              onChange={(e) =>
                                handlePlanChange(
                                  idx,
                                  "chatIsActive",
                                  e.target.checked,
                                )
                              }
                            />
                            <label className="form-check-label small fw-bold">
                              Enable Direct Chat
                            </label>
                          </div>

                          <div>
                            <label className="form-label extra-small fw-bold text-muted">
                              FEATURES (COMMA SEPARATED)
                            </label>
                            <textarea
                              className="form-control border-0 shadow-sm"
                              rows="3"
                              value={plan.features}
                              onChange={(e) =>
                                handlePlanChange(
                                  idx,
                                  "features",
                                  e.target.value,
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <CustomButton
                    variant="cancel"
                    type="button"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" loading={loading}>
                    {editId ? "Update All Tiers" : "Save All Tiers"}
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 9998 }}></div>
        </>
      )}
    </div>
  );
};

export default Pricing;
