import * as THREE from 'three';
import { Config } from '../game/Config.js';

/**
 * CameraController - Manages orthographic camera for 2D perspective in 3D space
 */
export class CameraController {
  constructor() {
    this.camera = null;
    this.aspect = 1;
    this.frustumSize = Config.WORLD_HEIGHT;
    
    this.setupCamera();
    
    console.log('CameraController initialized');
  }
  
  /**
   * Set up orthographic camera
   */
  setupCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.aspect = width / height;
    
    // Create orthographic camera for 2D-style gameplay
    // This creates a view that shows the game world without perspective distortion
    this.camera = new THREE.OrthographicCamera(
      this.frustumSize * this.aspect / -2,  // left
      this.frustumSize * this.aspect / 2,   // right
      this.frustumSize / 2,                 // top
      this.frustumSize / -2,                // bottom
      0.1,                                  // near
      1000                                  // far
    );
    
    // Position camera to look at the scene
    this.camera.position.z = 10;
    this.camera.lookAt(0, 0, 0);
    
    console.log('Orthographic camera configured', {
      aspect: this.aspect,
      frustumSize: this.frustumSize,
      position: this.camera.position
    });
  }
  
  /**
   * Update camera aspect ratio on window resize
   */
  updateAspect(width, height) {
    this.aspect = width / height;
    
    this.camera.left = this.frustumSize * this.aspect / -2;
    this.camera.right = this.frustumSize * this.aspect / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = this.frustumSize / -2;
    
    this.camera.updateProjectionMatrix();
    
    console.log('Camera aspect updated', { width, height, aspect: this.aspect });
  }
  
  /**
   * Convert screen coordinates to world coordinates
   * Useful for touch input mapping
   */
  screenToWorld(screenX, screenY) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalize screen coordinates to -1 to 1
    const ndcX = (screenX / width) * 2 - 1;
    const ndcY = -(screenY / height) * 2 + 1;
    
    // Convert to world coordinates using camera frustum
    const worldX = ndcX * (this.frustumSize * this.aspect / 2);
    const worldY = ndcY * (this.frustumSize / 2);
    
    return { x: worldX, y: worldY };
  }
  
  /**
   * Convert world coordinates to screen coordinates
   * Useful for UI positioning
   */
  worldToScreen(worldX, worldY) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Convert world to normalized device coordinates
    const ndcX = worldX / (this.frustumSize * this.aspect / 2);
    const ndcY = worldY / (this.frustumSize / 2);
    
    // Convert to screen coordinates
    const screenX = (ndcX + 1) / 2 * width;
    const screenY = (1 - ndcY) / 2 * height;
    
    return { x: screenX, y: screenY };
  }
  
  /**
   * Get the camera instance
   */
  getCamera() {
    return this.camera;
  }
  
  /**
   * Get world bounds visible by camera
   */
  getWorldBounds() {
    return {
      left: this.camera.left,
      right: this.camera.right,
      top: this.camera.top,
      bottom: this.camera.bottom,
      width: this.camera.right - this.camera.left,
      height: this.camera.top - this.camera.bottom
    };
  }
  
  /**
   * Shake camera for impact effect (optional feature)
   */
  shake(intensity = 0.1, duration = 200) {
    const originalX = this.camera.position.x;
    const originalY = this.camera.position.y;
    const startTime = Date.now();
    
    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        // Reset to original position
        this.camera.position.x = originalX;
        this.camera.position.y = originalY;
        clearInterval(shakeInterval);
        return;
      }
      
      // Random shake within intensity range
      const progress = 1 - (elapsed / duration);
      const currentIntensity = intensity * progress;
      
      this.camera.position.x = originalX + (Math.random() - 0.5) * currentIntensity;
      this.camera.position.y = originalY + (Math.random() - 0.5) * currentIntensity;
    }, 16); // ~60fps
  }
}
