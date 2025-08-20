import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useMediaQuery } from "react-responsive";
import Sidebar from "../commonpages/Sidebar";
import Snackbar from "../../components/Snackbar";

const PortalRegistration = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("add");
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const [portals, setPortals] = useState([]);
  const [newPortal, setNewPortal] = useState({
    companyName: "",
    portalName: "",
    username: "",
    password: "",
  });
  const [customPortal, setCustomPortal] = useState("");
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const portalOptions = [
    "Amazon",
    "Amazon Bazaar",
    "Flipkart",
    "JioMart",
    "Meesho",
    "Ajio",
    "ShopShy",
  ];

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, show: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPortal((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPortal = () => {
    if (
      !newPortal.companyName ||
      !newPortal.portalName ||
      !newPortal.username ||
      !newPortal.password
    ) {
      setSnackbar({
        show: true,
        message: "All fields are required",
        type: "error",
      });
      return;
    }

    setPortals((prev) => [...prev, newPortal]);
    setNewPortal({
      companyName: "",
      portalName: "",
      username: "",
      password: "",
    });
    setCustomPortal("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/portal-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          Department: user.department || "REGISTRATION",
        },
        body: JSON.stringify({ portals }),
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({
          show: true,
          message: "Portals saved successfully!",
          type: "success",
        });
        setPortals([]);
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
    <div className="d-flex flex-column flex-md-row">
      <Sidebar />
      <div
        className="flex-grow-1 px-3 py-4"
        style={{
          marginLeft: isLargeScreen ? "250px" : "0",
          marginRight: isLargeScreen ? "50px" : "0",
        }}
      >
        <div className="container-fluid">
          <h1 className="mb-4 mt-4">Portal Registration</h1>

          <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "view" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("view")}
            >
              View Portals
            </button>
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "add" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Portal
            </button>
          </div>

          {activeTab === "view" && (
            <div className="card shadow border p-4">
              <h5 className="mb-3">Portal List</h5>
              <p>Table of registered portals will be implemented in the backend step.</p>
            </div>
          )}

          {activeTab === "add" && (
            <div className="card shadow border p-4">
              <h5 className="mb-4">Add New Portal</h5>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="companyName"
                    value={newPortal.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Portal Name</label>
                  <select
                    className="form-control rounded-3"
                    name="portalName"
                    value={newPortal.portalName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {portalOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                {newPortal.portalName === "Custom" && (
                  <div className="col-md-3 mb-3">
                    <label>Custom Portal Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={customPortal}
                      onChange={(e) => {
                        setCustomPortal(e.target.value);
                        setNewPortal((prev) => ({
                          ...prev,
                          portalName: e.target.value,
                        }));
                      }}
                      required
                    />
                  </div>
                )}
                <div className="col-md-3 mb-3">
                  <label>Username/Email</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    name="username"
                    value={newPortal.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    name="password"
                    value={newPortal.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-secondary w-100 rounded-3"
                    onClick={handleAddPortal}
                  >
                    Add Portal
                  </button>
                </div>
              </div>

              {portals.length > 0 && (
                <div className="border rounded p-3 mt-4">
                  <h5 className="mb-3">Registered Portals</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Portal Name</th>
                        <th>Username/Email</th>
                        <th>Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portals.map((portal, index) => (
                        <tr key={index}>
                          <td>{portal.companyName}</td>
                          <td>{portal.portalName}</td>
                          <td>{portal.username}</td>
                          <td>{portal.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="text-end mt-3">
                <button type="button" className="btn btn-primary px-4 rounded-3" onClick={handleSubmit}>
                  Save
                </button>
              </div>
            </div>
          )}

          <Snackbar
            message={snackbar.message}
            show={snackbar.show}
            onClose={handleCloseSnackbar}
            type={snackbar.type}
          />
        </div>
      </div>
    </div>
  );
};

export default PortalRegistration;