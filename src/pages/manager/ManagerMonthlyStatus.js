import React, { useState, useEffect } from "react";
import API from "../../axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ManagerMonthlyStatus = () => {
  const [userSessions, setUserSessions] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salaryResults, setSalaryResults] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!startDate || !endDate) {
          setUserSessions([]);
          return;
        }
        const res = await API.get(
          `/auth/sessions/range?start=${startDate}&end=${endDate}`
        );
        setUserSessions(res.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setUserSessions([]);
      }
    };

    fetchSessions();
  }, [startDate, endDate]);
  const filteredSessions = userSessions.filter((s) => {
    const fullName = `${s.user.firstName} ${s.user.lastName}`.toLowerCase();
    const empId = s.user.employeeId?.toLowerCase() || "";
    const search = searchName.toLowerCase();

    return (
      s.user.firstName.toLowerCase().includes(search) ||
      s.user.lastName.toLowerCase().includes(search) ||
      fullName.includes(search) ||
      empId.includes(search)
    );
  });

  const handleCalculateSalary = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Create a map: userId => sessionList[]
    const sessionMap = {};
    filteredSessions.forEach((session) => {
      const uid = session.user.id;
      if (!sessionMap[uid]) sessionMap[uid] = [];
      sessionMap[uid].push(session);
    });

    const results = [];

    Object.entries(sessionMap).forEach(([userId, sessions]) => {
      const user = sessions[0].user;
      const salary = parseFloat(user.salary || "0");
      if (!salary || isNaN(salary)) return;

      // Map date => hours
      const dateHours = {};
      sessions.forEach((s) => {
        const date = new Date(s.firstLogin).toISOString().slice(0, 10);
        dateHours[date] = (dateHours[date] || 0) + s.totalHours;
      });

      // Count working days excluding Sundays
      let current = new Date(start);
      const allDates = [];
      let sundays = 0;

      while (current <= end) {
        const day = current.getDay(); // 0 = Sunday
        const dateStr = current.toISOString().slice(0, 10);
        allDates.push(dateStr);
        if (day === 0) sundays++;
        current.setDate(current.getDate() + 1);
      }

      const workingDates = allDates.filter(
        (dateStr) => new Date(dateStr).getDay() !== 0
      );

      let totalWorkPortion = 0;
      let absentDays = 0;

      workingDates.forEach((date) => {
        const hours = dateHours[date] || 0;
        if (hours >= 8) {
          totalWorkPortion += 1;
        } else if (hours > 0 && hours < 8) {
          totalWorkPortion += hours / 8;
        } else {
          absentDays++;
        }
      });

      // Apply 1 paid leave
      let paidLeaveUsed = 0;
      if (absentDays > 0) {
        absentDays -= 1;
        paidLeaveUsed = 1;
        totalWorkPortion += 1;
      }

      const totalWorkingDays = workingDates.length;
      const salaryEarned = (
        (totalWorkPortion / totalWorkingDays) *
        salary
      ).toFixed(2);

      results.push({
        name: `${user.firstName} ${user.lastName}`,
        employeeId: user.employeeId,
        totalWorkingDays,
        presentUnits: totalWorkPortion.toFixed(2),
        salary: salary.toFixed(2),
        salaryEarned,
        sundays,
        paidLeaveUsed,
      });
    });

    setSalaryResults(results);
    console.log("Salary Results:", results);
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
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // ✅ Export to Excel Function
  const exportToExcel = () => {
    const attendanceData = filteredSessions.map((session, i) => ({
      "S.No": i + 1,
      Date: formatDate(session.firstLogin),
      Name: `${session.user.firstName} ${session.user.lastName}`,
      "First Login": formatTime12Hour(session.firstLogin),
      "Last Logout": formatTime12Hour(session.lastLogout),
      "Worked Hours": session.totalHours
        ? formatHoursToHHMM(session.totalHours)
        : "—",
    }));

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Attendance
    const attendanceSheet = XLSX.utils.json_to_sheet(attendanceData);
    XLSX.utils.book_append_sheet(workbook, attendanceSheet, "Attendance");

    // Conditionally add salary sheet if available
    if (salaryResults.length > 0) {
  const salaryData = salaryResults.map((r, i) => ({
    "S.No": i + 1,
    "Employee ID": r.employeeId,
    Name: r.name,
    "Working Days": r.totalWorkingDays,
    "Sundays": r.sundays,
    "Paid Leave Used": r.paidLeaveUsed,
    "Effective Days Worked": r.presentUnits,
    "Monthly Salary": `₹${r.salary}`,
    "Salary Earned": `₹${r.salaryEarned}`,
  }));

  const salarySheet = XLSX.utils.json_to_sheet(salaryData);
  XLSX.utils.book_append_sheet(workbook, salarySheet, "Salary Summary");
}


    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, `Attendance_${startDate}_to_${endDate}.xlsx`);
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <div className="flex-grow-1 px-3 py-4">
        <div className="container-fluid">
          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name or ID"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ maxWidth: "250px" }}
            />
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ maxWidth: "200px" }}
            />
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ maxWidth: "200px" }}
            />

            {/* 👇 New Button */}
            <button
              className="btn btn-primary"
              onClick={handleCalculateSalary}
              disabled={!startDate || !endDate || filteredSessions.length === 0}
            >
              Calculate Salary
            </button>
            <button
              className="btn btn-success"
              onClick={exportToExcel}
              disabled={filteredSessions.length === 0}
            >
              Export to Excel
            </button>
          </div>

          <div className="card p-3 shadow-sm">
            <h3 className="mb-3">Attendance of the Employees</h3>
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>First Login</th>
                    <th>Last Logout</th>
                    <th>Worked Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, i) => (
                    <tr key={`${session.user.id}-${session.firstLogin}`}>
                      <td>{i + 1}</td>
                      <td>{formatDate(session.firstLogin)}</td>
                      <td>{`${session.user.firstName} ${session.user.lastName}`}</td>
                      <td>{formatTime12Hour(session.firstLogin)}</td>
                      <td>{formatTime12Hour(session.lastLogout)}</td>
                      <td>
                        {session.totalHours
                          ? formatHoursToHHMM(session.totalHours)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {filteredSessions.length === 0 && (
                    <tr>
                      <td colSpan="6">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {salaryResults.length > 0 && (
              <div className="card p-3 shadow-sm mt-4">
                {/* <h3 className="mb-3">Calculated Salary Summary</h3> */}
                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead className="table-dark">
                      <tr>
                        {/* <th>S.No</th>
                      <th>Employee ID</th>
                      <th>Name</th> */}
                        <th>Working Days</th>
                        <th>Sundays</th>
                        <th>Paid Leave Used</th>
                        <th>Effective Days Worked</th>
                        <th>Monthly Salary</th>
                        <th>Salary Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryResults.map((r, i) => (
                        <tr key={`${r.employeeId}-${i}`}>
                          {/* <td>{i + 1}</td>
                        <td>{r.employeeId}</td>
                        <td>{r.name}</td> */}
                          <td>{r.totalWorkingDays}</td>
                          <td>{r.sundays}</td>
                          <td>{r.paidLeaveUsed}</td>
                          <td>{r.presentUnits}</td>
                          <td>₹{r.salary}</td>
                          <td>₹{r.salaryEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerMonthlyStatus;
