import React, { useState } from "react";
import API from "../../../axios";
import Snackbar from "../../../components/Snackbar";


const ViewProfile = ({ initialProfile, onClose }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicBase64, setNewProfilePicBase64] = useState(null);
  const [snackbar, setSnackbar] = useState({
  show: false,
  message: "",
  type: "success", // can be "success", "error", or "warning"
});

const handleCloseSnackbar = () =>
  setSnackbar((prev) => ({ ...prev, show: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewProfilePicBase64(reader.result);
      setProfile((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const updatedProfile = { ...profile };

      if (newProfilePicBase64) {
        updatedProfile.profilePic = newProfilePicBase64;
      }
      // console.log(updatedProfile.profilePic)

      await API.put(`/profile/${profile.employeeId}`, updatedProfile);

      const refreshed = await API.get(`/profile/${profile.employeeId}`);
      setProfile(refreshed.data);

      setSnackbar({
  show: true,
  message: "Profile updated successfully!",
  type: "success",
});

      setIsEditing(false);
      setNewProfilePicBase64(null);
    } catch (err) {
      console.error(err);
      setSnackbar({
  show: true,
  message: "Failed to update profile",
  type: "error",
});

    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this profile?"))
      return;

    try {
      await API.delete(`/profile/${profile.employeeId}`);
      setSnackbar({
  show: true,
  message: "Profile deleted successfully!",
  type: "success",
});

      setProfile(null);
    } catch (err) {
      console.error(err);
      setSnackbar({
  show: true,
  message: "Failed to delete profile",
  type: "error",
});

    }
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

  return (
    <div className="d-flex">
      <div className="container py-4 ">
        {profile && (
          <div className="position-relative p-4 bg-white rounded shadow">
            {/* X Close Button */}
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

            <h4 className="mb-4">Employee Profile</h4>

            <form>
              <div className="row">
                {/* Profile Picture */}
                <div className="col-md-3 d-flex justify-content-center align-items-start">
                  <div className="text-center">
                    <div
                      className="border border-secondary mb-2"
                      style={{
                        width: "150px",
                        height: "150px",
                        overflow: "hidden",
                        borderRadius: "50%",
                        backgroundColor: "#f8f9fa",
                        position: "relative",
                        cursor: isEditing ? "pointer" : "default",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <label
                            htmlFor="editProfilePic"
                            style={{
                              cursor: "pointer",
                              display: "block",
                              height: "100%",
                            }}
                          >
                            {newProfilePicBase64 || profile.profilePic ? (
                              <img
                                src={newProfilePicBase64 || profile.profilePic}
                                alt="Preview"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  objectPosition: "center",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  height: "100%",
                                  color: "#6c757d",
                                  fontSize: "14px",
                                }}
                              >
                                Upload Image
                              </div>
                            )}
                          </label>
                          <input
                            type="file"
                            id="editProfilePic"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                        </>
                      ) : profile.profilePic ? (
                        <img
                          src={profile.profilePic}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: "100%",
                            color: "#6c757d",
                            fontSize: "14px",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-9">
                  {/* Personal Info */}
                  <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Personal Information</h5>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.employeeId}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dob"
                          value={formatDate(profile.dob)}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Gender</label>
                        <select
                          className="form-control"
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
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
                          value={profile.bloodGroup}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Date of Joining</label>
                        <input
                          type="date"
                          className="form-control"
                          name="joiningDate"
                          value={formatDate(profile.joiningDate)}
                          onChange={handleChange}
                          disabled={!isEditing}
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
                          value={profile.phoneNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Emergency Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyNumber"
                          value={profile.emergencyNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Official Email ID</label>
                        <input
                          type="email"
                          className="form-control"
                          name="officialEmail"
                          value={profile.officialEmail}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Personal Email ID</label>
                        <input
                          type="email"
                          className="form-control"
                          name="personalEmail"
                          value={profile.personalEmail}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label>Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          rows="4"
                          value={profile.address}
                          onChange={handleChange}
                          disabled={!isEditing}
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
                          value={profile.role}
                          onChange={handleChange}
                          disabled={!isEditing}
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
                          value={profile.department}
                          onChange={handleChange}
                          disabled={!isEditing}
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
                          <option value="WEB DEVELOPMENT">
                            Web Development
                          </option>
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
                          value={profile.designation}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Salary</label>
                        <input
                          type="text"
                          className="form-control"
                          name="salary"
                          value={profile.salary}
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
                          className="form-control"
                          name="bankName"
                          value={profile.bankName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="accountNumber"
                          value={profile.accountNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>IFSC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ifscCode"
                          value={profile.ifscCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Edit Button at Bottom */}
  {!isEditing && (
    <div className="text-end mt-4">
      <button
        className="btn btn-outline-primary px-4 py-2 fw-bold"
        onClick={handleEdit}
      >
        Edit
      </button>
    </div>
  )}

                  {isEditing && (
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
              </div>
            </form>
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

export default ViewProfile;
