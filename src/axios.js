import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL:'https://sellerfly-backend-production.up.railway.app/api',
  withCredentials: true 
});

export default API;
