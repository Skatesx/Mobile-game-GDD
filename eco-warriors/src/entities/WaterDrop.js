import * as THREE from 'three';
import { Config } from '../game/Config.js';

/**
 * WaterDrop - Collectible clean water drops (Three.js Sprite)
 */
export class WaterDrop {
  constructor(x, y, speed, textureManager) {
    this.id = `waterdrop_${Date.now()}_${Math.random()}`;
    this.type = 'waterDrop';
    this.position = { x, y };
    this.velocity = { x: 0, y: -speed }; // Negative Y = falling down
    this.size = {
      width: Config.WATER_DROP.WIDTH,
      height: Config.WATER_DROP.HEIGHT
    };
    this.speed = speed;
    this.active = true;
    this.sprite = null;
    this.pointValue = Config.WATER_DROP.POINTS;
    
    this.createSprite(textureManager);
  }
  
  /**
   * Create Three.js sprite for the water drop
   */
  createSprite(textureManager) {
    let material;
    
    if (textureManager && textureManager.getTexture('waterDrop')) {
      const texture = textureManager.getTexture('waterDrop');
      material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });
    } else {
      // Fallback: use colored sprite
      material = new THREE.SpriteMaterial({
        color: Config.COLORS.WATER,
        transparent: true,
        opacity: 0.8
      });
    }
    
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(this.size.width, this.size.height, 1);
    this.sprite.position.set(this.position.x, this.position.y, 0);
  }
  
  /**
   * Update water drop position (falling)
   */
  update(deltaTime) {
    if (!this.active) return;
    
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    
    // Update sprite position
    if (this.sprite) {
      this.sprite.position.x = this.position.x;
      this.sprite.position.y = this.position.y;
    }
    
    // Deactivate if off screen (below bottom)
    if (this.position.y < -Config.WORLD_HEIGHT / 2 - 1) {
      this.active = false;
    }
  }
  
  /**
   * Get collision bounds for AABB detection
   */
  getBounds() {
    const halfWidth = this.size.width / 2;
    const halfHeight = this.size.height / 2;
    
    return {
      left: this.position.x - halfWidth,
      right: this.position.x + halfWidth,
      top: this.position.y + halfHeight,
      bottom: this.position.y - halfHeight,
      x: this.position.x - halfWidth,
      y: this.position.y - halfHeight,
      width: this.size.width,
      height: this.size.height
    };
  }
  
  /**
   * Get point value
   */
  getPointValue() {
    return this.pointValue;
  }
  
  /**
   * Reset water drop for object pooling
   */
  reset(x, y, speed) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.y = -speed;
    this.speed = speed;
    this.active = true;
    
    if (this.sprite) {
      this.sprite.position.x = x;
      this.sprite.position.y = y;
      this.sprite.visible = true;
    }
  }
  
  /**
   * Deactivate water drop
   */
  deactivate() {
    this.active = false;
    if (this.sprite) {
      this.sprite.visible = false;
    }
  }
  
  /**
   * Check if water drop is active
   */
  isActive() {
    return this.active;
  }
  
  /**
   * Cleanup resources
   */
  dispose() {
    if (this.sprite) {
      this.sprite.material.dispose();
      if (this.sprite.material.map) {
        this.sprite.material.map.dispose();
      }
    }
    this.active = false;
  }
}
