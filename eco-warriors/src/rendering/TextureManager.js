import * as THREE from 'three';

/**
 * TextureManager - Load, cache, and manage textures for mobile optimization
 */
export class TextureManager {
  constructor() {
    this.textures = new Map();
    this.loader = new THREE.TextureLoader();
    this.loadingPromises = new Map();
    
    console.log('TextureManager initialized');
  }
  
  /**
   * Load a single texture
   */
  async loadTexture(name, path) {
    // Return cached texture if already loaded
    if (this.textures.has(name)) {
      console.log(`Texture '${name}' already loaded (cached)`);
      return this.textures.get(name);
    }
    
    // Return existing loading promise if in progress
    if (this.loadingPromises.has(name)) {
      console.log(`Texture '${name}' already loading (waiting)`);
      return this.loadingPromises.get(name);
    }
    
    // Create new loading promise
    const loadPromise = new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (texture) => {
          // Configure texture for mobile optimization
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.anisotropy = 1; // Low anisotropy for mobile
          
          // Cache the texture
          this.textures.set(name, texture);
          this.loadingPromises.delete(name);
          
          console.log(`Texture '${name}' loaded successfully`);
          resolve(texture);
        },
        undefined,
        (error) => {
          this.loadingPromises.delete(name);
          console.error(`Failed to load texture '${name}':`, error);
          reject(error);
        }
      );
    });
    
    this.loadingPromises.set(name, loadPromise);
    return loadPromise;
  }
  
  /**
   * Load texture atlas with sprite definitions
   */
  async loadTextureAtlas(atlasPath, atlasData) {
    try {
      const atlasTexture = await this.loadTexture('atlas', atlasPath);
      
      // Create individual textures from atlas regions
      for (const [name, region] of Object.entries(atlasData)) {
        const texture = atlasTexture.clone();
        texture.needsUpdate = true;
        
        // Set texture offset and repeat for sprite region
        texture.offset.set(
          region.x / atlasTexture.image.width,
          region.y / atlasTexture.image.height
        );
        texture.repeat.set(
          region.width / atlasTexture.image.width,
          region.height / atlasTexture.image.height
        );
        
        this.textures.set(name, texture);
        console.log(`Atlas sprite '${name}' created`);
      }
      
      console.log('Texture atlas loaded successfully');
      return atlasTexture;
    } catch (error) {
      console.error('Failed to load texture atlas:', error);
      throw error;
    }
  }
  
  /**
   * Get a cached texture
   */
  getTexture(name) {
    const texture = this.textures.get(name);
    if (!texture) {
      console.warn(`Texture '${name}' not found in cache`);
    }
    return texture;
  }
  
  /**
   * Check if texture is loaded
   */
  hasTexture(name) {
    return this.textures.has(name);
  }
  
  /**
   * Preload multiple textures
   */
  async preloadTextures(textureList) {
    console.log(`Preloading ${textureList.length} textures...`);
    
    const promises = textureList.map(({ name, path }) => 
      this.loadTexture(name, path).catch(error => {
        console.error(`Failed to preload texture '${name}':`, error);
        return null;
      })
    );
    
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r !== null).length;
    
    console.log(`Preloaded ${successCount}/${textureList.length} textures`);
    return results;
  }
  
  /**
   * Create a placeholder texture (colored square)
   */
  createPlaceholderTexture(name, color = 0xffffff) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Fill with color
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    this.textures.set(name, texture);
    
    console.log(`Placeholder texture '${name}' created`);
    return texture;
  }
  
  /**
   * Dispose a specific texture
   */
  disposeTexture(name) {
    const texture = this.textures.get(name);
    if (texture) {
      texture.dispose();
      this.textures.delete(name);
      console.log(`Texture '${name}' disposed`);
    }
  }
  
  /**
   * Dispose all textures
   */
  disposeAll() {
    this.textures.forEach((texture, name) => {
      texture.dispose();
      console.log(`Texture '${name}' disposed`);
    });
    this.textures.clear();
    this.loadingPromises.clear();
    
    console.log('All textures disposed');
  }
  
  /**
   * Get memory usage info
   */
  getMemoryInfo() {
    let totalSize = 0;
    this.textures.forEach((texture) => {
      if (texture.image) {
        const size = texture.image.width * texture.image.height * 4; // RGBA
        totalSize += size;
      }
    });
    
    return {
      textureCount: this.textures.size,
      estimatedBytes: totalSize,
      estimatedMB: (totalSize / (1024 * 1024)).toFixed(2)
    };
  }
}
