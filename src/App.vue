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
      <div class="particles"></div>
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

:root {
  /* Default theme (blue) */
  --primary-color: #3b82f6;
  --secondary-color: #60a5fa;
  --background-color: #0f172a;
  --card-background: rgba(30, 41, 59, 0.8);
  --text-color: #e2e8f0;
  --text-secondary: #94a3b8;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --success-color: #34d399;
  --warning-color: #fbbf24;
  --error-color: #f87171;
  --glassmorphism-bg: rgba(30, 41, 59, 0.6);
  --glassmorphism-border: rgba(255, 255, 255, 0.08);
  --glassmorphism-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  --neon-glow: 0 0 15px rgba(59, 130, 246, 0.5);
}

:root[data-theme="black"] {
  --primary-color: #000000;
  --secondary-color: #333333;
  --background-color: #000000;
  --card-background: rgba(20, 20, 20, 0.8);
  --text-color: #ffffff;
  --text-secondary: #cccccc;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.5);
  --glassmorphism-bg: rgba(20, 20, 20, 0.6);
  --glassmorphism-border: rgba(255, 255, 255, 0.05);
  --glassmorphism-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --neon-glow: 0 0 15px rgba(0, 0, 0, 0.5);
}

:root[data-theme="white"] {
  --primary-color: #ffffff;
  --secondary-color: #f0f0f0;
  --background-color: #ffffff;
  --card-background: rgba(240, 240, 240, 0.8);
  --text-color: #000000;
  --text-secondary: #333333;
  --border-color: rgba(0, 0, 0, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.1);
  --glassmorphism-bg: rgba(240, 240, 240, 0.6);
  --glassmorphism-border: rgba(0, 0, 0, 0.05);
  --glassmorphism-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  --neon-glow: 0 0 15px rgba(240, 240, 240, 0.5);
}

:root[data-theme="blue"] {
  --primary-color: #3b82f6;
  --secondary-color: #60a5fa;
  --background-color: #0f172a;
  --card-background: rgba(30, 41, 59, 0.8);
  --text-color: #e2e8f0;
  --text-secondary: #94a3b8;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --glassmorphism-bg: rgba(30, 41, 59, 0.6);
  --glassmorphism-border: rgba(255, 255, 255, 0.08);
  --glassmorphism-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  --neon-glow: 0 0 15px rgba(59, 130, 246, 0.5);
}

:root[data-theme="orange"] {
  --primary-color: #f97316;
  --secondary-color: #fb923c;
  --background-color: #2c1005;
  --card-background: rgba(50, 20, 5, 0.8);
  --text-color: #ffedd5;
  --text-secondary: #fdba74;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --glassmorphism-bg: rgba(50, 20, 5, 0.6);
  --glassmorphism-border: rgba(255, 255, 255, 0.08);
  --glassmorphism-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  --neon-glow: 0 0 15px rgba(249, 115, 22, 0.5);
}

:root[data-theme="green"] {
  --primary-color: #10b981;
  --secondary-color: #34d399;
  --background-color: #052c1f;
  --card-background: rgba(5, 40, 30, 0.8);
  --text-color: #d1fae5;
  --text-secondary: #6ee7b7;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --glassmorphism-bg: rgba(5, 40, 30, 0.6);
  --glassmorphism-border: rgba(255, 255, 255, 0.08);
  --glassmorphism-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  --neon-glow: 0 0 15px rgba(16, 185, 129, 0.5);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  overflow-x: hidden;
  background-attachment: fixed;
  background-size: cover;
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
  background: radial-gradient(circle, var(--secondary-color), var(--primary-color));
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  animation: pulse 4s infinite alternate;
}

.cloud {
  position: absolute;
  background: var(--border-color);
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

/* Animated particles for modern effect */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: particle-float linear infinite;
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

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--card-background);
}

::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-color);
}

/* Glassmorphism effect for all cards */
.glass-card {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  z-index: -1;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.glass-card:hover::before {
  opacity: 0.1;
}

/* Modern button styles */
.modern-button {
  padding: 14px 28px;
  border-radius: 18px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.05rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.modern-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.modern-button:hover::before {
  opacity: 1;
}

.modern-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modern-button.secondary {
  background: var(--glassmorphism-bg);
  color: var(--text-color);
  border: 1px solid var(--glassmorphism-border);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.modern-button.secondary:hover {
  background: rgba(15, 23, 42, 0.7);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.modern-button.icon-only {
  padding: 14px;
  border-radius: 50%;
  width: 52px;
  height: 52px;
}

/* Modern input styles */
.modern-input {
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid var(--glassmorphism-border);
  background: var(--glassmorphism-bg);
  color: var(--text-color);
  font-size: 1.05rem;
  width: 100%;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.modern-input::placeholder {
  color: var(--text-secondary);
}

/* Modern select styles */
.modern-select {
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid var(--glassmorphism-border);
  background: var(--glassmorphism-bg);
  color: var(--text-color);
  font-size: 1.05rem;
  width: 100%;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 18px center;
  background-size: 22px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(59, 130, 246, 0.2);
}

/* Section titles */
.section-title {
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 25px;
  color: var(--text-color);
  position: relative;
  padding-bottom: 12px;
  letter-spacing: -0.5px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
  box-shadow: var(--neon-glow);
}

/* Responsive grid system */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

/* Modern card styles */
.modern-card {
  background: var(--glassmorphism-bg);
  border-radius: 24px;
  padding: 30px;
  box-shadow: var(--glassmorphism-shadow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glassmorphism-border);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.modern-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  z-index: -1;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.modern-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.modern-card:hover::before {
  opacity: 0.1;
}

/* Data display styles */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 25px;
}

.data-item {
  text-align: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.data-item:hover {
  background: rgba(15, 23, 42, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.data-item:hover::before {
  opacity: 1;
}

.data-label {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.data-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-color);
  letter-spacing: -0.5px;
}

/* Modern animation utilities */
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pulse {
  animation: pulseGlow 2s infinite alternate;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
  }
}
</style>