import React, { useState, useEffect, useMemo } from "react";
import { useCrud } from "../hook/useCrud";
import { testimonialMethods } from "../services/authService";
import { useUtils } from "../hook/useUtils";

const Testimonials = () => {
  const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
    useCrud(testimonialMethods);
  const { getImgURL } = useUtils(); // Use your new image helper hook

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    message: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filteredList = useMemo(() => {
    return data.filter((item) =>
      item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("fullName", formData.fullName);
    payload.append("address", formData.address);
    payload.append("message", formData.message);
    if (formData.profileImage)
      payload.append("profileImage", formData.profileImage);

    const success = editId
      ? await updateItem(editId, payload)
      : await addItem(payload);
    if (success) {
      resetForm();
      setShowForm(false);
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setFormData({
      fullName: item.fullName,
      address: item.address,
      message: item.message,
      profileImage: null,
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({ fullName: "", address: "", message: "", profileImage: null });
    setEditId(null);
  };

  return (
    <div className="bg-light min-vh-100 py-5 px-3">
      <div className="text-center mb-5">
        <span className="text-tan fw-bold ls-2 text-uppercase d-block small">
          Management
        </span>
        <h1 className="text-navy fw-800">Testimonials</h1>
        <div className="border-gold w-25 mx-auto mt-2"></div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <div
            className="card border-0 shadow-sm p-4 sticky-lg-top"
            style={{ top: "100px" }}>
            <button
              className="uma-btn-navy w-100 mb-4 rounded-pill py-2"
              onClick={() => {
                setShowForm(!showForm);
                resetForm();
              }}>
              {showForm ? "Close Form" : "Add Testimonial"}
            </button>
            {/* <label className="small fw-bold text-navy mb-2">SEARCH NAME</label>
            <input
              type="text"
              className="form-control mb-3 shadow-none"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
          </div>
        </div>

        <div className="col-12 col-lg-9">
          {showForm && (
            <div className="card border-0 shadow-sm mb-4 border-gold-top">
              <div className="card-body p-4">
                <h5 className="text-navy fw-800 mb-4">
                  {editId ? "Edit Testimonial" : "Add New Testimonial"}
                </h5>
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <input
                      name="fullName"
                      placeholder="Full Name"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      name="address"
                      placeholder="Address"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      placeholder="Message"
                      className="form-control"
                      rows="3"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profileImage: e.target.files[0],
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="uma-btn-navy"
                      disabled={loading}>
                      {loading ? "Processing..." : "Save Testimonial"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row g-4">
            {loading && !showForm ? (
              <div className="text-center py-5 w-100">
                <div className="spinner-border text-navy"></div>
              </div>
            ) : (
              filteredList.map((item) => (
                <div key={item._id} className="col-md-6 col-xl-4">
                  <div className="card h-100 border-0 shadow-sm transition-hover listing-card text-center p-4">
                    <img
                      src={getImgURL(item.profileImage)} // Using your useUtils hook here
                      className="rounded-circle mx-auto mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border: "2px solid var(--tan)",
                      }}
                      alt={item.fullName}
                    />
                    <h6 className="text-navy fw-800 mb-1">{item.fullName}</h6>
                    <p className="text-tan small fw-bold">{item.address}</p>
                    <p className="text-muted small italic">"{item.message}"</p>
                    <div className="mt-auto pt-3 d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteItem(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
