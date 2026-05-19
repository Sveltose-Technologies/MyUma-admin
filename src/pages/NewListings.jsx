// import React, { useEffect, useState } from "react";
// import { useCrud } from "../hook/useCrud";
// import { usePagination } from "../hook/usePagination";
// import { useUtils } from "../hook/useUtils";
// import Pagination from "../components/common/Pagination";
// import CustomButton from "../components/common/CustomButton";
// import {
//   getAllListingsApi,
//   addListingApi,
//   updateListingApi,
//   deleteListingApi,
//   getAllCategoriesApi,
//   getAllSubCategoriesApi,
//   getAllOwnersApi, // Added this to fetch owners for the dropdown
// } from "../services/authService";

// const LISTING_METHODS = {
//   getAll: getAllListingsApi,
//   add: addListingApi,
//   update: updateListingApi,
//   delete: deleteListingApi,
// };

// const NewListings = () => {
//   const { getImgURL } = useUtils();
//   const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
//     useCrud(LISTING_METHODS);
//   const pagination = usePagination(data, 8);

//   const [categories, setCategories] = useState([]);
//   const [allSubCategories, setAllSubCategories] = useState([]);
//   const [owners, setOwners] = useState([]); // State for owners dropdown
//   const [filteredSubCats, setFilteredSubCats] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [formData, setFormData] = useState({
//     categoryId: "",
//     subCategoryId: "",
//     ownerId: "", // New Parameter
//     title: "",
//     address: "",
//     phone: "",
//     youtubeVideo: "", // New Parameter
//     twitter: "",
//     facebook: "",
//     linkedin: "",
//     youtube: "",
//     instagram: "",
//     whatsappNo: "",
//     items: [{ name: "", price: "" }],
//     images: [],
//   });

//   useEffect(() => {
//     fetchAll();
//     const fetchInitialData = async () => {
//       const [catRes, subRes, ownerRes] = await Promise.all([
//         getAllCategoriesApi(),
//         getAllSubCategoriesApi(),
//         getAllOwnersApi(), // Fetch owners from your auth service
//       ]);
//       setCategories(catRes?.categories || []);
//       setAllSubCategories(subRes?.data || []);
//       setOwners(ownerRes?.data || []); // Assuming response has a data array
//     };
//     fetchInitialData();
//   }, [fetchAll]);

//   useEffect(() => {
//     if (formData.categoryId) {
//       const categoryGroup = allSubCategories.find(
//         (group) => group.categoryId._id === formData.categoryId,
//       );
//       setFilteredSubCats(categoryGroup ? categoryGroup.subcategories : []);
//     } else {
//       setFilteredSubCats([]);
//     }
//   }, [formData.categoryId, allSubCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "categoryId") {
//       setFormData({ ...formData, categoryId: value, subCategoryId: "" });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const dataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "items") {
//         dataToSend.append(key, JSON.stringify(formData[key]));
//       } else if (key === "images") {
//         formData.images.forEach((file) => dataToSend.append("images", file));
//       } else {
//         dataToSend.append(key, formData[key]);
//       }
//     });

//     const success = editId
//       ? await updateItem(editId, dataToSend)
//       : await addItem(dataToSend);
//     if (success) setShowModal(false);
//   };

//   const openModal = (item = null) => {
//     if (item) {
//       setEditId(item._id);
//       setFormData({
//         ...item,
//         categoryId: item.categoryId?._id || item.categoryId,
//         subCategoryId: item.subCategoryId?._id || item.subCategoryId || "",
//         ownerId: item.ownerId?._id || item.ownerId || "", // Map ownerId
//         items: Array.isArray(item.items)
//           ? item.items
//           : JSON.parse(item.items || "[]"),
//         images: [],
//       });
//     } else {
//       setEditId(null);
//       setFormData({
//         categoryId: "",
//         subCategoryId: "",
//         ownerId: "",
//         title: "",
//         address: "",
//         phone: "",
//         youtubeVideo: "",
//         twitter: "",
//         facebook: "",
//         linkedin: "",
//         youtube: "",
//         instagram: "",
//         whatsappNo: "",
//         items: [{ name: "", price: "" }],
//         images: [],
//       });
//     }
//     setShowModal(true);
//   };

//   return (
//     <div className="container-fluid py-4">
//       {/* Header and Table remains mostly same, added Video check in table */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="fw-bold text-dark m-0">Properties & Listings</h4>
//         <CustomButton onClick={() => openModal()}>
//           <i className="bi bi-plus-lg me-2"></i> Add Listing
//         </CustomButton>
//       </div>

//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table
//             className="table table-hover align-middle mb-0"
//             style={{ minWidth: "1300px" }}>
//             <thead className="bg-light text-secondary small text-uppercase">
//               <tr>
//                 <th className="ps-4">Preview</th>
//                 <th>Title</th>
//                 <th>Owner</th>
//                 <th>Category</th>
//                 <th>Address</th>
//                 <th>Video</th>
//                 <th className="text-end pe-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pagination.paginatedData?.map((item) => (
//                 <tr key={item._id}>
//                   <td className="ps-4">
//                     <img
//                       src={getImgURL(item.images?.[0])}
//                       alt=""
//                       className="rounded shadow-sm"
//                       style={{
//                         width: "50px",
//                         height: "40px",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </td>
//                   <td className="fw-bold text-dark">{item.title}</td>
//                   <td className="small text-muted">
//                     {item.ownerId?.fullName || "No Owner"}
//                   </td>
//                   <td>
//                     <span className="badge bg-soft-primary text-primary">
//                       {item.categoryId?.name}
//                     </span>
//                   </td>
//                   <td className="text-muted small">{item.address}</td>
//                   <td>
//                     {item.youtubeVideo ? (
//                       <i className="bi bi-play-circle-fill text-danger fs-5"></i>
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                   <td className="text-end pe-4">
//                     <div className="d-flex justify-content-end gap-2">
//                       <button
//                         className="btn btn-sm btn-light border"
//                         onClick={() => openModal(item)}>
//                         <i className="bi bi-pencil text-primary"></i>
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light border text-danger"
//                         onClick={() => deleteItem(item._id)}>
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Pagination {...pagination} />

//       {showModal && (
//         <div
//           className="modal d-block"
//           style={{ background: "rgba(0,0,0,0.5)", zIndex: 1070 }}>
//           <div className="modal-dialog modal-xl modal-dialog-centered px-2">
//             <div className="modal-content border-0 rounded-4 shadow-lg">
//               <div className="modal-header border-0 p-4 pb-0">
//                 <h5 className="fw-bold m-0">
//                   {editId ? "Update Listing" : "Create New Listing"}
//                 </h5>
//                 <button
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}></button>
//               </div>
//               <form onSubmit={handleSave}>
//                 <div
//                   className="modal-body p-4"
//                   style={{ maxHeight: "75vh", overflowY: "auto" }}>
//                   <div className="row g-4">
//                     <div className="col-12 col-lg-4">
//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Listing Title
//                       </label>
//                       <input
//                         type="text"
//                         name="title"
//                         className="form-control mb-3"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         required
//                       />

//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Listing Owner
//                       </label>
//                       <select
//                         name="ownerId"
//                         className="form-select mb-3"
//                         value={formData.ownerId}
//                         onChange={handleInputChange}
//                         required>
//                         <option value="">Select Owner</option>
//                         {owners.map((o) => (
//                           <option key={o._id} value={o._id}>
//                             {o.fullName} ({o.email})
//                           </option>
//                         ))}
//                       </select>

//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Category
//                       </label>
//                       <select
//                         name="categoryId"
//                         className="form-select mb-3"
//                         value={formData.categoryId}
//                         onChange={handleInputChange}
//                         required>
//                         <option value="">Choose Category</option>
//                         {categories.map((c) => (
//                           <option key={c._id} value={c._id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>

//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Subcategory
//                       </label>
//                       <select
//                         name="subCategoryId"
//                         className="form-select mb-3"
//                         value={formData.subCategoryId}
//                         onChange={handleInputChange}
//                         required
//                         disabled={!formData.categoryId}>
//                         <option value="">
//                           {formData.categoryId
//                             ? "Choose Subcategory"
//                             : "Select Category First"}
//                         </option>
//                         {filteredSubCats.map((sc) => (
//                           <option key={sc._id} value={sc._id}>
//                             {sc.subcategoryName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="col-12 col-lg-4 border-lg-start ps-lg-4">
//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         YouTube Video URL
//                       </label>
//                       <input
//                         type="text"
//                         name="youtubeVideo"
//                         placeholder="https://youtube.com/watch?v=..."
//                         className="form-control mb-3"
//                         value={formData.youtubeVideo}
//                         onChange={handleInputChange}
//                       />

//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Location Address
//                       </label>
//                       <input
//                         type="text"
//                         name="address"
//                         className="form-control mb-3"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                       />

//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Contact Phone
//                       </label>
//                       <input
//                         type="text"
//                         name="phone"
//                         className="form-control mb-3"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         required
//                       />

//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Social Media Links
//                       </label>
//                       <div className="row g-2">
//                         {[
//                           "facebook",
//                           "instagram",
//                           "linkedin",
//                           "youtube",
//                           "twitter",
//                           "whatsappNo",
//                         ].map((social) => (
//                           <div className="col-6" key={social}>
//                             <input
//                               type="text"
//                               name={social}
//                               placeholder={social}
//                               className="form-control form-control-sm"
//                               value={formData[social]}
//                               onChange={handleInputChange}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="col-12 col-lg-4 border-lg-start ps-lg-4">
//                       <label className="small fw-bold text-muted mb-1 text-uppercase">
//                         Photos
//                       </label>
//                       <input
//                         type="file"
//                         multiple
//                         className="form-control mb-4"
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             images: Array.from(e.target.files),
//                           })
//                         }
//                       />

//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <label className="small fw-bold text-muted text-uppercase">
//                           Price List / Menu
//                         </label>
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-primary rounded-circle p-0"
//                           style={{ width: "24px", height: "24px" }}
//                           onClick={() =>
//                             setFormData({
//                               ...formData,
//                               items: [
//                                 ...formData.items,
//                                 { name: "", price: "" },
//                               ],
//                             })
//                           }>
//                           <i className="bi bi-plus"></i>
//                         </button>
//                       </div>
//                       <div style={{ maxHeight: "200px", overflowY: "auto" }}>
//                         {formData.items.map((item, index) => (
//                           <div className="d-flex gap-1 mb-2" key={index}>
//                             <input
//                               type="text"
//                               placeholder="Item"
//                               className="form-control form-control-sm"
//                               value={item.name}
//                               onChange={(e) => {
//                                 const newItems = [...formData.items];
//                                 newItems[index].name = e.target.value;
//                                 setFormData({ ...formData, items: newItems });
//                               }}
//                             />
//                             <input
//                               type="text"
//                               placeholder="Price"
//                               className="form-control form-control-sm"
//                               value={item.price}
//                               onChange={(e) => {
//                                 const newItems = [...formData.items];
//                                 newItems[index].price = e.target.value;
//                                 setFormData({ ...formData, items: newItems });
//                               }}
//                             />
//                             <button
//                               type="button"
//                               className="btn btn-sm text-danger"
//                               onClick={() =>
//                                 setFormData({
//                                   ...formData,
//                                   items: formData.items.filter(
//                                     (_, i) => i !== index,
//                                   ),
//                                 })
//                               }>
//                               <i className="bi bi-trash"></i>
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2">
//                   <CustomButton
//                     variant="cancel"
//                     type="button"
//                     onClick={() => setShowModal(false)}>
//                     Cancel
//                   </CustomButton>
//                   <CustomButton type="submit" loading={loading}>
//                     Submit Listing
//                   </CustomButton>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewListings;
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
  getAllSubCategoriesApi,
  getAllOwnersAPI, // Ensure this matches your service filename casing
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
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [owners, setOwners] = useState([]); // State for owners
  const [filteredSubCats, setFilteredSubCats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    ownerId: "",
    title: "",
    address: "",
    phone: "",
    youtubeVideo: "",
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
    const fetchInitialData = async () => {
      try {
        const [catRes, subRes, ownerRes] = await Promise.all([
          getAllCategoriesApi(),
          getAllSubCategoriesApi(),
          getAllOwnersAPI(),
        ]);

        setCategories(catRes?.categories || []);
        setAllSubCategories(subRes?.data || []);

        // LOGIC FIX: Accessing .owners based on your API response structure
        setOwners(ownerRes?.owners || ownerRes?.data || []);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };
    fetchInitialData();
  }, [fetchAll]);

  useEffect(() => {
    if (formData.categoryId) {
      const categoryGroup = allSubCategories.find(
        (group) => group.categoryId._id === formData.categoryId,
      );
      setFilteredSubCats(categoryGroup ? categoryGroup.subcategories : []);
    } else {
      setFilteredSubCats([]);
    }
  }, [formData.categoryId, allSubCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      setFormData({ ...formData, categoryId: value, subCategoryId: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        subCategoryId: item.subCategoryId?._id || item.subCategoryId || "",
        ownerId: item.ownerId?._id || item.ownerId || "",
        items: Array.isArray(item.items)
          ? item.items
          : JSON.parse(item.items || "[]"),
        images: [],
      });
    } else {
      setEditId(null);
      setFormData({
        categoryId: "",
        subCategoryId: "",
        ownerId: "",
        title: "",
        address: "",
        phone: "",
        youtubeVideo: "",
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

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table
            className="table table-hover align-middle mb-0"
            style={{ minWidth: "1200px" }}>
            <thead className="bg-light text-secondary small text-uppercase">
              <tr>
                <th className="ps-4">Preview</th>
                <th>Title</th>
                <th>Assigned Owner</th>
                <th>Category</th>
                <th>Contact</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData?.map((item) => (
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
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "30px",
                          height: "30px",
                          fontSize: "12px",
                        }}>
                        {item.ownerId?.fullName?.charAt(0) || "O"}
                      </div>
                      <span className="small fw-semibold">
                        {item.ownerId?.fullName || "No Owner"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-primary border">
                      {item.categoryId?.name}
                    </span>
                  </td>
                  <td className="small text-muted">{item.phone}</td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-light border me-2"
                      onClick={() => openModal(item)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-light border text-danger"
                      onClick={() => deleteItem(item._id)}>
                      <i className="bi bi-trash"></i>
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
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1070 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered px-2">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold m-0">
                  {editId ? "Edit Listing" : "New Listing"}
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
                    {/* Column 1: Basic & Ownership */}
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
                      />

                      {/* --- THE OWNER DROPDOWN --- */}
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Assign Owner
                      </label>
                      <select
                        name="ownerId"
                        className="form-select mb-3 shadow-sm border-2"
                        value={formData.ownerId}
                        onChange={handleInputChange}
                        required>
                        <option value="">Choose Listing Owner...</option>
                        {owners.map((o) => (
                          <option key={o._id} value={o._id}>
                            {o.fullName} — ({o.email})
                          </option>
                        ))}
                      </select>

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
                        Subcategory
                      </label>
                      <select
                        name="subCategoryId"
                        className="form-select mb-3"
                        value={formData.subCategoryId}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.categoryId}>
                        <option value="">
                          {formData.categoryId
                            ? "Choose Subcategory"
                            : "Select Category First"}
                        </option>
                        {filteredSubCats.map((sc) => (
                          <option key={sc._id} value={sc._id}>
                            {sc.subcategoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Column 2: Content & Social */}
                    <div className="col-12 col-lg-4 border-lg-start ps-lg-4">
                      {/* Other fields same as your previous code... */}
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control mb-3"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control mb-3"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Video URL
                      </label>
                      <input
                        type="text"
                        name="youtubeVideo"
                        className="form-control mb-3"
                        value={formData.youtubeVideo}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Column 3: Images & Price List */}
                    <div className="col-12 col-lg-4 border-lg-start ps-lg-4">
                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Upload Gallery
                      </label>
                      <input
                        type="file"
                        multiple
                        className="form-control mb-3"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            images: Array.from(e.target.files),
                          })
                        }
                      />

                      <label className="small fw-bold text-muted mb-1 text-uppercase">
                        Items & Pricing
                      </label>
                      {formData.items.map((item, index) => (
                        <div className="d-flex gap-1 mb-2" key={index}>
                          <input
                            type="text"
                            placeholder="Name"
                            className="form-control form-control-sm"
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[index].name = e.target.value;
                              setFormData({ ...formData, items: newItems });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Price"
                            className="form-control form-control-sm"
                            value={item.price}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[index].price = e.target.value;
                              setFormData({ ...formData, items: newItems });
                            }}
                          />
                        </div>
                      ))}
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
                    Save Listing
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