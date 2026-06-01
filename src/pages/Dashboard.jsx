
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

       // CHANGE: Count only "SUCCESS" payments for a truer dashboard metric
       memberships: (payments?.payments || []).filter(
         (p) => p.status === "success",
       ).length,
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