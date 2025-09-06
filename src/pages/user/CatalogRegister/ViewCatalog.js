import React, { useState, useEffect } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];

const ViewCatalog = ({ client, onClose }) => {
  const [portals, setPortals] = useState([]);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deletedPortals, setDeletedPortals] = useState([]);

  useEffect(() => {
    const initial = client.portals || [];
    setPortals(initial);
  }, [client]);

  const handleChange = (index, e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setPortals((prev) => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    try {
      for (const p of portals) {
        const payload = {
          portalName: p.portalName,
          username: p.username,
          password: p.password,
          status: p.status || "TODO",
          remarks: p.remarks || null,
          portalLink: p.portalLink || null,
          masterLink: p.masterLink || null,
          startDate: p.startDate || null,
          endDate: p.endDate || null,
          portalHealth: p.portalHealth || null,
          registeredBy: p.registeredBy || "US",
          
        };

        if (p.id) {
          await API.put(`/portals/${p.id}`, payload);
        } else {
          await API.post("/portals", {
            clientId: client.id,
            portals: [payload],
          });
        }
      }

      for (const id of deletedPortals) {
        await API.delete(`/portals/${id}`);
      }
      setDeletedPortals([]);

      setSnackbar({
        show: true,
        message: "Portals saved successfully",
        type: "success",
      });
      setIsEditing(false);

      const res = await API.get(`/portals/client/${client.id}`);
      setPortals(res.data || []);
    } catch (err) {
      setSnackbar({ show: true, message: err.message, type: "error" });
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border p-3 position-relative">
        <h4 className="mb-3">
          <span className="fw-bold">{client.companyName}</span> - Manage Portals
        </h4>
        <button
          onClick={onClose}
          className="btn position-absolute top-0 end-0"
          style={{ border: "none", fontSize: "2rem", lineHeight: "1" }}
          aria-label="Close"
        >
          &times;
        </button>

        {portals.map((portal, index) => (
          <div
            key={portal.id || index}
            className="border rounded p-3 mb-3 bg-light"
          >
            <div className="row">
              {/* Read-only Portal Name */}
              <div className="col-md-6 mb-3">
                <label>Portal Name</label>
                <input
                  className="form-control"
                  value={portal.portalName}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Portal Registration</label>
                <input
                  className="form-control"
                  value={portal.registeredBy}
                  disabled
                />
              </div>

              {/* Editable Portal Health */}
              

              {/* Read-only Username */}
              <div className="col-md-6 mb-3">
                <label>Username</label>
                <input
                  className="form-control"
                  value={portal.username}
                  disabled
                />
              </div>

              {/* Read-only Password */}
              <div className="col-md-6 mb-3">
                <label>Password</label>
                <input
                  className="form-control"
                  value={portal.password}
                  disabled
                />
              </div>

              {/* Editable Start Date */}
              <div className="col-md-6 mb-3">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={portal.startDate ? portal.startDate.split("T")[0] : ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              {/* Editable End Date */}
              <div className="col-md-6 mb-3">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={portal.endDate ? portal.endDate.split("T")[0] : ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              {/* Editable Status */}
              <div className="col-md-6 mb-3">
                <label>Portal Health</label>
                <select
                  name="portalHealth"
                  value={portal.portalHealth || ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                >
                  <option value="">Select</option>
                  <option value="GOOD">Good</option>
                  <option value="BAD">Bad</option>
                  <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select
                  name="status"
                  value={portal.status || ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {/* Editable Portal Link */}
              <div className="col-md-6 mb-3">
                <label>Portal Link</label>
                <input
                  type="text"
                  name="portalLink"
                  value={portal.portalLink || ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              {/* Editable Master Link */}
              <div className="col-md-6 mb-3">
                <label>Master Link</label>
                <input
                  type="text"
                  name="masterLink"
                  value={portal.masterLink || ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              {/* Editable Remarks */}
              <div className="col-md-12 mb-3">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={portal.remarks || ""}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              
            </div>
          </div>
        ))}

        <div className="text-end mt-3">
          {!isEditing ? (
            <>
              <button className="btn btn-secondary me-2" onClick={onClose}>
                Close
              </button>
              <button
                className="btn btn-outline-primary px-4 py-2 fw-bold"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-danger me-2" onClick={onClose}>
                Close
              </button>
            </>
          )}
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        show={snackbar.show}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, show: false })}
      />
    </div>
  );
};

export default ViewCatalog;
