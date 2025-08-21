import React, { useState } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];
const COMMON_PORTALS = [
  "Amazon",
  "Flipkart",
  "Meesho",
  "JioMart",
  "Ajio",
  "Amazon Bazaar",
  "Shopify",
  "Snapdeal",
  "Custom",
];

const ViewPortal = ({ client, onClose }) => {
  const [portals, setPortals] = useState(client.portals || []);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (index, e) => {
    if (!isEditing) return; // prevent editing in view mode
    const { name, value } = e.target;
    setPortals((prev) => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const addPortalRow = () => {
    if (!isEditing) return;
    setPortals((p) => [
      ...p,
      {
        portalName: "",
        customPortal: "",
        username: "",
        password: "",
        status: "",
        remarks: "",
      },
    ]);
  };

  const removePortalRow = (index) => {
    if (!isEditing) return;
    setPortals((p) => p.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await API.post("/portals", { clientId: client.id, portals });
      setSnackbar({
        show: true,
        message: "Portals saved successfully",
        type: "success",
      });
      setIsEditing(false); // go back to view mode
    } catch (err) {
      setSnackbar({ show: true, message: err.message, type: "error" });
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow border p-3">
        {/* Non-editable company header */}
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
          <div key={index} className="border rounded p-3 mb-3 bg-light">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Portal Name</label>
                <select
                  name="portalName"
                  value={portal.portalName}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                >
                  <option value="">Select Portal</option>
                  {COMMON_PORTALS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={portal.username}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Password</label>
                <input
                  type="text"
                  name="password"
                  value={portal.password}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select
                  name="status"
                  value={portal.status}
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

            {isEditing && index > 0 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removePortalRow(index)}
              >
                Remove Portal
              </button>
            )}
          </div>
        ))}

        {/* Buttons aligned like ViewClient */}
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
              <button
                className="btn btn-outline-primary"
                onClick={addPortalRow}
              >
                + Add Portal
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

export default ViewPortal;
