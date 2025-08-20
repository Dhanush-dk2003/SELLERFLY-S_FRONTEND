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
  panNumber: "",
  pancardLink: "",       // new field added here
  bankName: "",
  branchName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  gstCertificateLink: "",
  trademarkCertificateLink: "",
  cancelChequeLink: "",
  signatureLink: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
  <label htmlFor="companyName">Company Name</label>
  <input
    type="text"
    id="companyName"
    name="companyName"
    className="form-control"
    placeholder="Enter company name"
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
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
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

                <div className="col-md-12 mb-3">
                  <label>Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-md-12 mb-3">
                  <label>Pickup Address</label>
                  <textarea
                    name="pickupAddress"
                    className="form-control"
                    rows="3"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-md-4 mb-3">
                  <label>PAN Card Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    className="form-control"
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Document Links */}
            <div className="border rounded p-3 mb-4">
              <h5 className="mb-3">Document Links</h5>
              <div className="col-md-4 mb-3">
  <label htmlFor="pancardLink">PAN Card Link</label>
  <input
    type="url"
    id="pancardLink"
    name="pancardLink"
    className="form-control"
    placeholder="Enter PAN card document link"
    value={formData.pancardLink}
    onChange={handleChange}
  />
</div>
              <div className="col-md-6 mb-3">
                <label>GST Certificate Link</label>
                <input
                  type="text"
                  name="gstCertificateLink"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Trademark Certificate Link</label>
                <input
                  type="text"
                  name="trademarkCertificateLink"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Cancelled Cheque Link</label>
                <input
                  type="text"
                  name="cancelChequeLink"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Signature Link</label>
                <input
                  type="text"
                  name="signatureLink"
                  className="form-control"
                  onChange={handleChange}
                />
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
