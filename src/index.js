import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './contexts/AuthContext';
import { MessageStatusProvider } from './contexts/MessageStatusContext'; // ✅

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
  <MessageStatusProvider>
    <App />
  </MessageStatusProvider>
</AuthProvider>

);

reportWebVitals();
