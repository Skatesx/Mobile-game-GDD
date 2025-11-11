// Main entry point for Eco-Warriors game
import { GameState } from './game/GameState.js';
import { Config } from './game/Config.js';

console.log('Eco-Warriors - Initializing...');

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting game initialization');
  
  // Create game state manager
  const gameState = new GameState();
  
  // Show loading screen
  showScreen('loading-screen');
  
  // Simulate asset loading for now (will be replaced with actual asset loading)
  simulateLoading();
});

function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

function simulateLoading() {
  const progressBar = document.getElementById('loading-progress');
  const loadingText = document.getElementById('loading-text');
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = `${progress}%`;
    loadingText.textContent = `Loading... ${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        showScreen('menu-screen');
        setupMenuButtons();
      }, 500);
    }
  }, 200);
}

function setupMenuButtons() {
  const playButton = document.getElementById('play-button');
  const instructionsButton = document.getElementById('instructions-button');
  const settingsButton = document.getElementById('settings-button');
  
  playButton.addEventListener('click', () => {
    console.log('Play button clicked');
    showScreen('game-screen');
    // Game will start here once implemented
  });
  
  instructionsButton.addEventListener('click', () => {
    console.log('Instructions button clicked');
    alert('Instructions: Move your basket left and right to catch clean water drops. Avoid pollutants!');
  });
  
  settingsButton.addEventListener('click', () => {
    console.log('Settings button clicked');
    alert('Settings coming soon!');
  });
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
