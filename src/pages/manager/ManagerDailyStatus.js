import React, { useEffect, useState } from "react";
import API from "../../axios";


const ManagerDailyStatus = () => {
  const [userSessions, setUserSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/auth/sessions");
      const filtered = res.data.filter(
        (s) => s.user.role === "ADMIN" || s.user.role === "USER"
      );
      setUserSessions(filtered);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const formatTime12Hour = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  const formatHoursToHHMM = (decimalHours) => {
    if (!decimalHours) return "—";
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      
      <div
        className="flex-grow-1 px-3 py-4">
        <div className="container-fluid">
          <div className="card p-3 shadow-sm">
            <h3 className="mb-3">User Login & Working Hours Status</h3>
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                    <th>Worked Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userSessions.map((session, i) => (
                    <tr key={`${session.user.id}-${session.firstLogin}`}>
                      <td>{i + 1}</td>
                      <td>{formatDate(session.firstLogin)}</td>
                      <td>{`${session.user.firstName} ${session.user.lastName}`}</td>
                      <td>{formatTime12Hour(session.firstLogin)}</td>
                      <td>{formatTime12Hour(session.lastLogout)}</td>
                      <td>{session.totalHours ? formatHoursToHHMM(session.totalHours) : "—"}</td>
                      <td>
                        {session.isActive ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Logged Out</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {userSessions.length === 0 && (
                    <tr>
                      <td colSpan="8">No sessions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDailyStatus;