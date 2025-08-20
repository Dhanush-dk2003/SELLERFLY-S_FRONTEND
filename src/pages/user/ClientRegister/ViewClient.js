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
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const updateData = {
        fullName: client.fullName,
        companyName: client.companyName,
        mobileNumber: client.mobileNumber,
        address: client.address,
        email: client.email,
        pickupAddress: client.pickupAddress,
        panNumber: client.panNumber,
        pancardLink: client.pancardLink,
        bankName: client.bankName,
        branchName: client.branchName,
        accountHolderName: client.accountHolderName,
        accountNumber: client.accountNumber,
        ifscCode: client.ifscCode,
        gstCertificateLink: client.gstCertificateLink,
        trademarkCertificateLink: client.trademarkCertificateLink,
        cancelChequeLink: client.cancelChequeLink,
        signatureLink: client.signatureLink,
        budget: client.budget ? parseFloat(client.budget) : null,
      };

      console.log("Sending update data:", updateData);

      await API.put(`/clients/${client.id}`, updateData, {
        headers: { "Content-Type": "application/json" },
      });

      const refreshed = await API.get(`/clients/${client.id}`);
      console.log("Refreshed client data:", refreshed.data);
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

  // In ViewClient.js
const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this client?")) return;

  try {
    // Log the client object to verify ID field
    console.log("Client object:", client);

    // Use client.id if available, otherwise fallback to client._id
    const clientId = client.id || client._id;
    if (!clientId) {
      throw new Error("Client ID is missing");
    }

    await API.delete(`/clients/${clientId}`);
    setSnackbar({
      show: true,
      message: "Client deleted successfully!",
      type: "success",
    });
    onDelete(clientId); // Notify parent with the correct ID
    onClose(); // Close the ViewClient component
    setClient(null); // Clear client state
  } catch (err) {
    console.error("Delete error:", err);
    setSnackbar({
      show: true,
      message: `Failed to delete client: ${err.response?.data?.message || err.message}`,
      type: "error",
    });
  }
};

  return (
    <div className="d-flex">
      <div className="container py-4">
        {client && (
          <div className="position-relative p-4 bg-white rounded shadow">
            <button
              onClick={onClose}
              className="btn position-absolute top-0 end-0 m-0"
              style={{
                zIndex: 10,
                border: "none",
                fontSize: "2rem",
                lineHeight: "1",
              }}
              aria-label="Close"
            >
              &times;
            </button>

            <h4 className="mb-4">Client Details</h4>

            {/* Basic Info */}
            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Basic Information</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={client.fullName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="form-control"
                    value={client.companyName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    className="form-control"
                    value={client.mobileNumber || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={client.email || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
  <label>Package (INR)</label>
  <input
    type="number"
    name="budget"
    className="form-control"
    value={client.budget || ""}
    onChange={handleChange}
    disabled={!isEditing}
  />
</div>
<div className="col-md-6 mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={client.address || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Pickup Address</label>
                  <input
                    type="text"
                    name="pickupAddress"
                    className="form-control"
                    value={client.pickupAddress || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    className="form-control"
                    value={client.panNumber || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Bank Details</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    className="form-control"
                    value={client.bankName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    className="form-control"
                    value={client.branchName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    className="form-control"
                    value={client.accountHolderName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    className="form-control"
                    value={client.accountNumber || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    className="form-control"
                    value={client.ifscCode || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Document Links */}
            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Document Links</h5>
              {[
                { key: "pancardLink", label: "PAN Card Link" }, // Changed to pancardLink
                { key: "gstCertificateLink", label: "GST Certificate Link" },
                { key: "trademarkCertificateLink", label: "Trademark Certificate Link" },
                { key: "cancelChequeLink", label: "Cancelled Cheque Link" },
                { key: "signatureLink", label: "Signature Link" },
              ].map(({ key, label }) => (
                <div className="mb-3" key={key}>
                  <label>{label}</label>
                  {!isEditing ? (
                    client[key] ? (
                      <div>
                        <a href={client[key]} target="_blank" rel="noopener noreferrer">
                          View File
                        </a>
                      </div>
                    ) : (
                      <p className="text-muted">No link provided</p>
                    )
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={client[key] || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            {!isEditing ? (
              <div className="text-end mt-4">
                <button
                  className="btn btn-outline-primary px-4 py-2 fw-bold"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="text-end">
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
              </div>
            )}
          </div>
        )}
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