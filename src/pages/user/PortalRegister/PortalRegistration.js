import React, { useState } from "react";
import Sidebar from "../../commonpages/Sidebar";
import PortalTable from "./PortalTable";
import CreatePortal from "./CreatePortal";
import { useMediaQuery } from "react-responsive";

const PortalRegistration = () => {
  const [activeTab, setActiveTab] = useState("view");
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
          <h1 className="mb-4 mt-4">Portal Management</h1>

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
                activeTab === "create" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create Portal
            </button>
          </div>

          {activeTab === "view" ? <PortalTable /> : <CreatePortal />}
        </div>
      </div>
    </div>
  );
};

export default PortalRegistration;
