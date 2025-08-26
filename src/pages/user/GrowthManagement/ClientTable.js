// src/pages/clients/ClientTable.js
import React, { useEffect, useState } from "react";
import API from "../../../axios";
import ViewgrowthClient from "./ViewgrowthClient";

const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Modal state
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ Fetch only active clients
  const fetchClients = async () => {
    try {
      const res = await API.get("/clients/active");
      setClients(res.data);
      setFilteredClients(res.data);
    } catch (err) {
      console.error("Failed to fetch active clients", err);
    }
  };

  // ✅ Search bar for table (client search)
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setFilteredClients(clients);
      return;
    }
    const result = clients.filter((c) =>
      c.companyName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredClients(result);
  };

  // ✅ Auto-suggest company search for activation
  const handleCompanySearch = async (value) => {
    setCompanySearch(value);
    setSelectedCompany(null);

    if (!value.trim()) {
      setCompanySuggestions([]);
      return;
    }

    try {
      const res = await API.get(`/clients/search/${value}`);
      if (Array.isArray(res.data)) {
        setCompanySuggestions(res.data);
      } else {
        setCompanySuggestions([]);
      }
    } catch (err) {
      console.error("Company search error", err);
      setCompanySuggestions([]);
    }
  };

  // ✅ Activate selected company
  const handleActivateClient = async () => {
    if (!selectedCompany) return;
    try {
      await API.put(`/clients/activate/${selectedCompany.id}`);
      setShowActivateModal(false);
      setCompanySearch("");
      setCompanySuggestions([]);
      setSelectedCompany(null);
      fetchClients();
    } catch (err) {
      console.error("Activation failed", err);
    }
  };

  // ✅ If viewing a client details
  if (selectedClient) {
    return (
      <ViewgrowthClient
        initialClient={selectedClient}
        onClose={() => {
          setSelectedClient(null);
          fetchClients();
        }}
      />
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        {/* Activate Button on Left */}
        <button
          className="btn btn-success"
          onClick={() => setShowActivateModal(true)}
        >
          Activate Client
        </button>

        {/* Search bar on Right */}
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search Active Clients"
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

      {/* Activate Modal */}
      {showActivateModal && (
        <div className="card p-3 shadow-sm mb-3">
          <h5>Activate Client</h5>

          {/* Auto-suggest input */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Type company name..."
            value={companySearch}
            onChange={(e) => handleCompanySearch(e.target.value)}
          />

          {/* Suggestion Box */}
          {companySuggestions.length > 0 && (
            <ul className="list-group mb-2">
              {companySuggestions.map((company) => (
                <li
                  key={company.id}
                  className={`list-group-item ${
                    selectedCompany?.id === company.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedCompany(company);
                    setCompanySearch(company.companyName);
                    setCompanySuggestions([]); // close suggestions on select
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {company.companyName}
                </li>
              ))}
            </ul>
          )}

          {/* Action Buttons */}
          <div className="d-flex">
            <button
              className="btn btn-success me-2"
              disabled={!selectedCompany}
              onClick={handleActivateClient}
            >
              Activate
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowActivateModal(false);
                setCompanySearch("");
                setCompanySuggestions([]);
                setSelectedCompany(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="card mt-4 shadow border p-3">
        <h5>Active Clients</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, idx) => (
                  <tr key={client.id}>
                    <td>{idx + 1}</td>
                    <td>{client.companyName}</td>
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
                  <td colSpan="6" className="text-center">
                    No active clients found
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
