import * as THREE from 'three';
import { Config } from '../game/Config.js';

/**
 * ThreeRenderer - Manages Three.js WebGL rendering with mobile optimizations
 */
export class ThreeRenderer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    
    this.initialized = false;
  }
  
  /**
   * Initialize Three.js renderer with mobile-optimized settings
   */
  init() {
    if (this.initialized) {
      console.warn('ThreeRenderer already initialized');
      return;
    }
    
    // Get canvas element
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) {
      throw new Error('Canvas element not found');
    }
    
    // Create WebGL renderer with mobile optimizations
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,              // Disabled for mobile performance
      powerPreference: 'low-power',  // Battery optimization
      alpha: false,                  // Opaque background
      stencil: false,                // Not needed
      depth: true                    // Enable depth testing
    });
    
    // Set pixel ratio (capped at 2x for performance)
    const pixelRatio = Math.min(window.devicePixelRatio || 1, Config.PERFORMANCE.MAX_PIXEL_RATIO);
    this.renderer.setPixelRatio(pixelRatio);
    
    // Set initial size
    this.resize();
    
    // Set clear color (earth tone background)
    this.renderer.setClearColor(Config.COLORS.EARTH);
    
    this.initialized = true;
    console.log('ThreeRenderer initialized', {
      pixelRatio,
      size: { width: this.canvas.width, height: this.canvas.height }
    });
  }
  
  /**
   * Handle window resize
   */
  resize() {
    if (!this.renderer) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.renderer.setSize(width, height);
    
    // Update camera if it exists
    if (this.camera) {
      const aspect = width / height;
      const frustumSize = Config.WORLD_HEIGHT;
      
      this.camera.left = frustumSize * aspect / -2;
      this.camera.right = frustumSize * aspect / 2;
      this.camera.top = frustumSize / 2;
      this.camera.bottom = frustumSize / -2;
      
      this.camera.updateProjectionMatrix();
    }
    
    console.log('Renderer resized:', { width, height });
  }
  
  /**
   * Set the scene to render
   */
  setScene(scene) {
    this.scene = scene;
  }
  
  /**
   * Set the camera to use
   */
  setCamera(camera) {
    this.camera = camera;
  }
  
  /**
   * Render a frame
   */
  render() {
    if (!this.renderer || !this.scene || !this.camera) {
      console.warn('Cannot render: missing renderer, scene, or camera');
      return;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * Get renderer info for debugging
   */
  getInfo() {
    if (!this.renderer) return null;
    
    return {
      memory: this.renderer.info.memory,
      render: this.renderer.info.render,
      programs: this.renderer.info.programs
    };
  }
  
  /**
   * Cleanup resources
   */
  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    this.scene = null;
    this.camera = null;
    this.initialized = false;
    
    console.log('ThreeRenderer disposed');
  }
}
