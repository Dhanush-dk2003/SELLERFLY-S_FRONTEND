import React, { useEffect, useState } from "react";
import API from "../../../axios";
import AddFollowupModal from "./AddFollowup";

const FollowupTable = () => {
  const [followups, setFollowups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchFollowups = async () => {
    const res = await API.get("/growth/followup", {
      params: { search, startDate, endDate },
    });
    setFollowups(res.data);
  };

  useEffect(() => {
    fetchFollowups();
  }, [search, startDate, endDate]);

  const handleDelete = async () => {
    await API.delete("/growth/followup", { data: { ids: selectedIds } });
    setSelectedIds([]);
    fetchFollowups();
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Followup
        </button>
        <button
          className="btn btn-danger"
          disabled={!selectedIds.length}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Company</th>
            <th>Portal</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {followups.map((f) => (
            <tr key={f.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(f.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, f.id]);
                    } else {
                      setSelectedIds(selectedIds.filter((id) => id !== f.id));
                    }
                  }}
                />
              </td>
              <td>{new Date(f.date).toLocaleDateString()}</td>
              <td>{f.companyName}</td>
              <td>{f.portalName}</td>
              <td>{f.type}</td>
              <td>{f.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddFollowupModal
          onClose={() => {
            setShowModal(false);
            fetchFollowups();
          }}
        />
      )}
    </div>
  );
};

export default FollowupTable;
