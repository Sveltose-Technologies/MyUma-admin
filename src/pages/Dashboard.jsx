// // // import React from "react";

// // // const Dashboard = () => {
// // //   const stats = [
// // //     {
// // //       label: "Total Properties",
// // //       val: "1,254",
// // //       icon: "bi-building-fill",
// // //       change: "+12.5%",
// // //     },
// // //     { label: "Active Rents", val: "458", icon: "bi-key-fill", change: "+5.2%" },
// // //     {
// // //       label: "Total Users",
// // //       val: "8,940",
// // //       icon: "bi-people-fill",
// // //       change: "+18.1%",
// // //     },
// // //     {
// // //       label: "Revenue",
// // //       val: "$85,400",
// // //       icon: "bi-cash-stack",
// // //       change: "+7.4%",
// // //     },
// // //   ];

// // //   return (
// // //     <div className="dashboard-wrapper">
// // //       {/* Header Section without Button */}
// // //       <div className="mb-5">
// // //         <h3
// // //           className="fw-bold"
// // //           style={{ color: "var(--navy)", letterSpacing: "-0.5px" }}>
// // //           Dashboard Overview
// // //         </h3>
// // //         <p className="text-muted">
// // //           Welcome back! Here's what's happening today.
// // //         </p>
// // //       </div>

// // //       {/* Stats Grid */}
// // //       <div className="row g-4">
// // //         {stats.map((stat, i) => (
// // //           <div className="col-md-3" key={i}>
// // //             <div className="stat-card">
// // //               <div className="d-flex justify-content-between align-items-start mb-3">
// // //                 <div className="icon-box-new">
// // //                   <i className={stat.icon}></i>
// // //                 </div>
// // //                 <span
// // //                   className="badge bg-success-light text-success fw-bold"
// // //                   style={{ fontSize: "11px", background: "#ecfdf5" }}>
// // //                   {stat.change}
// // //                 </span>
// // //               </div>
// // //               <div>
// // //                 <p
// // //                   className="text-muted small fw-bold text-uppercase mb-1"
// // //                   style={{ letterSpacing: "0.5px" }}>
// // //                   {stat.label}
// // //                 </p>
// // //                 <h2 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
// // //                   {stat.val}
// // //                 </h2>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;
// // import React, { useState, useEffect } from "react";
// // import {
// //   getAllListingsApi,
// //   getAllBooknowApi,
// //   getAllUsersApi,
// //   getAllOwnersAPI,
// //   getAllRatingsApi,
// // } from "../services/authService";
// // import { Loader2 } from "lucide-react";

// // const Dashboard = () => {
// //   const [loading, setLoading] = useState(true);
// //   const [counts, setCounts] = useState({
// //     properties: 0,
// //     bookings: 0,
// //     users: 0,
// //     owners: 0,
// //     ratings: 0,
// //   });

// //   const fetchDashboardStats = async () => {
// //     try {
// //       setLoading(true);

// //       // 1. Fetch all data in parallel for performance
// //       const [listings, bookings, authList, owners, ratings] = await Promise.all(
// //         [
// //           getAllListingsApi(),
// //           getAllBooknowApi(),
// //           getAllUsersApi(),
// //           getAllOwnersAPI(),
// //           getAllRatingsApi(),
// //         ],
// //       );

// //       // 2. Extract and Calculate accurately
// //       setCounts({
// //         // Total Properties
// //         properties: listings?.listings?.length || listings?.count || 0,

// //         // Total Bookings (Bookmarks)
// //         bookings:
// //           bookings?.bookings?.length ||
// //           bookings?.data?.length ||
// //           bookings?.count ||
// //           0,

// //         // Filter Registered Users (role: user) from the auth list
// //         users: (authList?.users || authList?.auths || []).filter(
// //           (u) => u.role === "user",
// //         ).length,

// //         // Total Registered Owners
// //         owners:
// //           owners?.owners?.length || owners?.data?.length || owners?.count || 0,

// //         // Total Reviews/Ratings
// //         ratings: ratings?.data?.length || ratings?.count || 0,
// //       });
// //     } catch (error) {
// //       console.error("Dashboard Fetch Error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDashboardStats();
// //   }, []);

// //   const stats = [
// //     {
// //       label: "Total Properties",
// //       val: counts.properties,
// //       icon: "bi-building-fill",
// //       color: "#0d6efd",
// //       bg: "#e7f1ff",
// //     },
// //     {
// //       label: "Active Bookings",
// //       val: counts.bookings,
// //       icon: "bi-bookmark-check-fill",
// //       color: "#198754",
// //       bg: "#e8f5e9",
// //     },
// //     {
// //       label: "Platform Users",
// //       val: counts.users,
// //       icon: "bi-people-fill",
// //       color: "#0dcaf0",
// //       bg: "#e0f7fa",
// //     },
// //     {
// //       label: "Business Owners",
// //       val: counts.owners,
// //       icon: "bi-person-badge-fill",
// //       color: "#ffc107",
// //       bg: "#fff8e1",
// //     },
// //     {
// //       label: "Total Reviews",
// //       val: counts.ratings,
// //       icon: "bi-star-fill",
// //       color: "#d63384",
// //       bg: "#fce4ec",
// //     },
// //   ];

// //   if (loading) {
// //     return (
// //       <div className="vh-100 d-flex align-items-center justify-content-center">
// //         <Loader2 className="animate-spin text-primary" size={40} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="dashboard-wrapper">
// //       {/* Header Section */}
// //       <div className="mb-5 text-start">
// //         <h3 className="fw-bold text-navy" style={{ letterSpacing: "-0.5px" }}>
// //           Platform Overview
// //         </h3>
// //         <p className="text-muted">
// //           Real-time metrics for users, owners, and service interactions.
// //         </p>
// //       </div>

// //       {/* Stats Grid */}
// //       <div className="row g-4">
// //         {stats.map((stat, i) => (
// //           <div className="col-md-4 col-lg-3" key={i}>
// //             <div className="stat-card p-4 bg-white shadow-sm rounded-4 border-0 h-100">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <div
// //                   className="icon-box-new rounded-circle"
// //                   style={{
// //                     background: stat.bg,
// //                     color: stat.color,
// //                     width: "50px",
// //                     height: "50px",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                   }}>
// //                   <i className={`${stat.icon} fs-4`}></i>
// //                 </div>
// //                 <div className="text-end">
// //                   <p className="text-muted small fw-bold text-uppercase mb-0">
// //                     {stat.label}
// //                   </p>
// //                   <h2 className="fw-800 m-0 text-navy">
// //                     {stat.val.toLocaleString()}
// //                   </h2>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <style>{`
// //         .text-navy { color: #001f3f; }
// //         .fw-800 { font-weight: 800; }
// //         .stat-card {
// //             transition: all 0.3s ease;
// //             cursor: default;
// //         }
// //         .stat-card:hover {
// //             transform: translateY(-5px);
// //             box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
// //         }
// //         .animate-spin {
// //             animation: spin 1s linear infinite;
// //         }
// //         @keyframes spin {
// //             from { transform: rotate(0deg); }
// //             to { transform: rotate(360deg); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
// import {
//   getAllListingsApi,
//   getAllBooknowApi,
//   getAllUsersApi,
//   getAllOwnersAPI,
//   getAllRatingsApi,
// } from "../services/authService";
// import { Loader2 } from "lucide-react";

// const Dashboard = () => {
//   const navigate = useNavigate(); // 2. Initialize navigate
//   const [loading, setLoading] = useState(true);
//   const [counts, setCounts] = useState({
//     properties: 0,
//     bookings: 0,
//     users: 0,
//     owners: 0,
//     ratings: 0,
//   });

//   const fetchDashboardStats = async () => {
//     try {
//       setLoading(true);
//       const [listings, bookings, authList, owners, ratings] = await Promise.all(
//         [
//           getAllListingsApi(),
//           getAllBooknowApi(),
//           getAllUsersApi(),
//           getAllOwnersAPI(),
//           getAllRatingsApi(),
//         ],
//       );

//       setCounts({
//         properties: listings?.listings?.length || listings?.count || 0,
//         bookings: bookings?.bookings?.length || bookings?.data?.length || 0,
//         users: (authList?.users || authList?.auths || []).filter(
//           (u) => u.role === "user",
//         ).length,
//         owners: owners?.owners?.length || owners?.data?.length || 0,
//         ratings: ratings?.data?.length || ratings?.count || 0,
//       });
//     } catch (error) {
//       console.error("Dashboard Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   // 3. Added 'path' to each stat object based on your Sidebar paths
//   const stats = [
//     {
//       label: "Total Properties",
//       val: counts.properties,
//       icon: "bi-building-fill",
//       color: "#0d6efd",
//       bg: "#e7f1ff",
//       path: "/admin/listings",
//     },
//     {
//       label: "Active Bookings",
//       val: counts.bookings,
//       icon: "bi-calendar2-check-fill",
//       color: "#198754",
//       bg: "#e8f5e9",
//       path: "/admin/bookmarks",
//     },
//     {
//       label: "Platform Users",
//       val: counts.users,
//       icon: "bi-people-fill",
//       color: "#0dcaf0",
//       bg: "#e0f7fa",
//       path: "/admin/user",
//     },
//     {
//       label: "Business Owners",
//       val: counts.owners,
//       icon: "bi-person-badge-fill",
//       color: "#ffc107",
//       bg: "#fff8e1",
//       path: "/admin/owner",
//     },
//     {
//       label: "Total Reviews",
//       val: counts.ratings,
//       icon: "bi-star-fill",
//       color: "#d63384",
//       bg: "#fce4ec",
//       path: "/admin/rating",
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="vh-100 d-flex align-items-center justify-content-center">
//         <Loader2 className="animate-spin text-primary" size={40} />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-wrapper">
//       <div className="mb-5 text-start">
//         <h3 className="fw-bold text-navy">Platform Overview</h3>
//         <p className="text-muted">Click any box to manage detailed records.</p>
//       </div>

//       <div className="row g-4">
//         {stats.map((stat, i) => (
//           <div className="col-md-4 col-lg-3" key={i}>
//             {/* 4. Added onClick and cursor pointer class */}
//             <div
//               className="stat-card p-4 bg-white shadow-sm rounded-4 border-0 h-100 clickable-card"
//               onClick={() => navigate(stat.path)}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div
//                   className="icon-box-new rounded-circle"
//                   style={{
//                     background: stat.bg,
//                     color: stat.color,
//                     width: "50px",
//                     height: "50px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}>
//                   <i className={`${stat.icon} fs-4`}></i>
//                 </div>
//                 <div className="text-end">
//                   <p className="text-muted small fw-bold text-uppercase mb-0">
//                     {stat.label}
//                   </p>
//                   <h2 className="fw-800 m-0 text-navy">
//                     {stat.val.toLocaleString()}
//                   </h2>
//                 </div>
//               </div>
//               {/* <div className="text-start border-top pt-2 mt-2">
//                 <small
//                   className="text-primary fw-bold"
//                   style={{ fontSize: "10px" }}>
//                   VIEW DETAILS <i className="bi bi-arrow-right ms-1"></i>
//                 </small>
//               </div> */}
//             </div>
//           </div>
//         ))}
//       </div>

//       <style>{`
//         .text-navy { color: #001f3f; }
//         .fw-800 { font-weight: 800; }
//         .clickable-card {
//             transition: all 0.3s ease;
//             cursor: pointer; /* Changes cursor to hand icon */
//         }
//         .clickable-card:hover {
//             transform: translateY(-8px);
//             box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
//             background-color: #fcfcfc !important;
//         }
//         .animate-spin { animation: spin 1s linear infinite; }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllListingsApi,
  getAllBooknowApi,
  getAllUsersApi,
  getAllOwnersAPI,
  getAllRatingsApi,
  getAllPaymentsAPI, 
} from "../services/authService";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    properties: 0,
    bookings: 0,
    users: 0,
    owners: 0,
    ratings: 0,
    memberships: 0, 
  });

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const [listings, bookings, authList, owners, ratings, payments] =
        await Promise.all([
          getAllListingsApi(),
          getAllBooknowApi(),
          getAllUsersApi(),
          getAllOwnersAPI(),
          getAllRatingsApi(),
          getAllPaymentsAPI(),
        ]);

      setCounts({
        properties: listings?.listings?.length || listings?.count || 0,
        bookings: bookings?.bookings?.length || bookings?.data?.length || 0,
        users: (authList?.users || authList?.auths || []).filter(
          (u) => u.role === "user",
        ).length,
        owners: owners?.owners?.length || owners?.data?.length || 0,
        ratings: ratings?.data?.length || ratings?.count || 0,
      
        memberships: payments?.payments?.length || payments?.total || 0,
      });
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);


  const stats = [
    {
      label: "Total Listings",
      val: counts.properties,
      icon: "bi-building-fill",
      color: "#0d6efd",
      bg: "#e7f1ff",
      path: "/admin/listings",
    },
    {
      label: "Active Bookmarks",
      val: counts.bookings,
      icon: "bi-calendar2-check-fill",
      color: "#198754",
      bg: "#e8f5e9",
      path: "/admin/bookmarks",
    },
    {
      label: "Total Memberships", // <--- नया डब्बा
      val: counts.memberships,
      icon: "bi-credit-card-fill",
      color: "#6610f2",
      bg: "#f3eaff",
      path: "/admin/payments",
    },
    {
      label: "Platform Users",
      val: counts.users,
      icon: "bi-people-fill",
      color: "#0dcaf0",
      bg: "#e0f7fa",
      path: "/admin/user",
    },
    {
      label: "Business Owners",
      val: counts.owners,
      icon: "bi-person-badge-fill",
      color: "#ffc107",
      bg: "#fff8e1",
      path: "/admin/owner",
    },
    {
      label: "Total Reviews",
      val: counts.ratings,
      icon: "bi-star-fill",
      color: "#d63384",
      bg: "#fce4ec",
      path: "/admin/rating",
    },
  ];

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="mb-5 text-start">
        <h3 className="fw-bold text-navy">Dashboard</h3>
      </div>

      <div className="row g-4">
        {stats.map((stat, i) => (
          <div className="col-md-4 col-lg-4" key={i}>
            {" "}
         
            <div
              className="stat-card p-4 bg-white shadow-sm rounded-4 border-0 h-100 clickable-card"
              onClick={() => navigate(stat.path)}>
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="icon-box-new rounded-circle"
                  style={{
                    background: stat.bg,
                    color: stat.color,
                    width: "55px",
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <i className={`${stat.icon} fs-3`}></i>
                </div>
                <div className="text-end">
                  <p className="text-muted small fw-bold text-uppercase mb-0">
                    {stat.label}
                  </p>
                  <h2
                    className="fw-800 m-0 text-navy"
                    style={{ fontSize: "2rem" }}>
                    {stat.val.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .text-navy { color: #001f3f; }
        .fw-800 { font-weight: 800; }
        .clickable-card {
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid transparent !important;
        }
        .clickable-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
            border-color: #eee !important;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;