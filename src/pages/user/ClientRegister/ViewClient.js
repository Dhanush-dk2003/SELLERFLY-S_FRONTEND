import React, { useState } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";

const ViewClient = ({ initialClient, onClose, onDelete }) => {
  const [client, setClient] = useState(initialClient);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, show: false }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const updateData = {
        ...client,
        budget: client.budget ? parseFloat(client.budget) : null,
      };

      await API.put(`/clients/${client.id}`, updateData, {
        headers: { "Content-Type": "application/json" },
      });

      const refreshed = await API.get(`/clients/${client.id}`);
      setClient(refreshed.data);

      setSnackbar({
        show: true,
        message: "Client updated successfully!",
        type: "success",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setSnackbar({
        show: true,
        message: "Failed to update client: " + err.message,
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const clientId = client.id || client._id;
      await API.delete(`/clients/${clientId}`);
      setSnackbar({
        show: true,
        message: "Client deleted successfully!",
        type: "success",
      });
      onDelete(clientId);
      onClose();
      setClient(null);
    } catch (err) {
      console.error("Delete error:", err);
      setSnackbar({
        show: true,
        message: `Failed to delete client: ${
          err.response?.data?.message || err.message
        }`,
        type: "error",
      });
    }
  };

  if (!client) return null;

  return (
    <div className="d-flex">
      <div className="container py-4">
        <div className="position-relative p-4 bg-white rounded shadow">
          <button
            onClick={onClose}
            className="btn position-absolute top-0 end-0"
            style={{ border: "none", fontSize: "2rem", lineHeight: "1" }}
            aria-label="Close"
          >
            &times;
          </button>

          <h4 className="mb-4">Client Details</h4>

          {/* Basic Info */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Basic Information</h5>
            <div className="row">
              {[
                { key: "fullName", label: "Full Name", type: "text" },
                { key: "companyName", label: "Company Name", type: "text" },
                { key: "mobileNumber", label: "Mobile Number", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "budget", label: "Package (INR)", type: "number" },
                { key: "address", label: "Address", type: "text" },
                { key: "pickupAddress", label: "Pickup Address", type: "text" },
                {
                  key: "gstCertificateNumber",
                  label: "GST Certificate Number",
                  type: "text",
                },
              ].map(({ key, label, type }) => (
                <div className="col-md-6 mb-3" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    name={key}
                    value={client[key] || ""}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={client.description || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                name="aPlus"
                checked={client.aPlus || false}
                onChange={handleChange}
                className="form-check-input"
                disabled={!isEditing}
              />
              <label className="form-check-label">A+ Content</label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                name="brandWebstore"
                checked={client.brandWebstore || false}
                onChange={handleChange}
                className="form-check-input"
                disabled={!isEditing}
              />
              <label className="form-check-label">Brand Webstore</label>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Bank Details</h5>
            <div className="row">
              {[
                { key: "bankName", label: "Bank Name" },
                { key: "branchName", label: "Branch Name" },
                { key: "accountHolderName", label: "Account Holder Name" },
                { key: "accountNumber", label: "Account Number" },
                { key: "ifscCode", label: "IFSC Code" },
              ].map(({ key, label }) => (
                <div className="col-md-4 mb-3" key={key}>
                  <label>{label}</label>
                  <input
                    type="text"
                    name={key}
                    className="form-control"
                    value={client[key] || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Documents Link */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Documents Link</h5>
            {!isEditing ? (
              client.documentsLink ? (
                <a
                  href={client.documentsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              ) : (
                <p className="text-muted">No link provided</p>
              )
            ) : (
              <input
                type="text"
                name="documentsLink"
                value={client.documentsLink || ""}
                onChange={handleChange}
                className="form-control"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="text-end mt-4">
            {!isEditing ? (
              <button
                className="btn btn-outline-primary px-4 py-2 fw-bold"
                onClick={handleEdit}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        show={snackbar.show}
        onClose={handleCloseSnackbar}
        type={snackbar.type}
      />
    </div>
  );
};

export default ViewClient;
