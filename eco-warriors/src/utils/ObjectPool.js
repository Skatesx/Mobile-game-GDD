/**
 * ObjectPool - Reuse Three.js objects to reduce garbage collection
 * This is critical for mobile performance to avoid frame drops
 */
export class ObjectPool {
  constructor(factory, initialSize = 10) {
    this.factory = factory; // Function that creates new objects
    this.available = []; // Available objects ready for use
    this.inUse = new Set(); // Objects currently in use
    this.totalCreated = 0;
    
    // Pre-allocate initial objects
    this.expand(initialSize);
    
    console.log(`ObjectPool created with ${initialSize} objects`);
  }
  
  /**
   * Acquire an object from the pool
   */
  acquire(...args) {
    let obj;
    
    if (this.available.length > 0) {
      // Reuse an available object
      obj = this.available.pop();
      
      // Reset the object if it has a reset method
      if (obj.reset && typeof obj.reset === 'function') {
        obj.reset(...args);
      }
    } else {
      // Create a new object if pool is empty
      obj = this.factory(...args);
      this.totalCreated++;
      console.log(`Pool expanded: created object #${this.totalCreated}`);
    }
    
    // Mark as in use
    this.inUse.add(obj);
    
    return obj;
  }
  
  /**
   * Release an object back to the pool
   */
  release(obj) {
    if (!obj) {
      console.warn('Attempted to release null object');
      return;
    }
    
    if (!this.inUse.has(obj)) {
      console.warn('Attempted to release object not in use');
      return;
    }
    
    // Remove from in-use set
    this.inUse.delete(obj);
    
    // Deactivate the object
    if (obj.deactivate && typeof obj.deactivate === 'function') {
      obj.deactivate();
    }
    
    // Return to available pool
    this.available.push(obj);
  }
  
  /**
   * Expand the pool by creating more objects
   */
  expand(count) {
    for (let i = 0; i < count; i++) {
      const obj = this.factory();
      
      // Deactivate immediately
      if (obj.deactivate && typeof obj.deactivate === 'function') {
        obj.deactivate();
      }
      
      this.available.push(obj);
      this.totalCreated++;
    }
    
    console.log(`Pool expanded by ${count} objects (total: ${this.totalCreated})`);
  }
  
  /**
   * Get pool statistics
   */
  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.totalCreated,
      utilizationPercent: this.totalCreated > 0 
        ? Math.round((this.inUse.size / this.totalCreated) * 100)
        : 0
    };
  }
  
  /**
   * Clear the pool and dispose all objects
   */
  clear() {
    // Dispose all available objects
    this.available.forEach(obj => {
      if (obj.dispose && typeof obj.dispose === 'function') {
        obj.dispose();
      }
    });
    
    // Dispose all in-use objects
    this.inUse.forEach(obj => {
      if (obj.dispose && typeof obj.dispose === 'function') {
        obj.dispose();
      }
    });
    
    this.available = [];
    this.inUse.clear();
    this.totalCreated = 0;
    
    console.log('ObjectPool cleared');
  }
  
  /**
   * Shrink pool by removing excess available objects
   */
  shrink(targetSize) {
    const toRemove = Math.max(0, this.available.length - targetSize);
    
    for (let i = 0; i < toRemove; i++) {
      const obj = this.available.pop();
      if (obj && obj.dispose && typeof obj.dispose === 'function') {
        obj.dispose();
      }
      this.totalCreated--;
    }
    
    if (toRemove > 0) {
      console.log(`Pool shrunk by ${toRemove} objects`);
    }
  }
  
  /**
   * Get all objects currently in use
   */
  getInUseObjects() {
    return Array.from(this.inUse);
  }
  
  /**
   * Check if pool needs expansion
   */
  needsExpansion(threshold = 0.8) {
    if (this.totalCreated === 0) return true;
    const utilization = this.inUse.size / this.totalCreated;
    return utilization > threshold;
  }
}
