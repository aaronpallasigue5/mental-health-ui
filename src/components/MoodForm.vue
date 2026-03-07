<template>
  <div class="card">
    <h2 class="title">🧠 Mood Check-in</h2>
    <div class="form-group">
      <input v-model="name" placeholder="Your name" class="input-field" />
      <textarea v-model="mood" placeholder="How are you feeling today?" class="textarea-field"></textarea>
      
      <button @click="submitMood" :disabled="loading" class="submit-btn">
        {{ loading ? 'Consulting AI...' : 'Submit' }}
      </button>
    </div>

    <div v-if="aiMessage" class="response-box">
      <strong class="advisor-label">✨ AI Advisor says:</strong>
      <p class="ai-text">{{ aiMessage }}</p>
    </div>
    
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return { 
      name: '', 
      mood: '', 
      aiMessage: '',
      loading: false,
      errorMessage: '' 
    };
  },
  methods: {
    async submitMood() {
      if (!this.name.trim() || !this.mood.trim()) return alert("Please fill both fields");
      
      this.loading = true;
      this.errorMessage = '';
      this.aiMessage = '';

      try {
        const res = await api.post('/mood', {
          full_name: this.name,
          mood_text: this.mood
        });
        
        // This connects to your Lab 4 backend
        this.aiMessage = res.data.ai_message; 
      } catch (err) {
        this.errorMessage = "⚠️ Connection Failed. Ensure your Node.js backend is running on Port 3000.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Main Card Setup */
.card { 
  border: 1px solid #ddd; 
  padding: 2rem; 
  border-radius: 12px; 
  max-width: 400px; 
  margin: 40px auto; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  background-color: #ffffff; /* Explicit white background */
}

.title { color: #2c3e50; text-align: center; }

.input-field, .textarea-field { 
  width: 100%; 
  margin-bottom: 1rem; 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 4px;
  color: #333; /* Dark text for inputs */
}

.submit-btn { 
  width: 100%; 
  background: #42b883; 
  color: white; 
  border: none; 
  padding: 12px; 
  border-radius: 6px; 
  font-weight: bold;
  cursor: pointer;
}

.submit-btn:disabled { background: #94d7b9; cursor: not-allowed; }

/* FIX: High Contrast Response Box */
.response-box { 
  margin-top: 20px; 
  background: #f0fdf4; /* Light green bg */
  padding: 15px; 
  border-left: 5px solid #42b883; 
  border-radius: 4px;
}

.advisor-label { color: #166534; display: block; margin-bottom: 5px; }

/* FIX: Dark text color for visibility */
.ai-text { 
  color: #1f2937 !important; /* Force dark gray/black text */
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}

.error-msg { color: #dc2626; font-size: 0.9rem; margin-top: 10px; text-align: center; }
</style>