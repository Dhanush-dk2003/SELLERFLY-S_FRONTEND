import React, { useState } from "react";
import Snackbar from "../../../components/Snackbar";

const PORTAL_ENUM_STATUSES = ["TODO", "IN_PROGRESS", "DONE"];
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

const CreatePortal = () => {
  const [clientQuery, setClientQuery] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [clientId, setClientId] = useState(null);

  const [portals, setPortals] = useState([
    {
      portalName: "",
      customPortal: "",
      username: "",
      password: "",
      status: "",
      remarks: "",
      startDate: "",
      endDate: "",
      portalHealth: "",
      registeredBy: "US", // default
    },
  ]);

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const closeSnackbar = () => setSnackbar((s) => ({ ...s, show: false }));

  // 🔍 Autocomplete search
  const handleClientSearch = async (query) => {
    setClientQuery(query);
    if (!query.trim()) {
      setClientSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/clients/search/${query}`
      );
      // const res = await fetch(`https://sellerfly-backend-production.up.railway.app/api/clients/search/${query}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setClientSuggestions(data);
      } else {
        setClientSuggestions([]);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const selectClient = (client) => {
    setClientId(client.id);
    setClientQuery(client.companyName || client.fullName);
    setClientSuggestions([]);
  };

  const handlePortalChange = (index, e) => {
    const { name, value } = e.target;
    setPortals((prev) => {
      const copy = [...prev];
      copy[index][name] = value;
      return copy;
    });
  };

  const addPortalRow = () =>
    setPortals((p) => [
      ...p,
      {
        portalName: "",
        customPortal: "",
        username: "",
        password: "",
        status: "",
        remarks: "",
        startDate: "",
        endDate: "",
        portalHealth: "",
        registeredBy: "US",
      },
    ]);

  const removePortalRow = (index) =>
    setPortals((p) => p.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setSnackbar({
        show: true,
        message: "Please select a Client",
        type: "error",
      });
      return;
    }

    const payload = {
      clientId: Number(clientId),
      portals: portals.map((p) => ({
        portalName: p.portalName === "Custom" ? p.customPortal : p.portalName,
        username: p.username,
        password: p.password,
        status: PORTAL_ENUM_STATUSES.includes(p.status) ? p.status : "TODO",
        remarks: p.remarks || null,
        startDate: p.startDate || null,
        endDate: p.endDate || null,
        portalHealth: p.portalHealth || null,
        registeredBy: p.registeredBy || "US",
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/api/portals", {
        // const res = await fetch("https://sellerfly-backend-production.up.railway.app/api/portals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result?.message || "Error creating portals");

      setSnackbar({
        show: true,
        message: "Portals created successfully!",
        type: "success",
      });
      setClientQuery("");
      setClientId(null);
      setPortals([
        {
          portalName: "",
          customPortal: "",
          username: "",
          password: "",
          status: "",
          remarks: "",
          startDate: "",
          endDate: "",
          portalHealth: "",
        },
      ]);
    } catch (err) {
      setSnackbar({ show: true, message: err.message, type: "error" });
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow border p-4">
        <form onSubmit={handleSubmit}>
          {/* Company Name with Autocomplete */}
          <div className="mb-3 position-relative">
            <h4>Company Name</h4>
            <input
              type="text"
              className="form-control"
              value={clientQuery}
              onChange={(e) => handleClientSearch(e.target.value)}
              placeholder="Search by Company Name"
              required
            />
            {clientSuggestions.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10 }}
              >
                {clientSuggestions.map((c) => (
                  <li
                    key={c.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => selectClient(c)}
                    style={{ cursor: "pointer" }}
                  >
                    {c.companyName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Portals Section */}
          {portals.map((portal, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="row">
                {/* Portal Name dropdown + custom */}
                <div className="col-md-6 mb-3">
                  <label>Portal Name</label>
                  <select
                    name="portalName"
                    value={portal.portalName}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Portal</option>
                    {COMMON_PORTALS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {portal.portalName === "Custom" && (
                  <div className="col-md-6 mb-3">
                    <label>Custom Portal Name</label>
                    <input
                      type="text"
                      name="customPortal"
                      value={portal.customPortal}
                      onChange={(e) => handlePortalChange(index, e)}
                      className="form-control"
                      required
                    />
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label>Portal Registration</label>
                  <select
                    name="registeredBy"
                    value={portal.registeredBy}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                    required
                  >
                    <option value="US">Registered by Us</option>
                    <option value="CLIENT">Registered by Client</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={portal.username}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input
                    type="text"
                    name="password"
                    value={portal.password}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={portal.startDate}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={portal.endDate}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Portal Health</label>
                  <select
                    name="portalHealth"
                    value={portal.portalHealth}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
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
                    value={portal.status}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                  >
                    <option value="">Select Status</option>
                    {PORTAL_ENUM_STATUSES.map((s) => (
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
                    value={portal.remarks}
                    onChange={(e) => handlePortalChange(index, e)}
                    className="form-control"
                    rows="2"
                  />
                </div>
              </div>

              {index > 0 && (
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

          <div className="text-end">
            <button
              type="button"
              className="btn btn-outline-primary me-2"
              onClick={addPortalRow}
            >
              + Add Another Portal
            </button>
            <button type="submit" className="btn btn-primary px-4">
              Save All Portals
            </button>
          </div>
        </form>
      </div>

      <Snackbar
        message={snackbar.message}
        show={snackbar.show}
        onClose={closeSnackbar}
        type={snackbar.type}
      />
    </div>
  );
};

export default CreatePortal;
