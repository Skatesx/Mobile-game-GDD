import * as THREE from 'three';
import { Config } from '../game/Config.js';

/**
 * Basket - Player-controlled collection basket (Three.js Mesh)
 */
export class Basket {
  constructor(x, y, textureManager = null) {
    this.id = 'basket';
    this.type = 'basket';
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.size = {
      width: Config.BASKET.WIDTH,
      height: Config.BASKET.HEIGHT
    };
    this.speed = Config.BASKET.SPEED;
    this.mesh = null;
    
    this.createMesh(textureManager);
    
    console.log('Basket created at', this.position);
  }
  
  /**
   * Create Three.js mesh for the basket
   */
  createMesh(textureManager) {
    const geometry = new THREE.PlaneGeometry(this.size.width, this.size.height);
    
    // Create material (will use texture when available)
    let material;
    if (textureManager && textureManager.getTexture('basket')) {
      const texture = textureManager.getTexture('basket');
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
    } else {
      // Fallback: use colored material with African-inspired brown
      material = new THREE.MeshBasicMaterial({
        color: Config.COLORS.PRIMARY,
        side: THREE.DoubleSide
      });
    }
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, 0);
    
    console.log('Basket mesh created');
  }
  
  /**
   * Move basket left
   */
  moveLeft(deltaTime) {
    this.velocity.x = -this.speed;
    this.updatePosition(deltaTime);
  }
  
  /**
   * Move basket right
   */
  moveRight(deltaTime) {
    this.velocity.x = this.speed;
    this.updatePosition(deltaTime);
  }
  
  /**
   * Stop basket movement
   */
  stopMovement() {
    this.velocity.x = 0;
  }
  
  /**
   * Update basket position with boundary constraints
   */
  updatePosition(deltaTime) {
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    
    // Apply boundary constraints
    const worldBounds = this.getWorldBounds();
    const halfWidth = this.size.width / 2;
    
    if (this.position.x - halfWidth < worldBounds.left) {
      this.position.x = worldBounds.left + halfWidth;
      this.velocity.x = 0;
    } else if (this.position.x + halfWidth > worldBounds.right) {
      this.position.x = worldBounds.right - halfWidth;
      this.velocity.x = 0;
    }
    
    // Update mesh position
    if (this.mesh) {
      this.mesh.position.x = this.position.x;
      this.mesh.position.y = this.position.y;
    }
  }
  
  /**
   * Get world bounds (will be set by game controller)
   */
  getWorldBounds() {
    // Default bounds based on config
    const aspect = window.innerWidth / window.innerHeight;
    const worldWidth = Config.WORLD_HEIGHT * aspect;
    
    return {
      left: -worldWidth / 2,
      right: worldWidth / 2,
      top: Config.WORLD_HEIGHT / 2,
      bottom: -Config.WORLD_HEIGHT / 2
    };
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
   * Play collection animation (scale bounce)
   */
  playCollectAnimation() {
    if (!this.mesh) return;
    
    const originalScale = { x: 1, y: 1 };
    const targetScale = { x: 1.2, y: 1.2 };
    const duration = 200; // milliseconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (progress < 0.5) {
        // Scale up
        const t = progress * 2;
        this.mesh.scale.x = originalScale.x + (targetScale.x - originalScale.x) * t;
        this.mesh.scale.y = originalScale.y + (targetScale.y - originalScale.y) * t;
      } else {
        // Scale down
        const t = (progress - 0.5) * 2;
        this.mesh.scale.x = targetScale.x - (targetScale.x - originalScale.x) * t;
        this.mesh.scale.y = targetScale.y - (targetScale.y - originalScale.y) * t;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we end at original scale
        this.mesh.scale.set(1, 1, 1);
      }
    };
    
    animate();
  }
  
  /**
   * Set basket position directly (for initialization)
   */
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    
    if (this.mesh) {
      this.mesh.position.x = x;
      this.mesh.position.y = y;
    }
  }
  
  /**
   * Update method called each frame
   */
  update(deltaTime) {
    // Basket position is updated by movement controls
    // This method is here for consistency with other entities
  }
  
  /**
   * Cleanup resources
   */
  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      if (this.mesh.material.map) {
        this.mesh.material.map.dispose();
      }
    }
    
    console.log('Basket disposed');
  }
}
