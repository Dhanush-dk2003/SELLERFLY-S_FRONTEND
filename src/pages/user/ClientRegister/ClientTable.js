// src/pages/clients/ClientTable.js
import React, { useEffect, useState } from "react";
import API from "../../../axios";
import ViewClient from "./ViewClient";

const ClientTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get("/clients");
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setFilteredClients(clients);
      return;
    }

    try {
      const res = await API.get(`/clients/search/${searchValue}`);
      const result = res.data;

      if (Array.isArray(result)) {
        setFilteredClients(result);
      } else if (result) {
        setFilteredClients([result]);
      } else {
        setFilteredClients([]);
      }
    } catch (err) {
      setFilteredClients([]);
      alert("Client not found");
    }
  };

  // Add this handler to update the table after deletion
  const handleClientDelete = (deletedClientId) => {
    // Use _id if your API returns _id in client objects
    setClients((prevClients) => prevClients.filter((client) => client.id !== deletedClientId));
setFilteredClients((prevFiltered) => prevFiltered.filter((client) => client.id !== deletedClientId));
  };

  if (selectedClient) {
    return (
      <ViewClient
        initialClient={selectedClient}
        onClose={() => setSelectedClient(null)}
        onDelete={handleClientDelete} // Ensure this is passed
      />
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        {/* Search Input */}
        <div className="d-flex justify-content-end " style={{ width: "100%" }}>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Client Name"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      style={{ maxWidth: "300px" }}
    />
    <button className="btn btn-primary ms-2" onClick={handleSearch}>
      Search
    </button>
  </div>
</div>
      </div>

      <div className="card mt-4 shadow border p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Clients</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Full Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, idx) => (
                  <tr key={client._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{client.fullName}</td>
                    <td>{client.mobileNumber}</td>
                    <td>{client.email}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ClientTable;