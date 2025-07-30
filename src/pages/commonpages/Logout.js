import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
  const logoutSequence = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Backend logout done');

      // ❌ REMOVE logout() here
      // logout(); <-- don't call this yet

      // Wait 5 seconds, then clear context and navigate
      setTimeout(() => {
        logout(); // ✅ call here after 10s
        navigate('/login', { replace: true });
      }, 5000);
    } catch (err) {
      console.error('Logout API error:', err);
    }
  };

  logoutSequence();
}, [logout, navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>You have been successfully logged out 👋</h2>
      <p>Redirecting to login page in few seconds...</p>
    </div>
  );
};

export default Logout;
