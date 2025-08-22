import React, { useState } from "react";
import Sidebar from "../../commonpages/Sidebar";
import CatalogTable from "./CatalogTable";
import Snackbar from "../../../components/Snackbar";
import { useMediaQuery } from "react-responsive";

const CatalogRegistration = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 992 });
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "" // just keep it as string in JS
  });

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <Sidebar />

      <div
        className="flex-grow-1 px-3 py-4"
        style={{
          marginLeft: isLargeScreen ? "250px" : "0",
          marginRight: isLargeScreen ? "50px" : "0",
        }}
      >
        <div className="container-fluid">
          <h1 className="mb-4 mt-4">Key Account Management</h1>

          {/* Catalog Table */}
          <CatalogTable />

          {/* Snackbar */}
          <Snackbar
            message={snackbar.message}
            show={snackbar.show}
            type={snackbar.type}
            onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogRegistration;
