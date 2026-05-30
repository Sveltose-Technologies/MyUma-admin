import React, { useEffect, useState } from "react";
import { useCrud } from "../hook/useCrud";
import { usePagination } from "../hook/usePagination";
import Pagination from "../components/common/Pagination";
import { getAllPaymentsAPI, getAllUsersApi } from "../services/authService";

const PAYMENT_METHODS = {
  getAll: getAllPaymentsAPI,
};

const Payments = () => {
  const { data, loading, fetchAll } = useCrud(PAYMENT_METHODS);
  const [users, setUsers] = useState([]);

  const paymentList = data || [];
  const pagination = usePagination(paymentList, 10);

  useEffect(() => {
    fetchAll();
    fetchUsers();
  }, [fetchAll]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersApi();
      // Backend ke hisaab se users ya auths array set karein
      setUsers(res?.auths || res?.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // HELPER: ID se User ka Name dhoondhne ke liye
  const getUserName = (paymentItem) => {
    // 1. Agar backend ne populate karke diya ho (Object)
    if (paymentItem.userId?.fullName) return paymentItem.userId.fullName;

    // 2. Agar payment object mein seedha userName ho
    if (paymentItem.userName) return paymentItem.userName;

    // 3. User list (ID) se match karke nikalein
    const idToSearch = paymentItem.userId?._id || paymentItem.userId;
    const found = users.find((u) => String(u._id) === String(idToSearch));

    // Agar mil jaye toh Full Name, warna Email ka pehla part, warna Unknown
    return found ? found.fullName : "Unknown User";
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "success")
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
          SUCCESS
        </span>
      );
    if (s === "failed")
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill">
          FAILED
        </span>
      );
    return (
      <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill">
        PENDING
      </span>
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h4 className="fw-bold text-navy">Payment Management</h4>
        <p className="text-muted small">
          Monitor all transactions and active user subscriptions.
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead className="bg-light">
              <tr className="small text-uppercase fw-bold text-muted">
                <th className="px-4 py-3">#</th>
                <th>User Details</th>
                <th>Plan Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && paymentList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="spinner-border text-gold"></div>
                  </td>
                </tr>
              ) : (
                pagination.paginatedData.map((item, i) => (
                  <tr key={item._id}>
                    <td className="px-4 text-muted">
                      {(pagination.currentPage - 1) * 10 + (i + 1)}
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        {/* NAME SECTION */}
                        <span
                          className="fw-bold text-navy"
                          style={{ fontSize: "14px" }}>
                          {getUserName(item)}
                        </span>
                        {/* EMAIL SECTION (CHHOTA FONT) */}
                        <span
                          className="text-muted"
                          style={{ fontSize: "11px" }}>
                          {item.email || item.userId?.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold">
                        {item.planName || "Plan"}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">
                        ${item.amount || "0"}
                      </span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-muted small">
                      {formatDate(item.subscriptionEndDate || item.updatedAt)}
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
    </div>
  );
};

export default Payments;
