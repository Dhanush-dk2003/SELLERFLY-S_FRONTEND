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
      const clientId = client.id;
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

          {/* Client Information */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Client Information</h5>
            <div className="row">
              {[
                { key: "fullName", label: "Full Name", type: "text" },
                { key: "companyName", label: "Company Name", type: "text" },
                { key: "mobileNumber", label: "Mobile Number", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "budget", label: "Package (INR)", type: "number" },
                { key: "onboardedDate", label: "Onboarded Date", type: "date" },
                { key: "category", label: "Category", type: "text" },
              ].map(({ key, label, type }) => (
                <div className="col-md-4 mb-3" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    name={key}
                    className="form-control"
                    value={
                      key === "onboardedDate" && client[key]
                        ? client[key].split("T")[0]
                        : client[key] || ""
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              ))}

              <div className="col-md-6 mb-3 d-flex align-items-center">
                <div className="form-check me-4">
                  <input
                    type="checkbox"
                    name="aPlusContent"
                    checked={client.aPlusContent || false}
                    onChange={handleChange}
                    className="form-check-input"
                    id="aPlusContent"
                    disabled={!isEditing}
                  />
                  <label className="form-check-label" htmlFor="aPlusContent">
                    A+ Content
                  </label>
                </div>
                <div className="form-check me-4">
                  <input
                    type="checkbox"
                    name="brandWebstore"
                    checked={client.brandWebstore || false}
                    onChange={handleChange}
                    className="form-check-input"
                    id="brandWebstore"
                    disabled={!isEditing}
                  />
                  <label className="form-check-label" htmlFor="brandWebstore">
                    Brand Webstore
                  </label>
                </div>
                <div className="form-check me-4">
                  <input
                    type="checkbox"
                    name="brandRegistryDoc"
                    checked={client.brandRegistryDoc || false}
                    onChange={handleChange}
                    className="form-check-input"
                    id="brandRegistryDoc"
                    disabled={!isEditing}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="brandRegistryDoc"
                  >
                    Brand Registry
                  </label>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <label>Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={client.address || ""}
                  onChange={handleChange}
                  rows="3"
                  disabled={!isEditing}
                ></textarea>
              </div>

              <div className="col-md-12 mb-3">
                <label>Pickup Address</label>
                <textarea
                  name="pickupAddress"
                  className="form-control"
                  value={client.pickupAddress || ""}
                  onChange={handleChange}
                  rows="3"
                  disabled={!isEditing}
                ></textarea>
              </div>
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

          {/* Documents */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Documents</h5>
            <div className="d-flex flex-wrap mb-3">
              {[
                { key: "gstDoc", label: "GST" },
                { key: "panDoc", label: "PAN Card" },
                { key: "trademarkDoc", label: "Trademark" },
                {
                  key: "currentAccountDoc",
                  label: "Current Account/Cancelled Cheque",
                },
              ].map(({ key, label }) => (
                <div className="form-check me-3" key={key}>
                  <input
                    type="checkbox"
                    name={key}
                    checked={client[key] || false}
                    onChange={handleChange}
                    className="form-check-input me-2"
                    id={key}
                    disabled={!isEditing}
                  />
                  <label className="form-check-label me-5" htmlFor={key}>
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label>GST Certificate Number</label>
                <input
                  type="text"
                  name="gstCertificateNumber"
                  className="form-control"
                  value={client.gstCertificateNumber || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Documents Link</label>
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
                    type="url"
                    name="documentsLink"
                    className="form-control"
                    value={client.documentsLink || ""}
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="col-md-12 mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={client.description || ""}
                  onChange={handleChange}
                  rows="3"
                  disabled={!isEditing}
                ></textarea>
              </div>
            </div>
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
