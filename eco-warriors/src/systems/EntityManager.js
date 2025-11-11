import { Basket } from '../entities/Basket.js';
import { WaterDrop } from '../entities/WaterDrop.js';
import { Pollutant } from '../entities/Pollutant.js';
import { Config } from '../game/Config.js';

/**
 * EntityManager - Manages lifecycle of all game entities
 */
export class EntityManager {
  constructor(sceneManager, textureManager) {
    this.sceneManager = sceneManager;
    this.textureManager = textureManager;
    this.entities = new Map();
    this.basket = null;
    
    console.log('EntityManager initialized');
  }
  
  /**
   * Create a new entity
   */
  createEntity(type, properties) {
    let entity = null;
    
    switch (type) {
      case 'basket':
        entity = new Basket(
          properties.x || 0,
          properties.y || Config.BASKET.START_Y,
          this.textureManager
        );
        this.basket = entity;
        break;
        
      case 'waterDrop':
        entity = new WaterDrop(
          properties.x,
          properties.y,
          properties.speed || Config.WATER_DROP.MIN_SPEED,
          this.textureManager
        );
        break;
        
      case 'pollutant':
        entity = new Pollutant(
          properties.x,
          properties.y,
          properties.speed || Config.POLLUTANT.MIN_SPEED,
          properties.subtype || 'trash',
          this.textureManager
        );
        break;
        
      default:
        console.warn(`Unknown entity type: ${type}`);
        return null;
    }
    
    if (entity) {
      this.entities.set(entity.id, entity);
      this.sceneManager.addEntity(entity);
      console.log(`Entity created: ${type} (${entity.id})`);
    }
    
    return entity;
  }
  
  /**
   * Destroy an entity
   */
  destroyEntity(entityId) {
    const entity = this.entities.get(entityId);
    if (!entity) {
      console.warn(`Entity not found: ${entityId}`);
      return;
    }
    
    // Remove from scene
    this.sceneManager.removeEntity(entity);
    
    // Cleanup entity resources
    if (entity.dispose) {
      entity.dispose();
    }
    
    // Remove from map
    this.entities.delete(entityId);
    
    console.log(`Entity destroyed: ${entityId}`);
  }
  
  /**
   * Get entities by type
   */
  getEntitiesByType(type) {
    const result = [];
    this.entities.forEach(entity => {
      if (entity.type === type) {
        result.push(entity);
      }
    });
    return result;
  }
  
  /**
   * Get all active entities
   */
  getActiveEntities() {
    const result = [];
    this.entities.forEach(entity => {
      if (entity.active !== false) {
        result.push(entity);
      }
    });
    return result;
  }
  
  /**
   * Get entity by ID
   */
  getEntity(entityId) {
    return this.entities.get(entityId);
  }
  
  /**
   * Get the player basket
   */
  getBasket() {
    return this.basket;
  }
  
  /**
   * Update all entities
   */
  updateAll(deltaTime) {
    const entitiesToRemove = [];
    
    this.entities.forEach(entity => {
      // Skip basket (updated separately by input)
      if (entity.type === 'basket') return;
      
      // Update entity
      if (entity.update) {
        entity.update(deltaTime);
      }
      
      // Mark inactive entities for removal
      if (entity.active === false) {
        entitiesToRemove.push(entity.id);
      }
    });
    
    // Remove inactive entities
    entitiesToRemove.forEach(id => {
      this.destroyEntity(id);
    });
  }
  
  /**
   * Clear all entities except basket
   */
  clearAll(keepBasket = true) {
    const entitiesToRemove = [];
    
    this.entities.forEach(entity => {
      if (keepBasket && entity.type === 'basket') {
        return;
      }
      entitiesToRemove.push(entity.id);
    });
    
    entitiesToRemove.forEach(id => {
      this.destroyEntity(id);
    });
    
    console.log(`Cleared ${entitiesToRemove.length} entities`);
  }
  
  /**
   * Get entity count
   */
  getEntityCount() {
    return this.entities.size;
  }
  
  /**
   * Get entity count by type
   */
  getEntityCountByType(type) {
    let count = 0;
    this.entities.forEach(entity => {
      if (entity.type === type) count++;
    });
    return count;
  }
  
  /**
   * Check if entity limit reached
   */
  isEntityLimitReached() {
    return this.entities.size >= Config.PERFORMANCE.MAX_ENTITIES;
  }
  
  /**
   * Cleanup all entities
   */
  dispose() {
    this.entities.forEach(entity => {
      if (entity.dispose) {
        entity.dispose();
      }
    });
    this.entities.clear();
    this.basket = null;
    
    console.log('EntityManager disposed');
  }
}
