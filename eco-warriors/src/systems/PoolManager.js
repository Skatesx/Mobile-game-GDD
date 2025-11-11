import { ObjectPool } from '../utils/ObjectPool.js';
import { WaterDrop } from '../entities/WaterDrop.js';
import { Pollutant } from '../entities/Pollutant.js';
import { Config } from '../game/Config.js';

/**
 * PoolManager - Manages object pools for all entity types
 */
export class PoolManager {
  constructor(textureManager) {
    this.textureManager = textureManager;
    this.pools = new Map();
    
    this.initializePools();
    
    console.log('PoolManager initialized');
  }
  
  /**
   * Initialize all entity pools
   */
  initializePools() {
    // Water drop pool
    this.pools.set('waterDrop', new ObjectPool(
      () => new WaterDrop(0, 0, Config.WATER_DROP.MIN_SPEED, this.textureManager),
      Config.PERFORMANCE.POOL_SIZE_WATER
    ));
    
    // Pollutant pool
    this.pools.set('pollutant', new ObjectPool(
      () => new Pollutant(0, 0, Config.POLLUTANT.MIN_SPEED, 'trash', this.textureManager),
      Config.PERFORMANCE.POOL_SIZE_POLLUTANT
    ));
    
    console.log('Entity pools initialized:', {
      waterDrop: Config.PERFORMANCE.POOL_SIZE_WATER,
      pollutant: Config.PERFORMANCE.POOL_SIZE_POLLUTANT
    });
  }
  
  /**
   * Acquire a water drop from the pool
   */
  acquireWaterDrop(x, y, speed) {
    const pool = this.pools.get('waterDrop');
    const waterDrop = pool.acquire(x, y, speed, this.textureManager);
    return waterDrop;
  }
  
  /**
   * Acquire a pollutant from the pool
   */
  acquirePollutant(x, y, speed, subtype) {
    const pool = this.pools.get('pollutant');
    const pollutant = pool.acquire(x, y, speed, subtype, this.textureManager);
    return pollutant;
  }
  
  /**
   * Release a water drop back to the pool
   */
  releaseWaterDrop(waterDrop) {
    const pool = this.pools.get('waterDrop');
    pool.release(waterDrop);
  }
  
  /**
   * Release a pollutant back to the pool
   */
  releasePollutant(pollutant) {
    const pool = this.pools.get('pollutant');
    pool.release(pollutant);
  }
  
  /**
   * Release an entity based on its type
   */
  releaseEntity(entity) {
    if (!entity) return;
    
    switch (entity.type) {
      case 'waterDrop':
        this.releaseWaterDrop(entity);
        break;
      case 'pollutant':
        this.releasePollutant(entity);
        break;
      default:
        console.warn(`Unknown entity type for pooling: ${entity.type}`);
    }
  }
  
  /**
   * Get pool statistics for all pools
   */
  getAllStats() {
    const stats = {};
    this.pools.forEach((pool, name) => {
      stats[name] = pool.getStats();
    });
    return stats;
  }
  
  /**
   * Get statistics for a specific pool
   */
  getPoolStats(poolName) {
    const pool = this.pools.get(poolName);
    return pool ? pool.getStats() : null;
  }
  
  /**
   * Check if any pool needs expansion
   */
  checkPoolHealth() {
    const issues = [];
    
    this.pools.forEach((pool, name) => {
      if (pool.needsExpansion(0.9)) {
        issues.push({
          pool: name,
          message: `Pool '${name}' is at high utilization`,
          stats: pool.getStats()
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Expand a specific pool
   */
  expandPool(poolName, count = 10) {
    const pool = this.pools.get(poolName);
    if (pool) {
      pool.expand(count);
      console.log(`Expanded ${poolName} pool by ${count}`);
    } else {
      console.warn(`Pool '${poolName}' not found`);
    }
  }
  
  /**
   * Shrink pools to reduce memory usage
   */
  shrinkPools() {
    this.pools.forEach((pool, name) => {
      const stats = pool.getStats();
      // Keep at least 50% of total as available
      const targetSize = Math.ceil(stats.total * 0.5);
      pool.shrink(targetSize);
    });
    
    console.log('Pools shrunk to reduce memory usage');
  }
  
  /**
   * Clear all pools
   */
  clearAll() {
    this.pools.forEach((pool, name) => {
      pool.clear();
      console.log(`Pool '${name}' cleared`);
    });
  }
  
  /**
   * Get total memory estimate for all pools
   */
  getMemoryEstimate() {
    let totalObjects = 0;
    this.pools.forEach(pool => {
      const stats = pool.getStats();
      totalObjects += stats.total;
    });
    
    // Rough estimate: each entity ~1KB
    const estimatedKB = totalObjects * 1;
    
    return {
      totalObjects,
      estimatedKB,
      estimatedMB: (estimatedKB / 1024).toFixed(2)
    };
  }
  
  /**
   * Dispose all pools
   */
  dispose() {
    this.clearAll();
    this.pools.clear();
    console.log('PoolManager disposed');
  }
}
