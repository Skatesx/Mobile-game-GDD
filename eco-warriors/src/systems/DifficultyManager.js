import { Config } from '../game/Config.js';

/**
 * DifficultyManager - Scale game difficulty over time
 */
export class DifficultyManager {
  constructor(initialLevel = 1) {
    this.currentLevel = initialLevel;
    this.maxLevel = Config.DIFFICULTY.MAX_LEVEL;
    this.pointsPerLevel = Config.DIFFICULTY.POINTS_PER_LEVEL;
    this.lastLevelUpScore = 0;
    
    console.log('DifficultyManager initialized at level', this.currentLevel);
  }
  
  /**
   * Update difficulty based on current score
   * Returns true if level increased
   */
  update(currentScore) {
    const newLevel = this.calculateLevel(currentScore);
    
    if (newLevel !== this.currentLevel && newLevel <= this.maxLevel) {
      const oldLevel = this.currentLevel;
      this.currentLevel = newLevel;
      this.lastLevelUpScore = currentScore;
      
      console.log(`Level up! ${oldLevel} -> ${newLevel}`);
      return true; // Level up occurred
    }
    
    return false; // No level change
  }
  
  /**
   * Calculate level based on score
   */
  calculateLevel(score) {
    const level = Math.floor(score / this.pointsPerLevel) + 1;
    return Math.min(level, this.maxLevel);
  }
  
  /**
   * Get current difficulty level
   */
  getCurrentLevel() {
    return this.currentLevel;
  }
  
  /**
   * Get maximum level
   */
  getMaxLevel() {
    return this.maxLevel;
  }
  
  /**
   * Get spawn rate (seconds between spawns)
   */
  getSpawnRate() {
    const baseRate = Config.SPAWNER.MAX_INTERVAL;
    const decreasePerLevel = Config.DIFFICULTY.SPAWN_RATE_DECREASE_PER_LEVEL;
    
    // Decrease spawn interval by 10% per level
    const rate = baseRate * Math.pow(1 - decreasePerLevel, this.currentLevel - 1);
    
    // Clamp to minimum
    return Math.max(rate, Config.SPAWNER.MIN_INTERVAL);
  }
  
  /**
   * Get fall speed for items
   */
  getFallSpeed() {
    const baseSpeed = Config.WATER_DROP.MIN_SPEED;
    const increasePerLevel = Config.DIFFICULTY.SPEED_INCREASE_PER_LEVEL;
    
    // Increase speed by 15% per level
    const speed = baseSpeed * Math.pow(1 + increasePerLevel, this.currentLevel - 1);
    
    // Clamp to maximum
    return Math.min(speed, Config.WATER_DROP.MAX_SPEED);
  }
  
  /**
   * Get progress to next level (0-1)
   */
  getProgressToNextLevel(currentScore) {
    if (this.currentLevel >= this.maxLevel) {
      return 1; // Max level reached
    }
    
    const scoreInCurrentLevel = currentScore - this.lastLevelUpScore;
    const progress = scoreInCurrentLevel / this.pointsPerLevel;
    
    return Math.min(progress, 1);
  }
  
  /**
   * Get points needed for next level
   */
  getPointsToNextLevel(currentScore) {
    if (this.currentLevel >= this.maxLevel) {
      return 0; // Max level reached
    }
    
    const nextLevelScore = this.currentLevel * this.pointsPerLevel;
    return Math.max(0, nextLevelScore - currentScore);
  }
  
  /**
   * Reset difficulty to initial level
   */
  reset() {
    this.currentLevel = 1;
    this.lastLevelUpScore = 0;
    console.log('DifficultyManager reset to level 1');
  }
  
  /**
   * Set difficulty level manually (for testing)
   */
  setLevel(level) {
    this.currentLevel = Math.max(1, Math.min(level, this.maxLevel));
    console.log(`Difficulty level set to ${this.currentLevel}`);
  }
  
  /**
   * Get difficulty statistics
   */
  getStats() {
    return {
      level: this.currentLevel,
      maxLevel: this.maxLevel,
      spawnRate: this.getSpawnRate().toFixed(2),
      fallSpeed: this.getFallSpeed().toFixed(2),
      pointsPerLevel: this.pointsPerLevel
    };
  }
  
  /**
   * Get difficulty multiplier (for scoring, etc.)
   */
  getDifficultyMultiplier() {
    return 1 + (this.currentLevel - 1) * 0.1; // 10% increase per level
  }
  
  /**
   * Check if at maximum difficulty
   */
  isMaxDifficulty() {
    return this.currentLevel >= this.maxLevel;
  }
}
