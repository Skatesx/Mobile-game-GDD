import * as THREE from 'three';
import { Config } from '../game/Config.js';

/**
 * SceneManager - Manages Three.js scene setup and background elements
 */
export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.backgroundPlane = null;
    this.ambientLight = null;
    this.directionalLight = null;
    this.entities = new Map(); // Track entities in scene
    
    this.setupLighting();
    this.setupBackground();
    
    console.log('SceneManager initialized');
  }
  
  /**
   * Set up lighting for the scene
   */
  setupLighting() {
    // Ambient light for overall illumination
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);
    
    // Directional light for subtle depth
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    this.directionalLight.position.set(5, 10, 7.5);
    this.scene.add(this.directionalLight);
    
    console.log('Scene lighting configured');
  }
  
  /**
   * Set up background plane with gradient
   */
  setupBackground() {
    // Create a large plane for the background
    const geometry = new THREE.PlaneGeometry(
      Config.WORLD_WIDTH * 2,
      Config.WORLD_HEIGHT * 2
    );
    
    // Create gradient texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create gradient (earth tones)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#8B4513');    // Saddle brown (top)
    gradient.addColorStop(0.5, '#CD853F');  // Peru (middle)
    gradient.addColorStop(1, '#D2691E');    // Chocolate (bottom)
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create material with texture
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide
    });
    
    this.backgroundPlane = new THREE.Mesh(geometry, material);
    this.backgroundPlane.position.z = -5; // Behind everything
    this.scene.add(this.backgroundPlane);
    
    console.log('Background plane created');
  }
  
  /**
   * Update background based on difficulty level
   */
  updateBackground(level) {
    if (!this.backgroundPlane) return;
    
    // Adjust lighting intensity based on level
    const intensity = 0.8 + (level * 0.02); // Slightly brighter at higher levels
    this.ambientLight.intensity = Math.min(intensity, 1.0);
    
    console.log(`Background updated for level ${level}`);
  }
  
  /**
   * Add an entity to the scene
   */
  addEntity(entity) {
    if (!entity || !entity.mesh && !entity.sprite) {
      console.warn('Cannot add entity: missing mesh or sprite');
      return;
    }
    
    const object = entity.mesh || entity.sprite;
    this.scene.add(object);
    this.entities.set(entity.id, entity);
    
    return entity;
  }
  
  /**
   * Remove an entity from the scene
   */
  removeEntity(entity) {
    if (!entity) return;
    
    const object = entity.mesh || entity.sprite;
    if (object) {
      this.scene.remove(object);
    }
    
    this.entities.delete(entity.id);
  }
  
  /**
   * Get all entities in the scene
   */
  getEntities() {
    return Array.from(this.entities.values());
  }
  
  /**
   * Clear all entities from the scene
   */
  clearEntities() {
    this.entities.forEach(entity => {
      this.removeEntity(entity);
    });
    this.entities.clear();
    
    console.log('All entities cleared from scene');
  }
  
  /**
   * Get the Three.js scene
   */
  getScene() {
    return this.scene;
  }
  
  /**
   * Cleanup resources
   */
  dispose() {
    this.clearEntities();
    
    if (this.backgroundPlane) {
      this.backgroundPlane.geometry.dispose();
      this.backgroundPlane.material.dispose();
      if (this.backgroundPlane.material.map) {
        this.backgroundPlane.material.map.dispose();
      }
    }
    
    this.scene.clear();
    console.log('SceneManager disposed');
  }
}
