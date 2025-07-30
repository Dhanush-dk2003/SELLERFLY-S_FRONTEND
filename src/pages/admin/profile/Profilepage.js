// src/pages/Profile.js
import React, { useState } from "react";
import Sidebar from "../../commonpages/Sidebar";
import CreateProfile from "./CreateProfile";
import { useMediaQuery } from "react-responsive";
import ProfileTable from "./ProfileTable";

const Profile = () => {
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
          <h1 className="mb-4 mt-4">Employee Profile Management</h1>

          <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "view" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("view")}
            >
              View Profile
            </button>
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "create" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create Profile
            </button>
            
          </div>


          {activeTab === "view" ? <ProfileTable />  : activeTab === "create" ? <CreateProfile />  : null}

        </div>
      </div>
    </div>
  );
};

export default Profile;
