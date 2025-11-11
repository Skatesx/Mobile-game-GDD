// Game configuration constants
export const Config = {
  // Game dimensions (world units)
  WORLD_WIDTH: 10,
  WORLD_HEIGHT: 16,
  
  // Basket properties
  BASKET: {
    WIDTH: 0.8,
    HEIGHT: 0.6,
    SPEED: 3.0, // world units per second
    START_Y: -7.0 // bottom of screen
  },
  
  // Water drop properties
  WATER_DROP: {
    WIDTH: 0.3,
    HEIGHT: 0.4,
    MIN_SPEED: 1.5,
    MAX_SPEED: 4.0,
    POINTS: 10
  },
  
  // Pollutant properties
  POLLUTANT: {
    WIDTH: 0.35,
    HEIGHT: 0.35,
    MIN_SPEED: 1.5,
    MAX_SPEED: 4.0,
    POINTS: -5,
    TYPES: ['trash', 'oil', 'plastic']
  },
  
  // Spawning configuration
  SPAWNER: {
    MIN_INTERVAL: 0.5, // seconds
    MAX_INTERVAL: 2.0,
    WATER_DROP_PROBABILITY: 0.7, // 70%
    SPAWN_Y: 8.0 // top of screen
  },
  
  // Difficulty settings
  DIFFICULTY: {
    MAX_LEVEL: 10,
    POINTS_PER_LEVEL: 100,
    SPEED_INCREASE_PER_LEVEL: 0.15, // 15%
    SPAWN_RATE_DECREASE_PER_LEVEL: 0.10 // 10%
  },
  
  // Performance settings
  PERFORMANCE: {
    TARGET_FPS: 30,
    MAX_PIXEL_RATIO: 2,
    MAX_ENTITIES: 50,
    POOL_SIZE_WATER: 30,
    POOL_SIZE_POLLUTANT: 20,
    POOL_SIZE_PARTICLES: 10
  },
  
  // Mobile optimization
  MOBILE: {
    TOUCH_SMOOTHING: 0.2,
    HAPTIC_DURATION: 50, // milliseconds
    LOW_BATTERY_THRESHOLD: 0.2, // 20%
    THERMAL_FPS_REDUCTION: 0.5 // reduce to 50% when hot
  },
  
  // Color palette (African-inspired)
  COLORS: {
    PRIMARY: 0x8B4513,      // Saddle brown
    SECONDARY: 0xD2691E,    // Chocolate
    ACCENT: 0xFFD700,       // Gold
    EARTH: 0xCD853F,        // Peru
    WATER: 0x4682B4,        // Steel blue
    NATURE: 0x228B22,       // Forest green
    WARNING: 0xDC143C       // Crimson
  },
  
  // Audio settings
  AUDIO: {
    MUSIC_VOLUME: 0.5,
    SFX_VOLUME: 0.7
  },
  
  // Educational content timing
  EDUCATION: {
    TIP_DURATION: 4000, // milliseconds
    PROVERB_SCORES: [50, 150, 300],
    FACT_DISPLAY_DURATION: 5000
  }
};
