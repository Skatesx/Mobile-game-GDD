// Game state management
export class GameState {
  constructor() {
    this.status = 'menu'; // 'menu' | 'playing' | 'paused' | 'gameOver'
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.level = 1;
    this.timeElapsed = 0;
    
    this.settings = {
      musicVolume: 0.5,
      sfxVolume: 0.7,
      showTutorial: true,
      quality: 'auto' // 'low' | 'medium' | 'high' | 'auto'
    };
    
    this.loadSettings();
    
    console.log('GameState initialized:', this);
  }
  
  // State transitions
  setState(newStatus) {
    console.log(`State transition: ${this.status} -> ${newStatus}`);
    this.status = newStatus;
  }
  
  // Score management
  addScore(points) {
    this.score = Math.max(0, this.score + points);
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
    
    return this.score;
  }
  
  resetScore() {
    this.score = 0;
    this.level = 1;
    this.timeElapsed = 0;
  }
  
  // Level management
  updateLevel() {
    const newLevel = Math.floor(this.score / 100) + 1;
    if (newLevel !== this.level && newLevel <= 10) {
      this.level = newLevel;
      return true; // Level up occurred
    }
    return false;
  }
  
  // Persistence
  loadHighScore() {
    try {
      const saved = localStorage.getItem('eco-warriors-highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      console.error('Failed to load high score:', error);
      return 0;
    }
  }
  
  saveHighScore() {
    try {
      localStorage.setItem('eco-warriors-highscore', this.highScore.toString());
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  }
  
  loadSettings() {
    try {
      const saved = localStorage.getItem('eco-warriors-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }
  
  saveSettings() {
    try {
      localStorage.setItem('eco-warriors-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
  
  // Settings management
  setMusicVolume(volume) {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  setSFXVolume(volume) {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  setQuality(quality) {
    this.settings.quality = quality;
    this.saveSettings();
  }
}
