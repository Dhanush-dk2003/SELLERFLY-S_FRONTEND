import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL: ' https://sellerfly-s-backend.onrender.com/api',
  withCredentials: true 
});

export default API;
