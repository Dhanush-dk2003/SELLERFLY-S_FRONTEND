import React, { useState, useEffect } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];
const COMMON_PORTALS = [
  "Amazon", "Flipkart", "Meesho", "JioMart", "Ajio",
  "Amazon Bazaar", "Shopify", "Snapdeal", "Custom"
];

const ViewPortal = ({ client, onClose }) => {
  const [portals, setPortals] = useState([]);
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [deletedPortals, setDeletedPortals] = useState([]);


  useEffect(() => {
    const initial = (client.portals || []).map((p) => {
      const isCommon = COMMON_PORTALS.includes(p.portalName);
      return {
        ...p,
        portalName: isCommon ? p.portalName : "Custom",
        customPortal: isCommon ? "" : p.portalName,
      };
    });
    setPortals(initial);
  }, [client]);

  const handleChange = (index, e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setPortals((prev) => {
      const copy = [...prev];
      if (name === "portalName") {
        copy[index].portalName = value;
        if (value !== "Custom") copy[index].customPortal = "";
      } else {
        copy[index][name] = value;
      }
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
  setPortals((p) => {
    const removed = p[index];
    if (removed.id && window.confirm("Are you sure you want to remove portal?")) {
      setDeletedPortals((prev) => [...prev, removed.id]);
    }
    return p.filter((_, i) => i !== index);
  });
};


  const handleSave = async () => {
  try {
    for (const p of portals) {
      const payload = {
  portalName: p.portalName === "Custom" ? p.customPortal : p.portalName,
  username: p.username,
  password: p.password,
  status: p.status || "TODO",
  remarks: p.remarks || null,
  startDate: p.startDate || null,
  endDate: p.endDate || null,
  portalHealth: p.portalHealth || null,
  portalLink: p.portalLink || null,
  masterLink: p.masterLink || null,
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

    // 🆕 delete removed ones
    for (const id of deletedPortals) {
      await API.delete(`/portals/${id}`);
    }
    setDeletedPortals([]);


      setSnackbar({ show: true, message: "Portals saved successfully", type: "success" });
      setIsEditing(false);

      const res = await API.get(`/portals/client/${client.id}`);
      const normalized = (res.data || []).map((p) => {
        const isCommon = COMMON_PORTALS.includes(p.portalName);
        return {
          ...p,
          portalName: isCommon ? p.portalName : "Custom",
          customPortal: isCommon ? "" : p.portalName,
        };
      });
      setPortals(normalized);
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

        {portals.map((portal, index) => {
          const effectiveName = portal.portalName === "Custom" ? (portal.customPortal || "") : portal.portalName;
          return (
            <div key={portal.id || index} className="border rounded p-3 mb-3 bg-light">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Portal Name</label>
                  {!isEditing ? (
                    <input className="form-control" value={effectiveName} disabled />
                  ) : (
                    <>
                      <select
                        name="portalName"
                        value={portal.portalName}
                        onChange={(e) => handleChange(index, e)}
                        className="form-control mb-2"
                      >
                        <option value="">Select Portal</option>
                        {COMMON_PORTALS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {portal.portalName === "Custom" && (
                        <input
                          type="text"
                          name="customPortal"
                          value={portal.customPortal || ""}
                          onChange={(e) => handleChange(index, e)}
                          className="form-control"
                          placeholder="Enter Custom Portal Name"
                          required
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="col-md-4 mb-3">
  <label>Portal Health</label>
  <select
    name="portalHealth"
    value={portal.portalHealth}
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
                <div className="col-md-4 mb-3">
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

<div className="col-md-4 mb-3">
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
          );
        })}

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
              <button className="btn btn-outline-primary" onClick={addPortalRow}>
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
