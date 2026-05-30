// // import React, { useEffect, useState } from "react";
// // import { useCrud } from "../hook/useCrud";
// // import { usePagination } from "../hook/usePagination";
// // import Pagination from "../components/common/Pagination";
// // import CustomButton from "../components/common/CustomButton";
// // import {
// //   getAllBooknowApi,
// //   addBooknowApi,
// //   updateBooknowApi,
// //   deleteBooknowApi,
// //   getAllListingsApi,
// //   getAllUsersApi, // Assuming this service exists to fetch user names
// // } from "../services/authService";

// // const BOOKNOW_METHODS = {
// //   getAll: getAllBooknowApi,
// //   add: addBooknowApi,
// //   update: updateBooknowApi,
// //   delete: deleteBooknowApi,
// // };

// // const Booknow = () => {
// //   const { data, loading, fetchAll, addItem, updateItem, deleteItem } =
// //     useCrud(BOOKNOW_METHODS);

// //   // Extract bookings array from the response object { bookings: [...] }
// //   const bookingList = data?.bookings || (Array.isArray(data) ? data : []);
// //   const pagination = usePagination(bookingList, 10);

// //   const [listings, setListings] = useState([]);
// //   const [users, setUsers] = useState([]); // State to store user names
// //   const [showModal, setShowModal] = useState(false);
// //   const [editId, setEditId] = useState(null);

// //   const [formData, setFormData] = useState({
// //     userId: "",
// //     itemId: "",
// //   });

// //   useEffect(() => {
// //     fetchAll();
// //     fetchSelectionData();
// //   }, [fetchAll]);

// //   const fetchSelectionData = async () => {
// //     try {
// //       const [listingRes, userRes] = await Promise.all([
// //         getAllListingsApi(),
// //         getAllUsersApi(),
// //       ]);
// //       setListings(listingRes?.data || listingRes?.listings || []);
// //       setUsers(userRes?.data || userRes?.users || []);
// //     } catch (err) {
// //       console.error("Failed to fetch selection data");
// //     }
// //   };

// //   // Helper: Find Item Name from ID
// //   const getItemName = (id) => {
// //     const found = listings.find((l) => l._id === id);
// //     return found ? found.title : id;
// //   };

// //   // Helper: Find User Name from ID
// //   const getUserName = (id) => {
// //     const found = users.find((u) => u._id === id);
// //     return found ? found.fullName || found.name : id;
// //   };

// //   const handleSave = async (e) => {
// //     e.preventDefault();
// //     const success = editId
// //       ? await updateItem(editId, formData)
// //       : await addItem(formData);
// //     if (success) setShowModal(false);
// //   };

// //   const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

// //   const openModal = (item = null) => {
// //     if (item) {
// //       setEditId(item._id);
// //       setFormData({
// //         userId: item.userId?._id || item.userId || "",
// //         itemId: item.itemId?._id || item.itemId || "",
// //       });
// //     } else {
// //       setEditId(null);
// //       setFormData({ userId: "", itemId: "" });
// //     }
// //     setShowModal(true);
// //   };

// //   return (
// //     <div className="container-fluid py-3 py-md-4">
// //       <div className="mb-4">
// //         <h4 className="fw-bold text-navy">Booking Management</h4>
// //         <p className="text-muted small">
// //           View all booking records with user and item details
// //         </p>
// //       </div>

// //       <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
// //         <h5 className="fw-bold text-navy m-0">All Bookings Data</h5>
// //         <CustomButton
// //           onClick={() => openModal()}
// //           className="w-100 w-sm-auto shadow-sm">
// //           <i className="bi bi-bookmark-plus me-2"></i> Create Booking
// //         </CustomButton>
// //       </div>

// //       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
// //         <div className="table-responsive">
// //           <table className="table table-hover align-middle mb-0 text-nowrap">
// //             <thead style={{ background: "var(--navy)", color: "white" }}>
// //               <tr className="small text-uppercase">
// //                 <th className="px-4 py-3">#</th>
// //                 <th>Booking ID</th>
// //                 <th>User Name</th>
// //                 <th>Item / Property Name</th>
// //                 <th>Created At</th>
// //                 <th>Updated At</th>
// //                 <th>v</th>
// //                 <th className="text-end px-4">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {loading && bookingList.length === 0 ? (
// //                 <tr>
// //                   <td colSpan="8" className="text-center py-5">
// //                     <div className="spinner-border text-gold"></div>
// //                   </td>
// //                 </tr>
// //               ) : bookingList.length === 0 ? (
// //                 <tr>
// //                   <td colSpan="8" className="text-center py-5">
// //                     No bookings found.
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 pagination.paginatedData.map((item, i) => (
// //                   <tr key={item._id} className="small">
// //                     <td className="px-4 text-muted">
// //                       {(pagination.currentPage - 1) * 10 + (i + 1)}
// //                     </td>
// //                     <td
// //                       className="text-muted font-monospace"
// //                       style={{ fontSize: "11px" }}>
// //                       {item._id}
// //                     </td>
// //                     <td className="fw-bold text-navy">
// //                       {getUserName(item.userId)}
// //                     </td>
// //                     <td>
// //                       <span className="badge bg-info-subtle text-info border border-info-subtle">
// //                         {getItemName(item.itemId)}
// //                       </span>
// //                     </td>
// //                     <td className="text-muted">{formatDate(item.createdAt)}</td>
// //                     <td className="text-muted">{formatDate(item.updatedAt)}</td>
// //                     <td>
// //                       <span className="badge bg-light text-dark border">
// //                         {item.__v}
// //                       </span>
// //                     </td>
// //                     <td className="text-end px-4">
// //                       <button
// //                         className="btn btn-sm btn-light border-0 me-2 shadow-sm"
// //                         onClick={() => openModal(item)}>
// //                         <i className="bi bi-pencil-square text-info"></i>
// //                       </button>
// //                       <button
// //                         className="btn btn-sm btn-light border-0 shadow-sm"
// //                         onClick={() => deleteItem(item._id)}>
// //                         <i className="bi bi-trash3 text-danger"></i>
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       <div className="mt-3">
// //         <Pagination {...pagination} />
// //       </div>

// //       {showModal && (
// //         <div
// //           className="modal d-block"
// //           style={{
// //             background: "rgba(0,0,0,0.5)",
// //             backdropFilter: "blur(4px)",
// //             zIndex: 9999,
// //           }}>
// //           <div className="modal-dialog modal-md modal-dialog-centered px-3">
// //             <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
// //               <div className="modal-header border-0 p-4 pb-0">
// //                 <h5 className="fw-bold text-navy m-0">
// //                   {editId ? "Update Booking" : "New Booking Entry"}
// //                 </h5>
// //                 <button
// //                   className="btn-close shadow-none"
// //                   onClick={() => setShowModal(false)}></button>
// //               </div>
// //               <form onSubmit={handleSave}>
// //                 <div className="modal-body p-4">
// //                   <div className="mb-3">
// //                     <label className="small fw-bold text-muted mb-2 text-uppercase">
// //                       Select Item
// //                     </label>
// //                     <select
// //                       className="form-select border-2 shadow-none rounded-3"
// //                       value={formData.itemId}
// //                       onChange={(e) =>
// //                         setFormData({ ...formData, itemId: e.target.value })
// //                       }
// //                       required>
// //                       <option value="">-- Choose Listing --</option>
// //                       {listings.map((item) => (
// //                         <option key={item._id} value={item._id}>
// //                           {item.title}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                   <div className="mb-0">
// //                     <label className="small fw-bold text-muted mb-2 text-uppercase">
// //                       Select User
// //                     </label>
// //                     <select
// //                       className="form-select border-2 shadow-none rounded-3"
// //                       value={formData.userId}
// //                       onChange={(e) =>
// //                         setFormData({ ...formData, userId: e.target.value })
// //                       }
// //                       required>
// //                       <option value="">-- Choose User --</option>
// //                       {users.map((user) => (
// //                         <option key={user._id} value={user._id}>
// //                           {user.fullName || user.name}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>
// //                 <div className="modal-footer border-0 p-4 pt-0 mt-3">
// //                   <div className="row w-100 g-2 m-0">
// //                     <div className="col-6">
// //                       <CustomButton
// //                         variant="cancel"
// //                         className="w-100"
// //                         onClick={() => setShowModal(false)}>
// //                         Cancel
// //                       </CustomButton>
// //                     </div>
// //                     <div className="col-6">
// //                       <CustomButton
// //                         type="submit"
// //                         loading={loading}
// //                         className="w-100">
// //                         {editId ? "Update" : "Save"}
// //                       </CustomButton>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Booknow;

// import React, { useEffect, useState } from "react";
// import { useCrud } from "../hook/useCrud";
// import { usePagination } from "../hook/usePagination";
// import Pagination from "../components/common/Pagination";
// import CustomButton from "../components/common/CustomButton";
// import {
//   getAllBooknowApi,
//   updateBooknowApi,
//   deleteBooknowApi,
//   getAllListingsApi,
//   getAllUsersApi,
// } from "../services/authService";

// const BOOKNOW_METHODS = {
//   getAll: getAllBooknowApi,
//   update: updateBooknowApi,
//   delete: deleteBooknowApi,
// };

// const Booknow = () => {
//   // Removed addItem as we are removing Create functionality
//   const { data, loading, fetchAll, updateItem, deleteItem } =
//     useCrud(BOOKNOW_METHODS);

//   const bookingList = data?.bookings || (Array.isArray(data) ? data : []);
//   const pagination = usePagination(bookingList, 10);

//   const [listings, setListings] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [formData, setFormData] = useState({
//     userId: "",
//     itemId: "",
//   });

//   useEffect(() => {
//     fetchAll();
//     fetchSelectionData();
//   }, [fetchAll]);

//   const fetchSelectionData = async () => {
//     try {
//       const [listingRes, userRes] = await Promise.all([
//         getAllListingsApi(),
//         getAllUsersApi(),
//       ]);
//       // Mapping to your specific JSON keys: "listings" and "auths"
//       setListings(listingRes?.listings || listingRes?.data || []);
//       setUsers(userRes?.auths || userRes?.users || userRes?.data || []);
//     } catch (err) {
//       console.error("Failed to fetch selection data");
//     }
//   };

//   // Helper: Find Item Name from ID using .title
//   const getItemName = (idField) => {
//     const id = idField?._id || idField;
//     const found = listings.find((l) => String(l._id) === String(id));
//     return found ? found.title : "Unknown Item";
//   };

//   // Helper: Find User Name from ID using .fullName
//   const getUserName = (idField) => {
//     const id = idField?._id || idField;
//     const found = users.find((u) => String(u._id) === String(id));
//     return found ? found.fullName : "Unknown User";
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     // Only updateItem is called here
//     if (editId) {
//       const success = await updateItem(editId, formData);
//       if (success) setShowModal(false);
//     }
//   };

//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleDateString() : "N/A";

//   const openEditModal = (item) => {
//     setEditId(item._id);
//     setFormData({
//       userId: item.userId?._id || item.userId || "",
//       itemId: item.itemId?._id || item.itemId || "",
//     });
//     setShowModal(true);
//   };

//   return (
//     <div className="container-fluid py-3 py-md-4">
//       <div className="mb-4">
//         <h4 className="fw-bold text-navy">Bookmarks Management</h4>

//       </div>

//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="fw-bold text-navy m-0">All Bookmarks Data</h5>
//         {/* Create Button Removed */}
//       </div>

//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0 text-nowrap">
//             <thead style={{ background: "var(--navy)", color: "white" }}>
//               <tr className="small text-uppercase">
//                 <th className="px-4 py-3">#</th>
//                 <th>User Name</th>
//                 <th>Listing Title</th>
//                 <th>Date Added</th>
//                 <th className="text-end px-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading && bookingList.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5">
//                     <div className="spinner-border text-gold"></div>
//                   </td>
//                 </tr>
//               ) : bookingList.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5 text-muted">
//                     No booking records found.
//                   </td>
//                 </tr>
//               ) : (
//                 pagination.paginatedData.map((item, i) => (
//                   <tr key={item._id}>
//                     <td className="px-4 text-muted">
//                       {(pagination.currentPage - 1) * 10 + (i + 1)}
//                     </td>
//                     <td className="fw-bold text-navy">
//                       {getUserName(item.userId)}
//                     </td>
//                     <td>
//                       <span className="text-muted">
//                         {getItemName(item.itemId)}
//                       </span>
//                     </td>
//                     <td className="text-muted">{formatDate(item.createdAt)}</td>
//                     <td className="text-end px-4">
//                       <button
//                         className="btn btn-sm btn-light border-0 me-2 shadow-sm"
//                         onClick={() => openEditModal(item)}>
//                         <i className="bi bi-pencil-square text-info"></i>
//                       </button>
//                       <button
//                         className="btn btn-sm btn-light border-0 shadow-sm"
//                         onClick={() => deleteItem(item._id)}>
//                         <i className="bi bi-trash3 text-danger"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="mt-3">
//         <Pagination {...pagination} />
//       </div>

//       {showModal && (
//         <div
//           className="modal d-block"
//           style={{
//             background: "rgba(0,0,0,0.5)",
//             backdropFilter: "blur(4px)",
//             zIndex: 9999,
//           }}>
//           <div className="modal-dialog modal-md modal-dialog-centered px-3">
//             <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
//               <div className="modal-header border-0 p-4 pb-0">
//                 <h5 className="fw-bold text-navy m-0">Edit Booking Details</h5>
//                 <button
//                   className="btn-close shadow-none"
//                   onClick={() => setShowModal(false)}></button>
//               </div>
//               <form onSubmit={handleSave}>
//                 <div className="modal-body p-4">
//                   <div className="mb-3">
//                     <label className="small fw-bold text-muted mb-2 text-uppercase">
//                       User Name (fullName)
//                     </label>
//                     <select
//                       className="form-select border-2 shadow-none rounded-3"
//                       value={formData.userId}
//                       onChange={(e) =>
//                         setFormData({ ...formData, userId: e.target.value })
//                       }
//                       required>
//                       <option value="">-- Select User --</option>
//                       {users.map((user) => (
//                         <option key={user._id} value={user._id}>
//                           {user.fullName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="mb-0">
//                     <label className="small fw-bold text-muted mb-2 text-uppercase">
//                       Listing Item (title)
//                     </label>
//                     <select
//                       className="form-select border-2 shadow-none rounded-3"
//                       value={formData.itemId}
//                       onChange={(e) =>
//                         setFormData({ ...formData, itemId: e.target.value })
//                       }
//                       required>
//                       <option value="">-- Select Listing --</option>
//                       {listings.map((item) => (
//                         <option key={item._id} value={item._id}>
//                           {item.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0 p-4 pt-0 mt-3">
//                   <div className="row w-100 g-2 m-0">
//                     <div className="col-6">
//                       <CustomButton
//                         variant="cancel"
//                         className="w-100"
//                         onClick={() => setShowModal(false)}>
//                         Cancel
//                       </CustomButton>
//                     </div>
//                     <div className="col-6">
//                       <CustomButton
//                         type="submit"
//                         loading={loading}
//                         className="w-100">
//                         Update Changes
//                       </CustomButton>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Booknow;

import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import CustomButton from "../components/common/CustomButton";
import {
  getAllBooknowApi,
  updateBooknowApi,
  deleteBooknowApi,
  getAllListingsApi,
  getAllUsersApi,
} from "../services/authService";

const BOOKNOW_METHODS = {
  getAll: getAllBooknowApi,
  update: updateBooknowApi,
  delete: deleteBooknowApi,
};

const Booknow = () => {
  const { data, loading, fetchAll, updateItem, deleteItem } =
    useCrud(BOOKNOW_METHODS);

  // Extract the array from the API response (usually data.bookings)
  const bookingList = data?.bookings || (Array.isArray(data) ? data : []);
  const pagination = usePagination(bookingList, 10);

  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    itemId: "",
  });

  useEffect(() => {
    fetchAll();
    fetchSelectionData();
  }, [fetchAll]);

  const fetchSelectionData = async () => {
    try {
      const [listingRes, userRes] = await Promise.all([
        getAllListingsApi(),
        getAllUsersApi(),
      ]);
      setListings(listingRes?.listings || []);
      setUsers(userRes?.auths || userRes?.users || []);
    } catch (err) {
      console.error("Failed to fetch helper data", err);
    }
  };

  /**
   * Helper: Get User Name
   * Handles if the backend already populated the object or if we only have the ID
   */
  const getUserName = (userField) => {
    if (userField?.fullName) return userField.fullName; // If already populated
    const id = userField?._id || userField;
    const found = users.find((u) => String(u._id) === String(id));
    return found ? found.fullName : "User";
  };

  /**
   * Helper: Get Listing Title
   */
  const getItemName = (itemField) => {
    if (itemField?.title) return itemField.title; // If already populated
    const id = itemField?._id || itemField;
    const found = listings.find((l) => String(l._id) === String(id));
    return found ? found.title : "Loading Listing...";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editId) {
      const success = await updateItem(editId, formData);
      if (success) setShowModal(false);
    }
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setFormData({
      userId: item.userId?._id || item.userId || "",
      itemId: item.itemId?._id || item.itemId || "",
    });
    setShowModal(true);
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Bookmarks Management</h4>
        <p className="text-muted small">
          View and manage all user-saved listings (Bookmarks).
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead className="bg-light">
              <tr className="small text-uppercase fw-bold text-muted">
                <th className="px-4 py-3">#</th>
                <th>User Name</th>
                <th>Listing Title</th>
                <th>Date Added</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && bookingList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-gold"></div>
                  </td>
                </tr>
              ) : bookingList.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-5 text-muted italic">
                    No bookmark records found.
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td>
                      {/* Icon and circle div removed completely */}
                      <span className="fw-semibold text-navy">
                        {getUserName(item.userId)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border p-2">
                        {getItemName(item.itemId)}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="text-end px-4">
                      <button
                        className="btn btn-sm btn-outline-info border-0 me-2"
                        title="Edit Bookmark"
                        onClick={() => openEditModal(item)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        title="Delete Bookmark"
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

      {/* Modal for Editing */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 p-4">
                <h5 className="fw-bold text-navy m-0">Edit Bookmark</h5>
                <button
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4 pt-0">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      USER
                    </label>
                    <select
                      className="form-select bg-light border-0 py-2"
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      required>
                      <option value="">Select User</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-bold text-muted">
                      LISTING ITEM
                    </label>
                    <select
                      className="form-select bg-light border-0 py-2"
                      value={formData.itemId}
                      onChange={(e) =>
                        setFormData({ ...formData, itemId: e.target.value })
                      }
                      required>
                      <option value="">Select Listing</option>
                      {listings.map((l) => (
                        <option key={l._id} value={l._id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0 d-flex gap-2">
                  <CustomButton
                    variant="cancel"
                    className="flex-grow-1"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type="submit"
                    loading={loading}
                    className="flex-grow-1">
                    Save Changes
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

export default Booknow;