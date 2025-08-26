import React, { useState } from "react";
import API from "../../../axios";

const AddFollowupModal = ({ onClose }) => {
  const [companyName, setCompanyName] = useState("");
  const [portalName, setPortalName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    await API.post("/growth/followup", {
      companyName,
      portalName,
      type,
      description,
    });
    onClose();
  };

  return (
    <div className="modal d-block">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Add Followup</h5>
          <div className="mb-2">
            <label>Company Name</label>
            <input
              type="text"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Portal Name</label>
            <input
              type="text"
              className="form-control"
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Type</label>
            <input
              type="text"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFollowupModal;
