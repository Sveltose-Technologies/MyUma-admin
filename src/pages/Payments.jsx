import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import {
  getAllPaymentsAPI,
  getAllUsersApi,
  getAllPricingApi,
} from "../services/authService";
import { User, Calendar, Clock, CreditCard, DollarSign } from "lucide-react";

const PAYMENT_METHODS = {
  getAll: getAllPaymentsAPI,
};

const Payments = () => {
  const { data, loading, fetchAll } = useCrud(PAYMENT_METHODS);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);

  // Extract payment array from data
  const paymentList = data || [];
  const pagination = usePagination(paymentList, 10);

  useEffect(() => {
    fetchAll();
    fetchSelectionData();
  }, [fetchAll]);

  const fetchSelectionData = async () => {
    try {
      const [userRes, planRes] = await Promise.all([
        getAllUsersApi(),
        getAllPricingApi(),
      ]);
      // Key mapping based on your backend structure
      setUsers(userRes?.auths || userRes?.users || []);
      setPlans(planRes?.data?.[0]?.Plan || []);
    } catch (err) {
      console.error("Selection Data Fetch Error:", err);
    }
  };

  /**
   * Logic: Map userId to User fullName
   */
  // getOwnerName helper के अंदर
  const getOwnerName = (payment) => {
    // 1. Check if populated
    if (payment.ownerId?.fullName) return payment.ownerId.fullName;

    // 2. Match with user list (अब ownerId यूज़ करें)
    const targetId = payment.ownerId?._id || payment.ownerId;
    const foundUser = users.find((u) => String(u._id) === String(targetId));

    return foundUser
      ? foundUser.fullName
      : payment.email?.split("@")[0] || "Owner";
  };

  /**
   * Logic: Calculate Expiry Date based on Plan duration
   */
  const calculateExpiry = (payment) => {
    if (payment.subscriptionEndDate) return payment.subscriptionEndDate;

    const planMeta = plans.find((p) => p.name === payment.planName);
    if (!planMeta) return payment.createdAt;

    const start = new Date(payment.createdAt);
    const expiry = new Date(start);
    const count = planMeta.durationCount || 1;
    const unit = planMeta.duration?.toLowerCase();

    if (unit === "day") expiry.setDate(expiry.getDate() + count);
    else if (unit === "week") expiry.setDate(expiry.getDate() + count * 7);
    else if (unit === "month") expiry.setMonth(expiry.getMonth() + count);
    else if (unit === "year") expiry.setFullYear(expiry.getFullYear() + count);

    return expiry;
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "success")
      return "bg-success-subtle text-success border-success-subtle";
    if (s === "failed")
      return "bg-danger-subtle text-danger border-danger-subtle";
    return "bg-warning-subtle text-warning border-warning-subtle";
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Owner Memberships</h4>
        <p className="text-muted small">
          Manage all professional owner subscriptions and payment statuses.
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead className="bg-white border-bottom">
              <tr className="small text-uppercase fw-bold text-muted">
                <th className="px-4 py-3">#</th>
                <th>Owner Identity</th>
                <th>Plan Name</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Membership Start</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && paymentList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-warning"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => {
                  const expiry = calculateExpiry(item);
                  const isExpired =
                    new Date(expiry) < new Date() && item.status === "success";

                  return (
                    <tr key={item._id}>
                      <td className="px-4 text-muted small">
                        {(pagination.currentPage - 1) * 10 + (i + 1)}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="p-2 bg-light rounded-circle text-navy">
                            <User size={16} />
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-navy text-capitalize small">
                              {getOwnerName(item)}
                            </span>
                            <span
                              className="text-muted"
                              style={{ fontSize: "10px" }}>
                              {item.email || item.userId?.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-black border fw-semibold small">
                          {item.planName}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark small">
                          ${item.amount}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-1 border small ${getStatusStyle(item.status)}`}>
                          {item.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {formatDate(item.createdAt)}
                      </td>
                      <td>
                        <span
                          className={`fw-bold small ${isExpired ? "text-danger" : "text-navy"}`}>
                          {formatDate(expiry)}
                          {isExpired && (
                            <span className="ms-1" style={{ fontSize: "9px" }}>
                              (EXPIRED)
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination {...pagination} />
      </div>
    </div>
  );
};;

export default Payments;
