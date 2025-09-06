<template>
  <div class="test-component">
    <h2>Weather Dashboard Test</h2>
    <p>If you can see this component, the Vue application is working correctly!</p>
  </div>
</template>

<script setup>
// This is a simple test component to verify the application is working
</script>

<style scoped>
.test-component {
  padding: 20px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 8px;
  text-align: center;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.test-component h2 {
  color: #e2e8f0;
}

.test-component p {
  color: #94a3b8;
}