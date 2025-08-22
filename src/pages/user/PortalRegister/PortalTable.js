import React, { useEffect, useState } from "react";
import API from "../../../axios";
import ViewPortal from "./ViewPortal";

const PortalTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const res = await API.get("/portals/grouped"); // new API
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (err) {
        console.error("Failed to fetch portals", err);
      }
    };
    fetchPortals();
  }, []);

  const handleSearch = () => {
  if (!searchValue.trim()) {
    setFilteredClients(clients);
    return;
  }

  const results = clients.filter((c) =>
    c.companyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
    c.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
    c.mobileNumber?.toString().includes(searchValue) // no lowercase for numbers
  );

  setFilteredClients(results);
};


  if (selectedClient) {
    return (
      <ViewPortal
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="d-flex justify-content-end" style={{ width: "100%" }}>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{ maxWidth: "400px" }}
            />
            <button className="btn btn-primary ms-2" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="card mt-4 shadow border p-3">
        <h5>All Clients with Portals</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Mobile Number</th>
                <th>View Portals</th>
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
                  <td colSpan="5" className="text-center">
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

export default PortalTable;
