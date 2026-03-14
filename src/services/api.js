import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-4auy.onrender.com", // Eto dapat ang nakalagay
  headers: { 'Content-Type': 'application/json' }
});

export default api;