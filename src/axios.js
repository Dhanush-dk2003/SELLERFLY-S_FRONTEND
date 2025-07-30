import axios from 'axios';

const API = axios.create({
  baseURL: ' https://sellerfly-s-backend.onrender.com/api',
  withCredentials: true // Important for cookies
});

export default API;
