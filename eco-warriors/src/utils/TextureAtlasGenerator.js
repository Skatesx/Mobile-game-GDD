/**
 * TextureAtlasGenerator - Generate texture atlas from individual sprites
 * This creates a single texture containing all game sprites for optimal performance
 */
export class TextureAtlasGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sprites = [];
    this.atlasData = {};
  }
  
  /**
   * Add a sprite to the atlas
   */
  addSprite(name, width, height, drawFunction) {
    this.sprites.push({
      name,
      width,
      height,
      drawFunction
    });
  }
  
  /**
   * Generate the texture atlas
   */
  generate(maxWidth = 512) {
    // Calculate atlas dimensions
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    let atlasHeight = 0;
    
    // First pass: calculate positions
    const positions = [];
    this.sprites.forEach(sprite => {
      if (currentX + sprite.width > maxWidth) {
        // Move to next row
        currentX = 0;
        currentY += rowHeight;
        rowHeight = 0;
      }
      
      positions.push({
        name: sprite.name,
        x: currentX,
        y: currentY,
        width: sprite.width,
        height: sprite.height
      });
      
      currentX += sprite.width;
      rowHeight = Math.max(rowHeight, sprite.height);
      atlasHeight = Math.max(atlasHeight, currentY + sprite.height);
    });
    
    // Set canvas size
    this.canvas.width = maxWidth;
    this.canvas.height = atlasHeight;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Second pass: draw sprites
    this.sprites.forEach((sprite, index) => {
      const pos = positions[index];
      this.ctx.save();
      this.ctx.translate(pos.x, pos.y);
      sprite.drawFunction(this.ctx, sprite.width, sprite.height);
      this.ctx.restore();
      
      // Store atlas data
      this.atlasData[sprite.name] = {
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height
      };
    });
    
    console.log('Texture atlas generated:', {
      size: `${this.canvas.width}x${this.canvas.height}`,
      sprites: this.sprites.length
    });
    
    return {
      canvas: this.canvas,
      atlasData: this.atlasData
    };
  }
  
  /**
   * Get the atlas as a data URL
   */
  getDataURL() {
    return this.canvas.toDataURL('image/png');
  }
  
  /**
   * Get the atlas data (sprite positions)
   */
  getAtlasData() {
    return this.atlasData;
  }
}

/**
 * Create default game sprites
 */
export function createDefaultSprites() {
  const generator = new TextureAtlasGenerator();
  
  // Basket sprite (80x60)
  generator.addSprite('basket', 80, 60, (ctx, w, h) => {
    // Draw traditional African basket/gourd
    ctx.fillStyle = '#8B4513'; // Saddle brown
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w/2.5, h/2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add pattern
    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(w/2, h/2, (w/5) * (i + 1) / 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Rim
    ctx.fillStyle = '#654321';
    ctx.fillRect(w * 0.2, h * 0.1, w * 0.6, h * 0.15);
  });
  
  // Water drop sprite (30x40)
  generator.addSprite('waterDrop', 30, 40, (ctx, w, h) => {
    // Draw water droplet
    const gradient = ctx.createRadialGradient(w/2, h/3, 0, w/2, h/3, w/2);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.5, '#4682B4'); // Steel blue
    gradient.addColorStop(1, '#1E90FF'); // Dodger blue
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.quadraticCurveTo(w, h/3, w/2, h);
    ctx.quadraticCurveTo(0, h/3, w/2, 0);
    ctx.fill();
    
    // Shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(w * 0.6, h * 0.3, w * 0.15, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Trash pollutant (35x35)
  generator.addSprite('pollutant_trash', 35, 35, (ctx, w, h) => {
    // Draw trash bag
    ctx.fillStyle = '#2F4F4F'; // Dark slate gray
    ctx.fillRect(w * 0.2, h * 0.3, w * 0.6, h * 0.6);
    
    // Tie
    ctx.fillStyle = '#DC143C'; // Crimson
    ctx.fillRect(w * 0.4, h * 0.2, w * 0.2, h * 0.2);
    
    // Crumples
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.5);
    ctx.lineTo(w * 0.7, h * 0.6);
    ctx.moveTo(w * 0.3, h * 0.7);
    ctx.lineTo(w * 0.7, h * 0.8);
    ctx.stroke();
  });
  
  // Oil pollutant (35x35)
  generator.addSprite('pollutant_oil', 35, 35, (ctx, w, h) => {
    // Draw oil barrel
    ctx.fillStyle = '#000000';
    ctx.fillRect(w * 0.25, h * 0.2, w * 0.5, h * 0.7);
    
    // Bands
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.fillRect(w * 0.25, h * 0.4, w * 0.5, h * 0.1);
    ctx.fillRect(w * 0.25, h * 0.7, w * 0.5, h * 0.1);
    
    // Warning symbol
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(w/2, h/2, w * 0.15, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Plastic pollutant (35x35)
  generator.addSprite('pollutant_plastic', 35, 35, (ctx, w, h) => {
    // Draw plastic bottle
    ctx.fillStyle = 'rgba(135, 206, 250, 0.7)'; // Light blue transparent
    
    // Bottle body
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.3);
    ctx.lineTo(w * 0.3, h * 0.8);
    ctx.quadraticCurveTo(w * 0.3, h * 0.9, w * 0.5, h * 0.9);
    ctx.quadraticCurveTo(w * 0.7, h * 0.9, w * 0.7, h * 0.8);
    ctx.lineTo(w * 0.7, h * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Cap
    ctx.fillStyle = '#FF6347'; // Tomato
    ctx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.25);
    
    // Label
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.35, h * 0.5, w * 0.3, h * 0.2);
  });
  
  return generator;
}
