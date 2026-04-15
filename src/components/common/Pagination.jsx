import React from "react";

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  totalItems,
  startRange,
  endRange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
      {/* Entry Info using --navy */}
      <div className="text-muted small fw-medium">
        Showing{" "}
        <span className="fw-bold" style={{ color: "var(--navy)" }}>
          {startRange}
        </span>{" "}
        to{" "}
        <span className="fw-bold" style={{ color: "var(--navy)" }}>
          {endRange}
        </span>{" "}
        of{" "}
        <span className="fw-bold" style={{ color: "var(--navy)" }}>
          {totalItems}
        </span>{" "}
        entries
      </div>

      <nav>
        <ul className="pagination mb-0 shadow-sm border-0 gap-1">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link border-0 rounded-2 shadow-none"
              style={{ color: "var(--navy)", background: "transparent" }}
              onClick={() => setCurrentPage(currentPage - 1)}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {/* Dynamic Page Numbers using --gold and --navy */}
          {pages.map((page) => (
            <li key={page} className="page-item">
              <button
                onClick={() => setCurrentPage(page)}
                className="page-link border-0 rounded-2 shadow-none fw-bold mx-1"
                style={
                  page === currentPage
                    ? { backgroundColor: "var(--gold)", color: "var(--navy)" }
                    : { backgroundColor: "transparent", color: "var(--navy)" }
                }>
                {page}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link border-0 rounded-2 shadow-none"
              style={{ color: "var(--navy)", background: "transparent" }}
              onClick={() => setCurrentPage(currentPage + 1)}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
