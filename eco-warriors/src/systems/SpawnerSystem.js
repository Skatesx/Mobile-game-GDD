import { Config } from '../game/Config.js';

/**
 * SpawnerSystem - Generate falling items at intervals
 */
export class SpawnerSystem {
  constructor(poolManager, sceneManager, difficultyManager) {
    this.poolManager = poolManager;
    this.sceneManager = sceneManager;
    this.difficultyManager = difficultyManager;
    
    this.timeSinceLastSpawn = 0;
    this.nextSpawnInterval = this.getRandomSpawnInterval();
    this.isActive = false;
    this.spawnedEntities = [];
    
    console.log('SpawnerSystem initialized');
  }
  
  /**
   * Start spawning
   */
  start() {
    this.isActive = true;
    this.timeSinceLastSpawn = 0;
    console.log('SpawnerSystem started');
  }
  
  /**
   * Stop spawning
   */
  stop() {
    this.isActive = false;
    console.log('SpawnerSystem stopped');
  }
  
  /**
   * Update spawner (call every frame)
   */
  update(deltaTime) {
    if (!this.isActive) return;
    
    this.timeSinceLastSpawn += deltaTime;
    
    // Check if it's time to spawn
    if (this.timeSinceLastSpawn >= this.nextSpawnInterval) {
      this.spawnItem();
      this.timeSinceLastSpawn = 0;
      this.nextSpawnInterval = this.getRandomSpawnInterval();
    }
    
    // Update all spawned entities
    this.updateSpawnedEntities(deltaTime);
  }
  
  /**
   * Spawn a new item (water drop or pollutant)
   */
  spawnItem() {
    // Determine item type based on probability
    const isWaterDrop = Math.random() < Config.SPAWNER.WATER_DROP_PROBABILITY;
    
    // Get random horizontal position
    const x = this.getRandomXPosition();
    const y = Config.SPAWNER.SPAWN_Y;
    
    // Get speed based on difficulty
    const speed = this.difficultyManager.getFallSpeed();
    
    let entity;
    
    if (isWaterDrop) {
      // Spawn water drop
      entity = this.poolManager.acquireWaterDrop(x, y, speed);
    } else {
      // Spawn pollutant with random subtype
      const subtype = this.getRandomPollutantType();
      entity = this.poolManager.acquirePollutant(x, y, speed, subtype);
    }
    
    // Add to scene
    this.sceneManager.addEntity(entity);
    this.spawnedEntities.push(entity);
    
    // console.log(`Spawned ${entity.type} at (${x.toFixed(2)}, ${y.toFixed(2)})`);
  }
  
  /**
   * Get random spawn interval based on difficulty
   */
  getRandomSpawnInterval() {
    const spawnRate = this.difficultyManager.getSpawnRate();
    const min = spawnRate * 0.8; // 80% of base rate
    const max = spawnRate * 1.2; // 120% of base rate
    return min + Math.random() * (max - min);
  }
  
  /**
   * Get random horizontal spawn position
   */
  getRandomXPosition() {
    // Get world bounds
    const aspect = window.innerWidth / window.innerHeight;
    const worldWidth = Config.WORLD_HEIGHT * aspect;
    
    // Add margins to avoid spawning too close to edges
    const margin = 0.5;
    const minX = -worldWidth / 2 + margin;
    const maxX = worldWidth / 2 - margin;
    
    return minX + Math.random() * (maxX - minX);
  }
  
  /**
   * Get random pollutant type
   */
  getRandomPollutantType() {
    const types = Config.POLLUTANT.TYPES;
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
  }
  
  /**
   * Update all spawned entities
   */
  updateSpawnedEntities(deltaTime) {
    const entitiesToRemove = [];
    
    this.spawnedEntities.forEach((entity, index) => {
      // Update entity
      entity.update(deltaTime);
      
      // Check if entity is inactive (off screen)
      if (!entity.isActive()) {
        entitiesToRemove.push(index);
      }
    });
    
    // Remove inactive entities (in reverse order to maintain indices)
    for (let i = entitiesToRemove.length - 1; i >= 0; i--) {
      const index = entitiesToRemove[i];
      const entity = this.spawnedEntities[index];
      
      // Remove from scene
      this.sceneManager.removeEntity(entity);
      
      // Return to pool
      this.poolManager.releaseEntity(entity);
      
      // Remove from array
      this.spawnedEntities.splice(index, 1);
    }
  }
  
  /**
   * Get all active spawned entities
   */
  getActiveEntities() {
    return this.spawnedEntities.filter(e => e.isActive());
  }
  
  /**
   * Get entities by type
   */
  getEntitiesByType(type) {
    return this.spawnedEntities.filter(e => e.type === type && e.isActive());
  }
  
  /**
   * Clear all spawned entities
   */
  clearAll() {
    // Remove all entities from scene and return to pool
    this.spawnedEntities.forEach(entity => {
      this.sceneManager.removeEntity(entity);
      this.poolManager.releaseEntity(entity);
    });
    
    this.spawnedEntities = [];
    console.log('All spawned entities cleared');
  }
  
  /**
   * Set spawn rate manually (for testing)
   */
  setSpawnRate(rate) {
    this.nextSpawnInterval = rate;
  }
  
  /**
   * Get spawner statistics
   */
  getStats() {
    return {
      active: this.isActive,
      totalSpawned: this.spawnedEntities.length,
      activeEntities: this.getActiveEntities().length,
      waterDrops: this.getEntitiesByType('waterDrop').length,
      pollutants: this.getEntitiesByType('pollutant').length,
      nextSpawnIn: Math.max(0, this.nextSpawnInterval - this.timeSinceLastSpawn).toFixed(2)
    };
  }
}
