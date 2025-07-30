import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/commonpages/Login';
import Register from './pages/commonpages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import UserDashboard from './pages/user/UserDashboard';
import ManagerStatus from './pages/manager/ManagerStatus';
import ManagerDailyStatus from './pages/manager/ManagerDailyStatus';
import ManagerMonthlyStatus from './pages/manager/ManagerMonthlyStatus';
import Logout from './pages/commonpages/Logout';
import InvoiceGenerator from './pages/admin/InvoiceGenerator';
import MessagePage from './pages/commonpages/message/MessagePage';
import Snackbar from "./components/Snackbar";
import { MessageStatusContext } from "./contexts/MessageStatusContext"; // ✅ Make sure this is imported
import React, { useContext } from "react";
import Profilepage from './pages/admin/profile/Profilepage'; // ✅ Import the Profilepage component


function App() {
  const { snackbarData } = useContext(MessageStatusContext); // ✅ now it works

  return (
    <BrowserRouter>
      
        {/* Snackbar shows on top for all routes */}
        <Snackbar
          message={snackbarData.message}
          show={snackbarData.show}
          type={snackbarData.type}
          onClose={() => {}}
        />
        <Routes>
          {/* All routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerdashboard"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerstatus"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerdailystatus"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDailyStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managermonthlystatus"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerMonthlyStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                <InvoiceGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER']}>
                <Profilepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/message"
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'MANAGER']}>
                <MessagePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      
    </BrowserRouter>
  );
}

export default App;
