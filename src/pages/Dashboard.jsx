import React from "react";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Properties",
      val: "1,254",
      icon: "bi-building-fill",
      change: "+12.5%",
    },
    { label: "Active Rents", val: "458", icon: "bi-key-fill", change: "+5.2%" },
    {
      label: "Total Users",
      val: "8,940",
      icon: "bi-people-fill",
      change: "+18.1%",
    },
    {
      label: "Revenue",
      val: "$85,400",
      icon: "bi-cash-stack",
      change: "+7.4%",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Header Section without Button */}
      <div className="mb-5">
        <h3
          className="fw-bold"
          style={{ color: "var(--navy)", letterSpacing: "-0.5px" }}>
          Dashboard Overview
        </h3>
        <p className="text-muted">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-4">
        {stats.map((stat, i) => (
          <div className="col-md-3" key={i}>
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-box-new">
                  <i className={stat.icon}></i>
                </div>
                <span
                  className="badge bg-success-light text-success fw-bold"
                  style={{ fontSize: "11px", background: "#ecfdf5" }}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p
                  className="text-muted small fw-bold text-uppercase mb-1"
                  style={{ letterSpacing: "0.5px" }}>
                  {stat.label}
                </p>
                <h2 className="fw-bold m-0" style={{ color: "var(--navy)" }}>
                  {stat.val}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

 
    </div>
  );
};

export default Dashboard;
