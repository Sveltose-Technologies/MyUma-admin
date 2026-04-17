import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import { useUtils } from "../hook/useUtils";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllListingsApi,
  addListingApi,
  updateListingApi,
  deleteListingApi,
  getAllCategoriesApi,
} from "../services/authService";

const LISTING_METHODS = {
  getAll: getAllListingsApi,
  add: addListingApi,
  update: updateListingApi,
  delete: deleteListingApi,
};

const NewListings = () => {
  const { getImgURL } = useUtils();
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(LISTING_METHODS);
  const pagination = usePagination(data, 8);

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    address: "",
    phone: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    whatsappNo: "",
    items: [{ name: "", price: "" }],
    images: [],
  });

  useEffect(() => {
    fetchAll();
    const fetchCats = async () => {
      const res = await getAllCategoriesApi();
      setCategories(res?.categories || []);
    };
    fetchCats();
  }, [fetchAll]);

  const renderSocialIcons = (item) => {
    const socials = [
      { key: "facebook", icon: "bi-facebook", color: "#1877F2" },
      { key: "instagram", icon: "bi-instagram", color: "#E4405F" },
      { key: "twitter", icon: "bi-twitter-x", color: "#000000" },
      { key: "linkedin", icon: "bi-linkedin", color: "#0A66C2" },
      { key: "youtube", icon: "bi-youtube", color: "#FF0000" },
      { key: "whatsappNo", icon: "bi-whatsapp", color: "#25D366", isWA: true },
    ];

    return (
      <div className="d-flex gap-2">
        {socials.map((s) => {
          const value = item[s.key];
          if (!value) return null;
          const href = s.isWA
            ? `https://wa.me/${value.replace(/\D/g, "")}`
            : value.startsWith("http")
              ? value
              : `https://${value}`;
          return (
            <a
              key={s.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: s.color, fontSize: "1.1rem" }}>
              <i className={`bi ${s.icon}`}></i>
            </a>
          );
        })}
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addRow = () =>
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", price: "" }],
    });

  const removeRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "items") {
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === "images") {
        formData.images.forEach((file) => dataToSend.append("images", file));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    const success = editId
      ? await updateItem(editId, dataToSend)
      : await addItem(dataToSend);
    if (success) setShowModal(false);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        ...item,
        categoryId: item.categoryId?._id || item.categoryId,
        items: Array.isArray(item.items)
          ? item.items
          : JSON.parse(item.items || "[]"),
        images: [],
      });
    } else {
      setEditId(null);
      setFormData({
        categoryId: "",
        title: "",
        address: "",
        phone: "",
        twitter: "",
        facebook: "",
        linkedin: "",
        youtube: "",
        instagram: "",
        whatsappNo: "",
        items: [{ name: "", price: "" }],
        images: [],
      });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark m-0">Properties & Listings</h4>
        <CustomButton onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add Listing
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table
            className="table table-hover align-middle mb-0"
            style={{ minWidth: "1200px" }}>
            <thead className="bg-light text-secondary small text-uppercase">
              <tr>
                <th className="ps-4">Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Social Media</th>
                <th>Price Items</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData?.length > 0 ? (
                pagination.paginatedData.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <img
                        src={getImgURL(item.images?.[0])}
                        alt=""
                        className="rounded shadow-sm"
                        style={{
                          width: "50px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="fw-bold text-dark">{item.title}</td>
                    <td>
                      <span className="text-black">
                        {item.categoryId?.name || "N/A"}
                      </span>
                    </td>
                    <td className="text-muted small">
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "150px" }}>
                        <i className="bi bi-geo-alt me-1"></i> {item.address}
                      </div>
                    </td>
                    <td className="small">{item.phone}</td>
                    <td>{renderSocialIcons(item)}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {Array.isArray(item.items) ? item.items.length : 0}{" "}
                        Items
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => openModal(item)}>
                          <i className="bi bi-pencil text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger"
                          onClick={() => deleteItem(item._id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    {loading ? (
                      <div className="spinner-border spinner-border-sm"></div>
                    ) : (
                      "No Data Found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <Pagination {...pagination} />
      </div>

      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1070 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered px-2">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold m-0">
                  {editId ? "Update Listing" : "Create New Listing"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div
                  className="modal-body p-4"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <div className="row g-4">
                    <div className="col-12 col-lg-4">
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Listing Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="form-control mb-3"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Luxury Apartment"
                      />

                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Category
                      </label>
                      <select
                        name="categoryId"
                        className="form-select mb-3"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required>
                        <option value="">Choose Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Upload Photos
                      </label>
                      <input
                        type="file"
                        multiple
                        className="form-control"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            images: Array.from(e.target.files),
                          })
                        }
                      />
                    </div>

                    <div className="col-12 col-lg-4 border-lg-start ps-lg-4">
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Location Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control mb-3"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Street, City, Country"
                      />

                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Contact Details
                      </label>
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="form-control"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="whatsappNo"
                            placeholder="WhatsApp"
                            className="form-control"
                            value={formData.whatsappNo}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Social Media Links
                      </label>
                      <div className="row g-2">
                        {[
                          "facebook",
                          "instagram",
                          "linkedin",
                          "youtube",
                          "twitter",
                        ].map((social) => (
                          <div className="col-6" key={social}>
                            <input
                              type="text"
                              name={social}
                              placeholder={social}
                              className="form-control form-control-sm"
                              value={formData[social]}
                              onChange={handleInputChange}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 border-lg-start ps-lg-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="small fw-bold text-muted text-uppercase">
                          Price List / Menu
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary rounded-circle p-0"
                          style={{ width: "24px", height: "24px" }}
                          onClick={addRow}>
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <div
                        className="pe-1"
                        style={{ maxHeight: "250px", overflowY: "auto" }}>
                        {formData.items.map((item, index) => (
                          <div className="d-flex gap-1 mb-2" key={index}>
                            <input
                              type="text"
                              placeholder="Item Name"
                              className="form-control form-control-sm"
                              value={item.name}
                              onChange={(e) =>
                                handleItemChange(index, "name", e.target.value)
                              }
                            />
                            <input
                              type="text"
                              placeholder="Price"
                              className="form-control form-control-sm"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(index, "price", e.target.value)
                              }
                            />
                            <button
                              type="button"
                              className="btn btn-sm text-danger"
                              onClick={() => removeRow(index)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2">
                  <CustomButton
                    variant="cancel"
                    type="button"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" loading={loading}>
                    Submit Listing
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewListings;
