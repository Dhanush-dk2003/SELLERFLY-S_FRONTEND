import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Sidebar from "../../commonpages/Sidebar";
import ClientTable from "./ClientTable";
import FollowupTable from "./FollowupTable";

const GrowthManagement = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const isLargeScreen = useMediaQuery({ minWidth: 992 });

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
          <h1 className="mb-4 mt-4">Growth Management</h1>

          {/* Tabs */}
          <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "clients" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("clients")}
            >
              Clients
            </button>
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "followups" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("followups")}
            >
              Followups
            </button>
          </div>

          {/* Content */}
          {activeTab === "clients" && <ClientTable />}
          {activeTab === "followups" && <FollowupTable />}
        </div>
      </div>
    </div>
  );
};

export default GrowthManagement;
