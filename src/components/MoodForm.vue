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
    isValid() {
      return this.name.trim().length > 0 && this.mood.trim().length > 0;
    }
  },
  methods: {
    async submitMood() {
      if (!this.isValid) return;
      
      this.loading = true;
      this.errorMessage = '';
      this.aiMessage = ''; // Clear previous message

      try {
        const res = await api.post('/mood', {
          full_name: this.name,
          mood_text: this.mood
        });
        
        // FIXED: Using res.data.ai_message to match your server.js response
        if (res.data && res.data.ai_message) {
          this.aiMessage = res.data.ai_message; 
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        this.errorMessage = "⚠️ Connection Failed. Check your Render logs and OpenAI key.";
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
/* (Keep your existing styles here - they are already excellent) */
</style>