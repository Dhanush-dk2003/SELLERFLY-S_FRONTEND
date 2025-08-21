import React, { useState } from "react";
import Snackbar from "../../../components/Snackbar";

const CreateClient = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    mobileNumber: "",
    address: "",
    email: "",
    pickupAddress: "",
    gstCertificateNumber: "",   // ✅ replaced panNumber
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    documentsLink: "",          // ✅ only one document link
    description: "",            // ✅ new description box
    aPlusContent: false,        // ✅ checkbox
    brandWebstore: false,       // ✅ checkbox
    budget: "",
  });

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, show: false }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/clients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          show: true,
          message: "Client registered successfully!",
          type: "success",
        });
      } else {
        setSnackbar({
          show: true,
          message: result.message || "Error occurred",
          type: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        show: true,
        message: "Failed to submit: " + err.message,
        type: "error",
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow border p-4">
        <form onSubmit={handleSubmit}>
          <div className="row">

            {/* Client Information */}
            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Client Information</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-control"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    className="form-control"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Package (INR)</label>
                  <input
                    type="number"
                    name="budget"
                    className="form-control"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>GST Certificate Number</label>
                  <input
                    type="text"
                    name="gstCertificateNumber"
                    className="form-control"
                    value={formData.gstCertificateNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                <label>Documents Link</label>
                <input
                  type="url"
                  name="documentsLink"
                  className="form-control"
                  placeholder="Enter shared document link"
                  value={formData.documentsLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3 d-flex align-items-center">
                <div className="form-check me-3">
                  <input
                    type="checkbox"
                    name="aPlusContent"
                    checked={formData.aPlusContent}
                    onChange={handleChange}
                    className="form-check-input"
                    id="aPlusContent"
                  />
                  <label className="form-check-label" htmlFor="aPlusContent">
                    A+ Content
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="brandWebstore"
                    checked={formData.brandWebstore}
                    onChange={handleChange}
                    className="form-check-input"
                    id="brandWebstore"
                  />
                  <label className="form-check-label" htmlFor="brandWebstore">
                    Brand Webstore
                  </label>
                </div>
              </div>
                <div className="col-md-12 mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
                <div className="col-md-12 mb-3">
                  <label>Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-md-12 mb-3">
                  <label>Pickup Address</label>
                  <textarea
                    name="pickupAddress"
                    className="form-control"
                    rows="3"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                  ></textarea>
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
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    className="form-control"
                    value={formData.branchName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    className="form-control"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    className="form-control"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    className="form-control"
                    value={formData.ifscCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            

            <div className="text-end mt-3">
              <button type="submit" className="btn btn-primary px-4">
                Save Client
              </button>
            </div>
          </div>
        </form>
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

export default CreateClient;
