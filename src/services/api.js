
import axios from 'axios';

// PALITAN ITO: Ilagay ang Live URL mo mula sa Render
const API_BASE_URL = "https://iyong-4auy-pangalan.onrender.com"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const moodService = {
  async submitMood(fullName, moodText) {
    // Nag-sesend ng data sa Render
    const response = await api.post('/mood', {
      full_name: fullName,
      mood_text: moodText
    });
    return response.data;
  }
};

export default moodService;