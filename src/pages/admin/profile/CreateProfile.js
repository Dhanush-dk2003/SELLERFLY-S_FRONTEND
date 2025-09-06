// CreateProfileForm.js
import React, { useState } from "react";
import { useEffect } from "react";
import Snackbar from "../../../components/Snackbar";

const CreateProfileForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    joiningDate: "",
    phoneNumber: "",
    emergencyNumber: "",
    officialEmail: "",
    personalEmail: "",
    address: "",
    role: "",
    department: "",
    designation: "",
    salary: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    profilePic: null,
  });
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success", // can be "success", "error", or "warning"
  });

  const fetchNextId = async () => {
    const res = await fetch("https://sellerfly-backend-production.up.railway.app/api/users/next-id");
    // const res = await fetch("http://localhost:5000/api/users/next-id");
    const data = await res.json();
    setFormData((prev) => ({ ...prev, employeeId: data.nextId }));
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, show: false }));
  useEffect(() => {
    fetchNextId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation
    const requiredFields = [
      "employeeId",
      "firstName",
      "lastName",
      "dob",
      "gender",
      "joiningDate",
      "phoneNumber",
      "emergencyNumber",
      "officialEmail",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setSnackbar({
        show: true,
        message: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
        type: "error",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "profilePic" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }

      // const response = await fetch("http://localhost:5000/api/users/create", {
      const response = await fetch("https://sellerfly-backend-production.up.railway.app/api/users/create",{
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setSnackbar({
          show: true,
          message: "Profile created successfully!",
          type: "success",
        });
        setFormData({
          employeeId: "",
          firstName: "",
          lastName: "",
          dob: "",
          gender: "",
          bloodGroup: "",
          joiningDate: "",
          phoneNumber: "",
          emergencyNumber: "",
          officialEmail: "",
          personalEmail: "",
          address: "",
          role: "",
          department: "",
          designation: "",
          salary: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          profilePic: null,
        });
        fetchNextId();
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
            {/* Profile Picture */}
            <div className="col-md-3 d-flex justify-content-center align-items-start">
              <div className="text-center">
                <label htmlFor="profilePic">
                  <div
                    className="rounded-circle border border-secondary mb-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      overflow: "hidden",
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    {formData.profilePic ? (
                      <img
                        src={URL.createObjectURL(formData.profilePic)}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)} // ✅ prevent memory leak
                      />
                    ) : (
                      <span style={{ color: "#6c757d", fontSize: "14px" }}>
                        Upload Image
                      </span>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Info Fields */}
            <div className="col-md-9">
              {/* Personal Info */}
              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Personal Information</h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      className="form-control"
                      value={formData.employeeId || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      onChange={handleChange}
                      value={formData.firstName || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      onChange={handleChange}
                      value={formData.lastName || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dob"
                      onChange={handleChange}
                      value={formData.dob || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Gender</label>
                    <select
                      className="form-control"
                      name="gender"
                      onChange={handleChange}
                      value={formData.gender || ""}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Blood Group</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bloodGroup"
                      onChange={handleChange}
                      value={formData.bloodGroup || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Date of Joining</label>
                    <input
                      type="date"
                      className="form-control"
                      name="joiningDate"
                      onChange={handleChange}
                      value={formData.joiningDate || ""}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Contact Information</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      onChange={handleChange}
                      value={formData.phoneNumber || ""}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Emergency Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="emergencyNumber"
                      onChange={handleChange}
                      value={formData.emergencyNumber || ""}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Official Email ID</label>
                    <input
                      type="email"
                      className="form-control"
                      name="officialEmail"
                      onChange={handleChange}
                      value={formData.officialEmail || ""}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Personal Email ID</label>
                    <input
                      type="email"
                      className="form-control"
                      name="personalEmail"
                      onChange={handleChange}
                      value={formData.personalEmail || ""}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label>Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="4"
                      onChange={handleChange}
                      value={formData.address || ""}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3">Employee Details</h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>Role</label>
                    <select
                      className="form-control"
                      name="role"
                      onChange={handleChange}
                      value={formData.role || ""}
                    >
                      <option value="">Select</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="USER">Employee</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Department</label>
                    <select
                      className="form-control"
                      name="department"
                      onChange={handleChange}
                      value={formData.department || ""}
                    >
                      <option value="">Select</option>
                      <option value="REGISTRATION TEAM">
                        Registration Team
                      </option>
                      <option value="KEY ACC MANAGEMENT">
                        Key Account Management
                      </option>
                      <option value="GROWTH MANAGEMENT">
                        Growth Management
                      </option>
                      <option value="DIGITAL MARKETING">
                        Digital Marketing
                      </option>
                      <option value="WEB DEVELOPMENT">Web Development</option>
                      <option value="TELE CALLING TEAM">
                        Tele Calling Team
                      </option>
                      <option value="MANAGEMENT">Management</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      onChange={handleChange}
                      value={formData.designation || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Salary</label>
                    <input
                      type="text"
                      className="form-control"
                      name="salary"
                      onChange={handleChange}
                      value={formData.salary || ""}
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
                      className="form-control"
                      name="bankName"
                      onChange={handleChange}
                      value={formData.bankName || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="accountNumber"
                      onChange={handleChange}
                      value={formData.accountNumber || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ifscCode"
                      onChange={handleChange}
                      value={formData.ifscCode || ""}
                    />
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary px-4">
                  Save Profile
                </button>
              </div>
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

export default CreateProfileForm;
