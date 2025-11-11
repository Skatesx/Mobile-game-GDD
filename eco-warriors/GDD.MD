# Game Design Document: Eco-Warriors

## Overview

Eco-Warriors is a fast-paced, arcade-style mobile game that combines environmental education with engaging gameplay. Players control a traditional African basket/gourd to collect falling clean water drops while avoiding pollutants. The game progressively increases in difficulty, teaching players about water conservation through immediate feedback and cultural immersion. Built for mobile platforms (iOS/Android), the game targets ages 8+ and aims to deliver 2-5 minute gameplay sessions with high replayability.

### Core Pillars
1. **Environmental Education**: Teach water conservation through gameplay
2. **Cultural Authenticity**: Celebrate African heritage through visuals, audio, and wisdom
3. **Engaging Gameplay**: Fast reflexes, progressive difficulty, instant feedback
4. **Accessibility**: Simple controls, clear objectives, suitable for all ages

## Architecture

### Technology Stack
- **Platform**: HTML5/JavaScript (cross-platform mobile via Cordova/Capacitor)
- **Rendering**: HTML5 Canvas API for 2D graphics
- **Audio**: Web Audio API for sound effects and music
- **Storage**: LocalStorage for high scores and settings
- **Build Tools**: Webpack for bundling, Babel for transpilation

### System Architecture

```
┌─────────────────────────────────────────┐
│         Game Application Layer          │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Game    │  │  Input   │  │  UI    ││
│  │  Loop    │  │  Handler │  │Manager ││
│  └──────────┘  └──────────┘  └────────┘│
├─────────────────────────────────────────┤
│         Core Game Systems               │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Entity   │  │Collision │  │ Score  ││
│  │ Manager  │  │ System   │  │System  ││
│  └──────────┘  └──────────┘  └────────┘│
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Spawner  │  │Difficulty│  │ Audio  ││
│  │ System   │  │ Manager  │  │Manager ││
│  └──────────┘  └──────────┘  └────────┘│
├─────────────────────────────────────────┤
│         Rendering & Assets              │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Canvas   │  │ Sprite   │  │Pattern ││
│  │Renderer  │  │ Manager  │  │Library ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

### File Structure
```
eco-warriors/
├── index.html
├── src/
│   ├── main.js                 # Entry point
│   ├── game/
│   │   ├── GameLoop.js         # Main game loop
│   │   ├── GameState.js        # State management
│   │   └── Config.js           # Game constants
│   ├── entities/
│   │   ├── Basket.js           # Player basket
│   │   ├── WaterDrop.js        # Clean water drops
│   │   └── Pollutant.js        # Trash/oil/plastic
│   ├── systems/
│   │   ├── EntityManager.js    # Entity lifecycle
│   │   ├── CollisionSystem.js  # Collision detection
│   │   ├── SpawnerSystem.js    # Item spawning
│   │   ├── ScoreSystem.js      # Score tracking
│   │   ├── DifficultyManager.js# Difficulty scaling
│   │   └── AudioManager.js     # Sound/music
│   ├── rendering/
│   │   ├── CanvasRenderer.js   # Canvas drawing
│   │   ├── SpriteManager.js    # Sprite handling
│   │   └── PatternLibrary.js   # African patterns
│   ├── ui/
│   │   ├── UIManager.js        # UI controller
│   │   ├── MenuScreen.js       # Main menu
│   │   ├── GameScreen.js       # Gameplay UI
│   │   └── GameOverScreen.js   # End screen
│   └── utils/
│       ├── InputHandler.js     # Touch/mouse input
│       └── StorageManager.js   # LocalStorage
├── assets/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── images/
│   │   ├── sprites/
│   │   └── patterns/
│   └── data/
│       ├── proverbs.json       # African wisdom
│       └── educational.json    # Eco facts
└── styles/
    └── game.css
```

## Components and Interfaces

### 1. Game Loop (GameLoop.js)

**Purpose**: Manages the main game update and render cycle

**Interface**:
```javascript
class GameLoop {
  constructor(gameState, renderer, systems)
  start()                    // Begin game loop
  stop()                     // Pause/stop loop
  update(deltaTime)          // Update game state
  render()                   // Draw current frame
  setTargetFPS(fps)          // Set frame rate
}
```

**Key Responsibilities**:
- Maintain consistent frame rate (30-60 FPS)
- Calculate delta time for smooth animations
- Coordinate system updates in correct order
- Handle pause/resume functionality

### 2. Entity Manager (EntityManager.js)

**Purpose**: Manages lifecycle of all game entities (basket, drops, pollutants)

**Interface**:
```javascript
class EntityManager {
  createEntity(type, properties)  // Spawn new entity
  destroyEntity(entityId)         // Remove entity
  getEntitiesByType(type)         // Query entities
  updateAll(deltaTime)            // Update all entities
  clearAll()                      // Remove all entities
}
```

**Entity Base Structure**:
```javascript
{
  id: string,
  type: 'basket' | 'waterDrop' | 'pollutant',
  position: { x: number, y: number },
  velocity: { x: number, y: number },
  size: { width: number, height: number },
  active: boolean,
  sprite: SpriteData
}
```

### 3. Basket (Basket.js)

**Purpose**: Player-controlled collection basket

**Interface**:
```javascript
class Basket extends Entity {
  constructor(x, y)
  moveLeft(speed)           // Move basket left
  moveRight(speed)          // Move basket right
  stopMovement()            // Halt movement
  getBounds()               // Get collision box
  playCollectAnimation()    // Visual feedback
}
```

**Properties**:
- Position: Bottom center of screen
- Size: 80x60 pixels
- Movement speed: 300 pixels/second
- Sprite: Traditional African gourd/basket design

### 4. Water Drop (WaterDrop.js)

**Purpose**: Collectible clean water drops

**Interface**:
```javascript
class WaterDrop extends Entity {
  constructor(x, y, speed)
  update(deltaTime)         // Update position
  getBounds()               // Get collision box
  getPointValue()           // Return 10 points
}
```

**Properties**:
- Size: 30x40 pixels
- Fall speed: 150-400 pixels/second (difficulty-based)
- Sprite: Blue-green water droplet with shine
- Point value: +10

### 5. Pollutant (Pollutant.js)

**Purpose**: Hazardous items to avoid

**Interface**:
```javascript
class Pollutant extends Entity {
  constructor(x, y, speed, subtype)
  update(deltaTime)         // Update position
  getBounds()               // Get collision box
  getPointPenalty()         // Return -5 points
  getSubtype()              // 'trash' | 'oil' | 'plastic'
}
```

**Properties**:
- Size: 35x35 pixels
- Fall speed: 150-400 pixels/second
- Subtypes: Trash bag, oil barrel, plastic bottle
- Point penalty: -5

### 6. Collision System (CollisionSystem.js)

**Purpose**: Detect and handle entity collisions

**Interface**:
```javascript
class CollisionSystem {
  checkCollisions(basket, items)  // Detect collisions
  handleCollision(basket, item)   // Process collision
  isColliding(entityA, entityB)   // AABB collision check
}
```

**Algorithm**: Axis-Aligned Bounding Box (AABB) collision detection
```javascript
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
```

### 7. Spawner System (SpawnerSystem.js)

**Purpose**: Generate falling items at intervals

**Interface**:
```javascript
class SpawnerSystem {
  constructor(entityManager, difficultyManager)
  update(deltaTime)              // Check spawn timing
  spawnItem()                    // Create new item
  setSpawnRate(rate)             // Adjust frequency
  getRandomXPosition()           // Random horizontal spawn
}
```

**Spawn Logic**:
- Spawn interval: 0.5-2 seconds (difficulty-based)
- Item probability: 70% water drops, 30% pollutants
- X position: Random across screen width (with margins)
- Y position: Just above screen top

### 8. Score System (ScoreSystem.js)

**Purpose**: Track and manage player score

**Interface**:
```javascript
class ScoreSystem {
  addPoints(amount)              // Increase score
  deductPoints(amount)           // Decrease score
  getScore()                     // Current score
  getHighScore()                 // Best score
  saveHighScore()                // Persist to storage
  reset()                        // Reset to zero
}
```

**Score Rules**:
- Clean water drop: +10 points
- Pollutant: -5 points
- Minimum score: 0 (cannot go negative)
- Game over threshold: -50 points (if implemented)

### 9. Difficulty Manager (DifficultyManager.js)

**Purpose**: Scale game difficulty over time

**Interface**:
```javascript
class DifficultyManager {
  constructor(initialLevel)
  update(currentScore)           // Check for level up
  getCurrentLevel()              // Get difficulty level
  getSpawnRate()                 // Items per second
  getFallSpeed()                 // Item velocity
  getMaxLevel()                  // Level cap (10)
}
```

**Difficulty Scaling**:
```javascript
Level 1:  Spawn rate: 1.5s, Fall speed: 150px/s
Level 2:  Spawn rate: 1.35s, Fall speed: 172px/s (+15%)
Level 3:  Spawn rate: 1.21s, Fall speed: 198px/s
...
Level 10: Spawn rate: 0.52s, Fall speed: 456px/s (max)
```

**Level Up Trigger**: Every 100 points

### 10. Audio Manager (AudioManager.js)

**Purpose**: Handle all sound effects and music

**Interface**:
```javascript
class AudioManager {
  loadAudio(audioFiles)          // Preload sounds
  playMusic(trackName, loop)     // Background music
  playSFX(soundName)             // Sound effect
  setMusicVolume(volume)         // 0.0 - 1.0
  setSFXVolume(volume)           // 0.0 - 1.0
  stopAll()                      // Silence everything
}
```

**Audio Assets**:
- Background music: African percussion loop (djembe, kalimba)
- SFX - Water collect: Pleasant kalimba notes
- SFX - Pollutant collect: Discordant percussion
- SFX - Level up: Celebratory drum roll
- SFX - Game over: Somber kora melody

### 11. Canvas Renderer (CanvasRenderer.js)

**Purpose**: Draw all visual elements to canvas

**Interface**:
```javascript
class CanvasRenderer {
  constructor(canvasElement)
  clear()                        // Clear canvas
  drawBackground()               // Draw backdrop
  drawEntity(entity)             // Draw game object
  drawUI(uiData)                 // Draw HUD
  drawPattern(pattern, x, y)     // Draw African pattern
  applyColorPalette(palette)     // Set color scheme
}
```

**Rendering Order**:
1. Background (gradient + patterns)
2. Falling items (water drops, pollutants)
3. Player basket
4. Particle effects
5. UI overlay (score, level, proverbs)

### 12. Pattern Library (PatternLibrary.js)

**Purpose**: Store and render African geometric patterns

**Interface**:
```javascript
class PatternLibrary {
  loadPatterns()                 // Initialize patterns
  getPattern(name)               // Retrieve pattern
  drawPattern(ctx, pattern, x, y, scale)
}
```

**Pattern Types**:
- Adinkra symbols (Ghana)
- Kente cloth patterns
- Mudcloth geometric designs
- Zulu beadwork motifs

**Color Palette**:
```javascript
{
  primary: '#8B4513',      // Saddle brown
  secondary: '#D2691E',    // Chocolate
  accent: '#FFD700',       // Gold
  earth: '#CD853F',        // Peru
  water: '#4682B4',        // Steel blue
  nature: '#228B22',       // Forest green
  warning: '#DC143C'       // Crimson
}
```

## Data Models

### Game State
```javascript
{
  status: 'menu' | 'playing' | 'paused' | 'gameOver',
  score: number,
  highScore: number,
  level: number,
  timeElapsed: number,
  entities: Entity[],
  settings: {
    musicVolume: number,
    sfxVolume: number,
    showTutorial: boolean
  }
}
```

### Entity Data
```javascript
{
  id: string,
  type: string,
  position: { x: number, y: number },
  velocity: { x: number, y: number },
  size: { width: number, height: number },
  active: boolean,
  sprite: {
    image: HTMLImageElement,
    frameIndex: number,
    animationSpeed: number
  }
}
```

### Educational Content
```javascript
{
  proverbs: [
    {
      text: "Water is life, protect it with care",
      origin: "Swahili proverb",
      displayScore: 50
    }
  ],
  facts: [
    {
      text: "783 million people lack access to clean water",
      category: "water_access",
      displayOnGameOver: true
    }
  ]
}
```

## Error Handling

### Input Validation
- Validate touch coordinates are within canvas bounds
- Prevent basket movement beyond screen edges
- Handle rapid touch inputs without lag

### Asset Loading
```javascript
try {
  await audioManager.loadAudio(audioFiles);
  await spriteManager.loadSprites(imageFiles);
} catch (error) {
  console.error('Asset loading failed:', error);
  showErrorScreen('Failed to load game assets');
}
```

### Performance Monitoring
- Track frame rate and warn if below 20 FPS
- Limit active entities to 50 maximum
- Implement object pooling for entities

### Graceful Degradation
- If Web Audio API unavailable, disable sound
- If canvas not supported, show compatibility message
- If LocalStorage fails, use in-memory storage

## Testing Strategy

### Unit Tests
- **Entity Classes**: Test movement, collision bounds, point values
- **Collision System**: Verify AABB algorithm accuracy
- **Score System**: Test point addition, deduction, high score persistence
- **Difficulty Manager**: Validate level scaling formulas

### Integration Tests
- **Spawner + Entity Manager**: Verify item creation and cleanup
- **Collision + Score**: Test point changes on collisions
- **Audio + Game Events**: Ensure sounds play on correct triggers

### Gameplay Tests
- **Balance Testing**: Verify difficulty curve feels fair
- **Performance Testing**: Maintain 30+ FPS on target devices
- **Accessibility Testing**: Ensure touch targets are adequate size
- **Cultural Review**: Validate African elements are authentic and respectful

### User Acceptance Testing
- **Target Audience**: Test with ages 8-14 for engagement
- **Educational Impact**: Survey players on learning outcomes
- **Cultural Sensitivity**: Review with African cultural consultants
- **Replayability**: Track session length and return rate

### Test Cases

**TC-001: Basic Gameplay**
- Start game → Basket appears at bottom center
- Tap left → Basket moves left smoothly
- Water drop falls → Collides with basket → Score increases by 10

**TC-002: Pollutant Avoidance**
- Pollutant falls → Collides with basket → Score decreases by 5
- Score cannot go below 0

**TC-003: Difficulty Progression**
- Reach 100 points → Level increases to 2
- Verify spawn rate decreases by 10%
- Verify fall speed increases by 15%

**TC-004: Audio Feedback**
- Collect water drop → Kalimba sound plays
- Collect pollutant → Discordant percussion plays
- Background music loops continuously

**TC-005: Game Over**
- Score reaches -50 → Game over screen appears
- Display final score and high score
- Offer replay and menu options

## Performance Optimization

### Rendering Optimization
- Use sprite sheets to reduce draw calls
- Implement dirty rectangle rendering
- Cache static background elements
- Limit particle effects to 20 simultaneous

### Memory Management
- Object pooling for entities (pre-allocate 50 objects)
- Remove off-screen entities immediately
- Compress audio files to reduce load time
- Use CSS sprites for UI elements

### Mobile Optimization
- Target 30 FPS minimum on 3-year-old devices
- Limit canvas resolution to 1280x720 max
- Use requestAnimationFrame for smooth rendering
- Implement touch event throttling (16ms minimum)

## Accessibility Considerations

- Touch targets minimum 44x44 pixels
- High contrast mode option
- Colorblind-friendly palette alternatives
- Optional visual indicators for audio cues
- Adjustable game speed setting

## Future Enhancements

1. **Multiplayer Mode**: Compete with friends for high scores
2. **Power-Ups**: Temporary shields, slow-motion, magnet
3. **Achievements**: Unlock badges for milestones
4. **Daily Challenges**: Special objectives for rewards
5. **Expanded Education**: Mini-lessons between levels
6. **Character Customization**: Unlock different basket designs
7. **Seasonal Events**: Special themes for holidays
8. **Leaderboards**: Global and regional rankings