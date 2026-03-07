<template>
  <div id="app">
    <MoodForm />
  </div>
</template>

<script>
import MoodForm from './components/MoodForm.vue';

export default {
  components: {
    MoodForm
  }
}
</script>

<style>
/* This ensures the content isn't hidden or tiny */
#app {
  padding: 20px;
  min-height: 100vh;
  background-color: #ffffff;
}
</style>