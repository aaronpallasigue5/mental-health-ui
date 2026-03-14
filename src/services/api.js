import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-4auy.onrender.com", 
  headers: { 'Content-Type': 'application/json' }
});

export default api;