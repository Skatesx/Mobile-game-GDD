import { TextureManager } from '../rendering/TextureManager.js';
import { createDefaultSprites } from './TextureAtlasGenerator.js';

/**
 * AssetLoader - Progressive loading of game assets with priority system
 */
export class AssetLoader {
  constructor() {
    this.textureManager = new TextureManager();
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.onProgressCallback = null;
    this.onCompleteCallback = null;
    
    console.log('AssetLoader initialized');
  }
  
  /**
   * Load critical assets first (required for gameplay)
   */
  async loadCriticalAssets() {
    console.log('Loading critical assets...');
    
    const criticalAssets = [
      'sprites', // Game sprites (basket, drops, pollutants)
      'educational' // Educational content
    ];
    
    this.totalAssets = criticalAssets.length;
    this.loadedAssets = 0;
    
    try {
      // Generate sprite atlas
      await this.generateSpriteAtlas();
      this.updateProgress();
      
      // Load educational content
      await this.loadEducationalContent();
      this.updateProgress();
      
      console.log('Critical assets loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load critical assets:', error);
      throw error;
    }
  }
  
  /**
   * Load secondary assets (nice-to-have)
   */
  async loadSecondaryAssets() {
    console.log('Loading secondary assets...');
    
    try {
      // Load audio files (if available)
      // await this.loadAudioFiles();
      
      // Load additional patterns
      // await this.loadPatterns();
      
      console.log('Secondary assets loaded');
      return true;
    } catch (error) {
      console.error('Failed to load secondary assets:', error);
      // Don't throw - secondary assets are optional
      return false;
    }
  }
  
  /**
   * Generate sprite atlas from procedural sprites
   */
  async generateSpriteAtlas() {
    return new Promise((resolve) => {
      try {
        const generator = createDefaultSprites();
        const { canvas, atlasData } = generator.generate(512);
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Load atlas texture
        this.textureManager.loadTexture('atlas', dataURL).then(() => {
          // Create individual sprite textures from atlas
          const atlasTexture = this.textureManager.getTexture('atlas');
          
          Object.entries(atlasData).forEach(([name, region]) => {
            const texture = atlasTexture.clone();
            texture.needsUpdate = true;
            
            // Set texture offset and repeat for sprite region
            texture.offset.set(
              region.x / canvas.width,
              region.y / canvas.height
            );
            texture.repeat.set(
              region.width / canvas.width,
              region.height / canvas.height
            );
            
            // Cache the sprite texture
            this.textureManager.textures.set(name, texture);
          });
          
          console.log('Sprite atlas generated and loaded');
          resolve();
        });
      } catch (error) {
        console.error('Failed to generate sprite atlas:', error);
        // Create fallback placeholder textures
        this.createFallbackTextures();
        resolve();
      }
    });
  }
  
  /**
   * Create fallback placeholder textures
   */
  createFallbackTextures() {
    console.log('Creating fallback textures...');
    
    this.textureManager.createPlaceholderTexture('basket', 0x8B4513);
    this.textureManager.createPlaceholderTexture('waterDrop', 0x4682B4);
    this.textureManager.createPlaceholderTexture('pollutant_trash', 0x2F4F4F);
    this.textureManager.createPlaceholderTexture('pollutant_oil', 0x000000);
    this.textureManager.createPlaceholderTexture('pollutant_plastic', 0x87CEEB);
    
    console.log('Fallback textures created');
  }
  
  /**
   * Load educational content from JSON files
   */
  async loadEducationalContent() {
    try {
      const [proverbs, educational] = await Promise.all([
        fetch('/assets/data/proverbs.json').then(r => r.json()),
        fetch('/assets/data/educational.json').then(r => r.json())
      ]);
      
      // Store in window for easy access (or use a proper state manager)
      window.gameContent = {
        proverbs,
        tips: educational.tips,
        facts: educational.facts
      };
      
      console.log('Educational content loaded:', {
        proverbs: proverbs.length,
        tips: educational.tips.length,
        facts: educational.facts.length
      });
    } catch (error) {
      console.error('Failed to load educational content:', error);
      // Create fallback content
      window.gameContent = {
        proverbs: [{ text: 'Water is life', origin: 'African proverb', displayScore: 50 }],
        tips: ['Save water, save lives!'],
        facts: [{ text: 'Clean water is essential for life', category: 'general' }]
      };
    }
  }
  
  /**
   * Update loading progress
   */
  updateProgress() {
    this.loadedAssets++;
    const progress = (this.loadedAssets / this.totalAssets) * 100;
    
    if (this.onProgressCallback) {
      this.onProgressCallback(progress, this.loadedAssets, this.totalAssets);
    }
    
    if (this.loadedAssets >= this.totalAssets && this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }
  
  /**
   * Get loading progress (0-100)
   */
  getLoadProgress() {
    if (this.totalAssets === 0) return 0;
    return Math.round((this.loadedAssets / this.totalAssets) * 100);
  }
  
  /**
   * Register progress callback
   */
  onProgress(callback) {
    this.onProgressCallback = callback;
  }
  
  /**
   * Register completion callback
   */
  onLoadComplete(callback) {
    this.onCompleteCallback = callback;
  }
  
  /**
   * Get the texture manager
   */
  getTextureManager() {
    return this.textureManager;
  }
  
  /**
   * Retry loading failed assets
   */
  async retryFailedAssets(maxRetries = 3) {
    console.log(`Retrying failed assets (max ${maxRetries} attempts)...`);
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.loadCriticalAssets();
        console.log('Retry successful');
        return true;
      } catch (error) {
        console.error(`Retry attempt ${i + 1} failed:`, error);
        if (i < maxRetries - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    console.error('All retry attempts failed');
    return false;
  }
}
