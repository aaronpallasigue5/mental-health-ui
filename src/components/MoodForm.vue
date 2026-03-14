<template>
  <div class="fb-body">
    <div class="fb-container">
      <div class="fb-card post-box">
        <div class="post-header">
          <div class="avatar">JM</div>
          <span class="placeholder-text">What's your mood, {{ name || 'Aaron' }}?</span>
        </div>
        <div class="post-inputs">
          <input v-model="name" class="fb-input-name" placeholder="Full Name" />
          <textarea v-model="mood" class="fb-textarea" placeholder="Describe how you feel..."></textarea>
        </div>
        <div class="post-actions">
          <button @click="submitMood" class="fb-post-btn">Post Mood</button>
        </div>
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
      </div>

      <div class="fb-feed">
        <h3 class="feed-title">Recent Updates</h3>
        <div v-if="moods.length === 0" class="fb-card empty-state">No posts yet. Share your mood!</div>
        <div v-for="m in moods" :key="m.id" class="fb-card feed-item">
          <div class="feed-header">
            <div class="avatar small">{{ m.user_name ? m.user_name.charAt(0).toUpperCase() : 'A' }}</div>
            <div class="user-info">
              <span class="user-name">{{ m.user_name }}</span>
              <span class="post-date">{{ m.created_at || 'Just now' }} · 🌎</span>
            </div>
          </div>
          <div class="feed-content">
            <p>Feeling <span class="mood-highlight">{{ m.message }}</span></p>
            <div v-if="m.ai_response" class="ai-reply">🤖 <b>AI:</b> {{ m.ai_response }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return { name: "", mood: "", moods: [], errorMessage: "" };
  },
  methods: {
    async submitMood() {
      if (!this.name || !this.mood) { this.errorMessage = "Fill both fields"; return; }
      try {
        await api.post("/mood", { full_name: this.name, mood_text: this.mood });
        this.name = ""; this.mood = ""; this.errorMessage = "";
        this.loadMoods();
      } catch (err) {
        this.errorMessage = "Error submitting mood.";
      }
    },
    async loadMoods() {
      try {
        const res = await api.get("/mood");
        this.moods = res.data;
      } catch (err) { console.error(err); }
    }
  },
  mounted() { this.loadMoods(); }
};
</script>

<style scoped>
.fb-body { background: #f0f2f5; min-height: 100vh; padding: 20px; font-family: sans-serif; }
.fb-container { max-width: 500px; margin: 0 auto; }
.fb-card { background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.avatar { width: 40px; height: 40px; background: #1877f2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.avatar.small { width: 30px; height: 30px; font-size: 12px; }
.fb-input-name, .fb-textarea { width: 100%; border: 1px solid #dddfe2; border-radius: 6px; padding: 10px; margin-bottom: 8px; box-sizing: border-box; }
.fb-post-btn { width: 100%; background: #1877f2; color: white; border: none; border-radius: 6px; padding: 10px; font-weight: bold; cursor: pointer; }
.ai-reply { background: #f0f2f5; padding: 10px; border-radius: 8px; margin-top: 10px; font-size: 14px; border-left: 4px solid #1877f2; }
.error-msg { color: red; text-align: center; font-size: 13px; }
.mood-highlight { font-weight: bold; color: #1877f2; }
</style>