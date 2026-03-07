<template>
  <div class="card">
    <h2 class="title">🧠 Mood Check-in</h2>
    <p class="subtitle">How's your headspace today?</p>
    
    <div class="form-group">
      <div class="input-wrapper">
        <label for="name">Name</label>
        <input 
          id="name"
          v-model.trim="name" 
          placeholder="e.g. Aaron" 
          class="input-field"
          :disabled="loading"
        />
      </div>

      <div class="input-wrapper">
        <label for="mood">Your Thoughts</label>
        <textarea 
          id="mood"
          v-model.trim="mood" 
          placeholder="I'm feeling a bit..." 
          class="textarea-field"
          rows="4"
          :disabled="loading"
        ></textarea>
      </div>
      
      <div class="button-group">
        <button @click="submitMood" :disabled="loading || !isValid" class="submit-btn">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Consulting AI...' : 'Analyze Mood' }}
        </button>
        
        <button v-if="aiMessage" @click="resetForm" class="reset-btn" :disabled="loading">
          Reset
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="aiMessage" class="response-box" role="alert">
        <div class="response-header">
          <span class="sparkle">✨</span>
          <strong class="advisor-label">AI Advisor</strong>
        </div>
        <p class="ai-text">{{ aiMessage }}</p>
      </div>
    </transition>
    
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
  computed: {
    // FIXED: Now only requires 1 character to enable the button
    isValid() {
      return this.name.trim().length > 0 && this.mood.trim().length > 0;
    }
  },
  methods: {
    async submitMood() {
      if (!this.isValid) return;
      
      this.loading = true;
      this.errorMessage = '';
      this.aiMessage = '';

      try {
        const res = await api.post('/mood', {
          full_name: this.name,
          mood_text: this.mood
        });
        
        this.aiMessage = res.data.ai_message; 
      } catch (err) {
        // This error appears if your backend isn't reachable
        this.errorMessage = "⚠️ Connection Failed. Ensure your backend is running.";
        console.error("API Error:", err);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.name = '';
      this.mood = '';
      this.aiMessage = '';
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>
/* Container & Typography */
.card { 
  border: 1px solid #e2e8f0; 
  padding: 2.5rem; 
  border-radius: 16px; 
  max-width: 450px; 
  margin: 40px auto; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  background: #ffffff;
  font-family: 'Inter', -apple-system, sans-serif;
}

.title { color: #1e293b; text-align: center; margin-bottom: 0.5rem; font-weight: 800; }
.subtitle { text-align: center; color: #64748b; margin-bottom: 2rem; font-size: 0.95rem; }

/* Form Elements */
.input-wrapper { margin-bottom: 1.5rem; }
.input-wrapper label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; }

.input-field, .textarea-field { 
  width: 100%; 
  padding: 12px; 
  border: 2px solid #f1f5f9; 
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-field:focus, .textarea-field:focus {
  outline: none;
  border-color: #42b883;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(66, 184, 131, 0.1);
}

/* Buttons */
.button-group { display: flex; gap: 10px; }

.submit-btn { 
  flex: 2;
  background: #42b883; 
  color: white; 
  border: none; 
  padding: 14px; 
  border-radius: 8px; 
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) { background: #3aa876; transform: translateY(-1px); }
.submit-btn:disabled { background: #cbd5e1; cursor: not-allowed; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.reset-btn {
  flex: 1;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* AI Response Box */
.response-box { 
  margin-top: 25px; 
  background: #f0fdf4; 
  padding: 20px; 
  border-left: 6px solid #42b883; 
  border-radius: 12px;
}

.response-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.advisor-label { color: #166534; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }

.ai-text { 
  color: #064e3b; 
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.error-msg { color: #ef4444; font-size: 0.85rem; margin-top: 15px; text-align: center; font-weight: 500; }
</style>