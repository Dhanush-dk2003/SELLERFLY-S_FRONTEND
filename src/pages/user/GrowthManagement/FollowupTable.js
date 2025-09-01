import React, { useEffect, useState, useCallback } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FollowupTable = () => {
  // Data states
  const [followups, setFollowups] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters & form states
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  // Add form fields
  const [companyName, setCompanyName] = useState("");
  const [portalName, setPortalName] = useState("");
  const [description, setDescription] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // change rows per page if needed

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFollowups = followups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(followups.length / itemsPerPage);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, show: false }));

  /** 🔹 Fetch followups */
  const fetchFollowups = useCallback(async () => {
    try {
      const res = await API.get("/growth/followup", {
        params: { search: searchQuery, startDate, endDate },
      });
      setFollowups(res.data || []);
    } catch {
      setSnackbar({
        show: true,
        message: "Failed to fetch follow-ups.",
        type: "error",
      });
    }
  }, [searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  /** 🔹 Handle search (on Enter key) */
  const handleKeyDown = (e) => e.key === "Enter" && setSearchQuery(search);

  /** 🔹 Delete followups */
  const handleDelete = async () => {
    if (deleteMode && selectedIds.length) {
      try {
        await API.delete("/growth/followup", { data: { ids: selectedIds } });
        setSelectedIds([]);
        setDeleteMode(false);
        fetchFollowups();
        setSnackbar({
          show: true,
          message: "Deleted successfully.",
          type: "success",
        });
      } catch {
        setSnackbar({ show: true, message: "Delete failed.", type: "error" });
      }
    } else {
      setDeleteMode(true);
    }
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  /** 🔹 Add followup */
  const handleAdd = async () => {
    try {
      await API.post("/growth/followup", {
        companyName,
        portalName,
        description,
      });
      setCompanyName("");
      setPortalName("");
      setDescription("");
      setShowAddForm(false);
      fetchFollowups();
      setSnackbar({ show: true, message: "Followup added.", type: "success" });
    } catch {
      setSnackbar({
        show: true,
        message: "Failed to add follow-up.",
        type: "error",
      });
    }
  };

  /** 🔹 Company suggestions */
  const handleCompanySearch = async (value) => {
    setCompanyName(value);
    if (!value.trim()) return setCompanySuggestions([]);
    try {
      const res = await API.get(`/clients/search/${value}`);
      setCompanySuggestions(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCompanySuggestions([]);
    }
  };
  /** 🔹 Export table to Excel */
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      followups.map((f, idx) => ({
        "S.No": idx + 1,
        Date: new Date(f.date).toLocaleDateString(),
        Company: f.companyName,
        Subject: f.portalName,
        Description: f.description,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Followups");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 🔹 Generate DD-MM-YYYY date string
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    // 🔹 Counter
    let counter = parseInt(localStorage.getItem("exportCounter") || "1", 10);
const fileName = `Followups-${dateStr}(${String(counter).padStart(2, "0")}).xlsx`;
localStorage.setItem("exportCounter", counter + 1);


    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, fileName);
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        {/* Export Button (Left) */}
        <button className="btn btn-outline-success" onClick={handleExport}>
          Export to Excel
        </button>

        {/* Other Buttons (Right) */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => setShowAddForm(true)}
          >
            Add Followup
          </button>
          {!deleteMode ? (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          ) : (
            <>
              <button className="btn btn-danger" onClick={handleDelete}>
                Confirm Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                X
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
        {/* Date range */}

        <div className="d-flex gap-2">
          {["Start Date", "End Date"].map((label, i) => (
            <div key={label}>
              <label className="form-label">{label}</label>
              <input
                type="date"
                className="form-control"
                value={i === 0 ? startDate : endDate}
                onChange={(e) =>
                  i === 0
                    ? setStartDate(e.target.value)
                    : setEndDate(e.target.value)
                }
              />
            </div>
          ))}
        </div>

        {/* Search */}
        <div>
          <div className="d-flex mt-4">
            <input
              type="text"
              placeholder="Search..."
              className="form-control "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ maxWidth: "250px" }}
            />
            <button
              className="btn btn-primary ms-2"
              onClick={() => setSearchQuery(search)}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Add Followup Modal */}
      {showAddForm && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Add Followup</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6 position-relative">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyName}
                      onChange={(e) => handleCompanySearch(e.target.value)}
                    />
                    {companySuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 shadow-sm">
                        {companySuggestions.map((s, idx) => (
                          <li
                            key={idx}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setCompanyName(s.companyName);
                              setCompanySuggestions([]);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {s.companyName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={portalName}
                      onChange={(e) => setPortalName(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleAdd}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card shadow border p-3">
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "60px" }}>S.No</th>
                <th style={{ width: "120px" }}>Date</th>
                <th style={{ width: "180px" }}>Company</th>
                <th style={{ width: "180px" }}>Subject</th>
                <th>Description</th>
                {deleteMode && (
                  <th className="text-center" style={{ width: "80px" }}>
                    Select
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {followups.length > 0 ? (
                currentFollowups.map((f, idx) => (
                  <tr key={f.id}>
                    <td>{indexOfFirstItem + idx + 1}</td>

                    <td>{new Date(f.date).toLocaleDateString()}</td>
                    <td>{f.companyName}</td>
                    <td>{f.portalName}</td>
                    <td
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                    >
                      {f.description}
                    </td>
                    {deleteMode && (
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(f.id)}
                          onChange={(e) =>
                            setSelectedIds((prev) =>
                              e.target.checked
                                ? [...prev, f.id]
                                : prev.filter((id) => id !== f.id)
                            )
                          }
                        />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={deleteMode ? 6 : 5} className="text-center">
                    No followups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Snackbar */}
      <Snackbar {...snackbar} onClose={handleCloseSnackbar} />
    </div>
  );
};

export default FollowupTable;
