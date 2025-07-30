import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Sidebar from "../commonpages/Sidebar";
import ManagerDailyStatus from "./ManagerDailyStatus";
import ManagerMonthlyStatus from "./ManagerMonthlyStatus";
import { useMediaQuery } from "react-responsive";

const ManagerStatus = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const { user } = useContext(AuthContext);

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
          <h1 className="mb-4 mt-4">{user?.name || "Manager"}'s Review</h1>

          <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "daily" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("daily")}
            >
              Daily Status
            </button>
            <button
              className={`btn px-4 py-2 rounded-4 fw-bold ${
                activeTab === "monthly" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly Status
            </button>
          </div>

          <div>
            {activeTab === "daily" ? (
              <ManagerDailyStatus />
            ) : (
              <ManagerMonthlyStatus />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerStatus;
