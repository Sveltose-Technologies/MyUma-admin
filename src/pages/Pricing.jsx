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
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    bannerText: "",
    plans: [
      { name: "Basic", price: "", features: "" },
      { name: "Marketplace", price: "", features: "" },
      { name: "Enterprise", price: "", features: "" },
    ],
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
    const payload = {
      bannerText: formData.bannerText,
      Plan: formData.plans.map((p) => ({
        ...p,
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
    if (success) setShowModal(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        bannerText: item.bannerText || "",
        plans: item.Plan.map((p) => ({
          name: p.name,
          price: p.price,
          features: Array.isArray(p.features)
            ? p.features.join(", ")
            : p.features,
        })),
      });
    } else {
      setEditId(null);
      setFormData({
        bannerText: "",
        plans: [
          { name: "Basic", price: "", features: "" },
          { name: "Marketplace", price: "", features: "" },
          { name: "Enterprise", price: "", features: "" },
        ],
      });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Header Section */}
      <div className="row align-items-center mb-4 gy-3">
        <div className="col-12 col-md-8 text-center text-md-start">
          <h3 className="fw-bold text-dark mb-1">Pricing Management</h3>
          <p className="text-muted mb-0 small">
            Manage your business plans and banner headings
          </p>
        </div>
        <div className="col-12 col-md-4 text-center text-md-end">
          <CustomButton
            variant="gold"
            className="w-100 w-md-auto shadow-sm"
            onClick={() => openModal()}>
            <i className="bi bi-plus-lg me-2"></i> Add Pricing
          </CustomButton>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="p-3">Banner Text</th>
                <th className="text-center p-3">Basic</th>
                <th className="text-center p-3">Marketplace</th>
                <th className="text-center p-3">Enterprise</th>
                <th className="text-end p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-warning"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item) => (
                  <tr key={item._id}>
                    <td className="p-3 fw-semibold">{item.bannerText}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border p-2">
                        ${item.Plan?.[0]?.price || "0"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border p-2">
                        ${item.Plan?.[1]?.price || "0"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border p-2">
                        ${item.Plan?.[2]?.price || "0"}
                      </span>
                    </td>
                    <td className="text-end p-3 text-nowrap">
                      {/* Using 'info' instead of 'primary' */}
                      <button
                        className="btn btn-sm btn-outline-info me-2 shadow-none"
                        onClick={() => openModal(item)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger shadow-none"
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

      {/* --- MODAL SECTION --- */}
      {showModal && (
        <>
          {/* High z-index ensures it sits above the sidebar */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 9999 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="modal-title fw-bold text-dark">
                    {editId ? "Update Pricing Details" : "Create New Pricing"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}></button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="modal-body p-4">
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">
                        Banner Heading Text
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light border shadow-none"
                        placeholder="e.g. Choose Your Business Impact"
                        value={formData.bannerText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bannerText: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="row g-3">
                      {formData.plans.map((plan, idx) => (
                        <div className="col-12 col-lg-4" key={idx}>
                          <div className="card h-100 border-0 bg-light p-3 rounded-3 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                              <span className="badge bg-dark rounded-circle me-2">
                                {idx + 1}
                              </span>
                              <h6 className="fw-bold m-0">{plan.name}</h6>
                            </div>

                            <div className="mb-3">
                              <label className="form-label small fw-bold text-muted">
                                PRICE ($)
                              </label>
                              <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                value={plan.price}
                                onChange={(e) =>
                                  handlePlanChange(idx, "price", e.target.value)
                                }
                                required
                              />
                            </div>

                            <div className="mb-0">
                              <label className="form-label small fw-bold text-muted">
                                FEATURES (COMMA SEPARATED)
                              </label>
                              <textarea
                                className="form-control border-0 shadow-sm"
                                rows="4"
                                placeholder="Feature 1, Feature 2..."
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
                    <div className="row w-100 g-2">
                      <div className="col-12 col-sm-6 order-2 order-sm-1 text-center text-sm-start">
                        <CustomButton
                          variant="cancel"
                          className="w-100"
                          onClick={() => setShowModal(false)}>
                          Cancel
                        </CustomButton>
                      </div>
                      <div className="col-12 col-sm-6 order-1 order-sm-2 text-center text-sm-end">
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
          
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 9998 }}></div>
        </>
      )}
    </div>
  );
};

export default Pricing;
