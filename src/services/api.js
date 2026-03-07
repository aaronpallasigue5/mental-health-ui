import axios from 'axios';

export default axios.create({
  // This is your specific live backend URL from Render
  baseURL: 'https://backend-4auy.onrender.com' 
});