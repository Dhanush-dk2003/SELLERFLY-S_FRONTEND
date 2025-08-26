import React, { useState } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";

const ViewgrowthClient = ({ initialClient, onClose }) => {
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
        productCount: client.productCount ? parseInt(client.productCount) : 0,
        isActive: !!client.isActive,
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

  if (!client) return null;

  return (
    <div className="d-flex">
      <div className="container py-4">
        <div className="position-relative p-4 bg-white rounded shadow">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn position-absolute top-0 end-0"
            style={{ border: "none", fontSize: "2rem", lineHeight: "1" }}
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="mb-4">{client.companyName}'s Details</h3>

          {/* Active Toggle */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="isActiveSwitch"
              name="isActive"
              checked={client.isActive || false}
              onChange={(e) =>
                setClient((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              disabled={!isEditing}
            />
            <label className="form-check-label" htmlFor="isActiveSwitch">
              {client.isActive ? "Active" : "Inactive"}
            </label>
          </div>

          {/* Client Info */}
          <div className="border rounded p-3 mb-4">
            <h5 className="mb-3">Client Information</h5>
            <div className="row">
              {[
                { key: "fullName", label: "Full Name", type: "text" },
                { key: "companyName", label: "Company Name", type: "text" },
                { key: "mobileNumber", label: "Mobile Number", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "category", label: "Category", type: "text" },
              ].map(({ key, label, type }) => (
                <div className="col-md-4 mb-3" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    name={key}
                    className="form-control"
                    value={client[key] || ""}
                    onChange={handleChange}
                    disabled={
                      !isEditing ||
                      key === "fullName" ||
                      key === "companyName" ||
                      key === "email" ||
                      key === "category"
                    }
                  />
                </div>
              ))}

              {/* Product Count */}
              <div className="col-md-4 mb-3">
                <label>Product Count</label>
                <input
                  type="number"
                  name="productCount"
                  value={client.productCount }
                  onChange={handleChange}
                  className="form-control"
                  disabled={!isEditing}
                />
              </div>

              {/* Address */}
              <div className="col-md-12 mb-3">
                <label>Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={client.address || ""}
                  rows="3"
                  onChange={handleChange}
                  disabled={!isEditing}
                ></textarea>
              </div>

              {/* Description */}
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
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
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

export default ViewgrowthClient;
