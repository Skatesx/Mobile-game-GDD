import * as THREE from 'three';
import { Config } from '../game/Config.js';

/**
 * Pollutant - Hazardous items to avoid (Three.js Sprite)
 */
export class Pollutant {
  constructor(x, y, speed, subtype, textureManager) {
    this.id = `pollutant_${Date.now()}_${Math.random()}`;
    this.type = 'pollutant';
    this.subtype = subtype; // 'trash' | 'oil' | 'plastic'
    this.position = { x, y };
    this.velocity = { x: 0, y: -speed }; // Negative Y = falling down
    this.size = {
      width: Config.POLLUTANT.WIDTH,
      height: Config.POLLUTANT.HEIGHT
    };
    this.speed = speed;
    this.active = true;
    this.sprite = null;
    this.pointPenalty = Config.POLLUTANT.POINTS;
    
    this.createSprite(textureManager);
  }
  
  /**
   * Create Three.js sprite for the pollutant
   */
  createSprite(textureManager) {
    let material;
    const textureName = `pollutant_${this.subtype}`;
    
    if (textureManager && textureManager.getTexture(textureName)) {
      const texture = textureManager.getTexture(textureName);
      material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });
    } else {
      // Fallback: use colored sprite based on subtype
      const colors = {
        trash: 0x2F4F4F,  // Dark slate gray
        oil: 0x000000,    // Black
        plastic: 0x87CEEB // Light blue
      };
      
      material = new THREE.SpriteMaterial({
        color: colors[this.subtype] || Config.COLORS.WARNING,
        transparent: true,
        opacity: 0.9
      });
    }
    
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(this.size.width, this.size.height, 1);
    this.sprite.position.set(this.position.x, this.position.y, 0);
  }
  
  /**
   * Update pollutant position (falling)
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
   * Get point penalty
   */
  getPointPenalty() {
    return this.pointPenalty;
  }
  
  /**
   * Get pollutant subtype
   */
  getSubtype() {
    return this.subtype;
  }
  
  /**
   * Reset pollutant for object pooling
   */
  reset(x, y, speed, subtype) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.y = -speed;
    this.speed = speed;
    this.subtype = subtype;
    this.active = true;
    
    if (this.sprite) {
      this.sprite.position.x = x;
      this.sprite.position.y = y;
      this.sprite.visible = true;
    }
  }
  
  /**
   * Deactivate pollutant
   */
  deactivate() {
    this.active = false;
    if (this.sprite) {
      this.sprite.visible = false;
    }
  }
  
  /**
   * Check if pollutant is active
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
