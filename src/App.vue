<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <div class="background-elements">
      <div class="sun"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.app-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Background elements for modern look */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  animation: pulse 4s infinite alternate;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(10px);
}

.cloud-1 {
  top: 20%;
  left: 10%;
  width: 100px;
  height: 40px;
  animation: float 15s infinite linear;
}

.cloud-2 {
  top: 40%;
  right: 15%;
  width: 150px;
  height: 50px;
  animation: float 20s infinite linear reverse;
}

.cloud-3 {
  bottom: 30%;
  left: 20%;
  width: 80px;
  height: 30px;
  animation: float 12s infinite linear;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

@keyframes float {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>