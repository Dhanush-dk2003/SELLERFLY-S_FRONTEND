// Updated ProfileTable.js with Filter Dropdown and Optimized ViewProfile Handling
import React, { useEffect, useState } from "react";
import API from "../../../axios";
import ViewProfile from "./ViewProfile";

const departmentOrder = [
  "MANAGEMENT",
  "ADMINISTRATION",
  "REGISTRATION TEAM",
  "KEY ACC MANAGEMENT",
  "GROWTH MANAGEMENT",
  "DIGITAL MARKETING",
  "WEB DEVELOPMENT",
  "TELE CALLING TEAM",
];

const ProfileTable = () => {
  const [searchId, setSearchId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await API.get("/users/profile");
        const sorted = sortProfiles(res.data);
        setProfiles(sorted);
        setFilteredProfiles(sorted);
      } catch (err) {
        console.error("Failed to fetch profiles", err);
      }
    };

    fetchProfiles();
  }, []);

  const handleSearch = async () => {
  const trimmedSearch = searchId.trim();
  if (!trimmedSearch) {
    // If search is empty or just spaces, show full table
    setFilteredProfiles(profiles);
    return;
  }

  try {
    const res = await API.get(`/users/search/${trimmedSearch}`);
    const result = res.data;

    if (Array.isArray(result)) {
      setFilteredProfiles(result);
    } else {
      setFilteredProfiles([result]);
    }
  } catch (err) {
    setFilteredProfiles([]);
    alert("Profile not found");
  }
};


  const sortProfiles = (data) => {
    return [...data].sort((a, b) => {
      const indexA = departmentOrder.indexOf(a.department);
      const indexB = departmentOrder.indexOf(b.department);
      return indexA - indexB;
    });
  };

  const handleDepartmentFilter = (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    if (dept === "") {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(
        (profile) => profile.department === dept
      );
      setFilteredProfiles(filtered);
    }
  };
  const fetchProfiles = async () => {
    const res = await API.get("/users/profile");
    setProfiles(res.data);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (selectedProfile) {
    return (
      <ViewProfile
        initialProfile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onDeleteSuccess={fetchProfiles}
      />
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        {/* Department Filter */}
        <div className="me-2 mb-2">
          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            value={selectedDepartment}
            onChange={handleDepartmentFilter}
          >
            <option value="">All Departments</option>
            {departmentOrder.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="d-flex align-items-center mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID or Name"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ maxWidth: "300px" }}
          />
          <button className="btn btn-primary ms-2" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="card mt-4 shadow border p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Employee Profiles</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Department</th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Official Email</th>
                <th>Phone Number</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile, idx) => (
                <tr key={profile.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{profile.department}</td>
                  <td>{profile.employeeId}</td>
                  <td>{`${profile.firstName} ${profile.lastName}`}</td>
                  <td>{profile.designation}</td>
                  <td>{profile.officialEmail}</td>
                  <td>{profile.phoneNumber}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedProfile(profile)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProfileTable;
