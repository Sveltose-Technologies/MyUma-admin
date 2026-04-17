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
  getAllCategoriesApi, // Assuming this exists for the category dropdown
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
      setCategories(res?.categories || res?.data || []);
    };
    fetchCats();
  }, [fetchAll]);

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
    dataToSend.append("categoryId", formData.categoryId);
    dataToSend.append("title", formData.title);
    dataToSend.append("address", formData.address);
    dataToSend.append("phone", formData.phone);
    dataToSend.append("twitter", formData.twitter);
    dataToSend.append("facebook", formData.facebook);
    dataToSend.append("linkedin", formData.linkedin);
    dataToSend.append("youtube", formData.youtube);
    dataToSend.append("instagram", formData.instagram);
    dataToSend.append("whatsappNo", formData.whatsappNo);
    dataToSend.append("items", JSON.stringify(formData.items));

    formData.images.forEach((file) => dataToSend.append("images", file));

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
        <h4 className="fw-bold text-navy m-0">Properties & Listings</h4>
        <CustomButton onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add Listing
        </CustomButton>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-4">Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Phone</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map((item) => (
                <tr key={item._id}>
                  <td className="px-4">
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
                  <td className="fw-bold text-navy">{item.title}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {item.categoryId?.title || "N/A"}
                    </span>
                  </td>
                  <td className="small">{item.phone}</td>
                  <td className="text-end px-4">
                    <button
                      className="btn btn-sm btn-light border me-2"
                      onClick={() => openModal(item)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-light border"
                      onClick={() => deleteItem(item._id)}>
                      <i className="bi bi-trash text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination {...pagination} />

      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered px-3">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold m-0">
                  {editId ? "Update Listing" : "New Listing"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div
                  className="modal-body p-4"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <div className="row g-3">
                    {/* Basic Info */}
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted">TITLE</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control mb-2"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="small fw-bold text-muted">
                        CATEGORY
                      </label>
                      <select
                        name="categoryId"
                        className="form-select mb-2"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required>
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                      <label className="small fw-bold text-muted">
                        IMAGES (Multiple)
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
                    {/* Contact & Social */}
                    <div className="col-md-4 border-start">
                      <label className="small fw-bold text-muted">
                        ADDRESS
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control mb-2"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="small fw-bold text-muted">
                        PHONE / WHATSAPP
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone"
                          className="form-control mb-2"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                        <input
                          type="text"
                          name="whatsappNo"
                          placeholder="WhatsApp"
                          className="form-control mb-2"
                          value={formData.whatsappNo}
                          onChange={handleInputChange}
                        />
                      </div>
                      <label className="small fw-bold text-muted">
                        SOCIAL LINKS
                      </label>
                      <div className="row g-1">
                        {["facebook", "instagram", "linkedin", "youtube"].map(
                          (social) => (
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
                          ),
                        )}
                      </div>
                    </div>
                    {/* Dynamic Items List */}
                    <div className="col-md-4 border-start">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="small fw-bold text-muted">
                          PRICE LIST / ITEMS
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-gold p-1"
                          onClick={addRow}>
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </div>
                      {formData.items.map((item, index) => (
                        <div className="d-flex gap-1 mb-1" key={index}>
                          <input
                            type="text"
                            placeholder="Name"
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
                            className="btn btn-sm btn-light text-danger"
                            onClick={() => removeRow(index)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <div className="d-flex w-100 gap-2">
                    <CustomButton
                      variant="cancel"
                      className="w-100"
                      onClick={() => setShowModal(false)}>
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type="submit"
                      loading={loading}
                      className="w-100">
                      Save Listing
                    </CustomButton>
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

export default NewListings;
