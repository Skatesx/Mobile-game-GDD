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
- **Rendering**: Three.js (WebGL) for hardware-accelerated 3D graphics in 2D perspective
- **Audio**: Web Audio API for sound effects and music
- **Storage**: LocalStorage for high scores and settings
- **Build Tools**: Vite for fast bundling and development, Babel for transpilation
- **Mobile Optimization**: Progressive Web App (PWA) capabilities, service workers for offline support

### System Architecture

```
┌─────────────────────────────────────────┐
│         Game Application Layer          │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Game    │  │  Touch   │  │  UI    ││
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
│      Three.js Rendering Layer           │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Three.js │  │ Texture  │  │Pattern ││
│  │Renderer  │  │ Manager  │  │Library ││
│  └──────────┘  └──────────┘  └────────┘│
│  ┌──────────┐  ┌──────────┐            │
│  │  Scene   │  │ Camera   │            │
│  │ Manager  │  │Controller│            │
│  └──────────┘  └──────────┘            │
├─────────────────────────────────────────┤
│      Mobile Optimization Layer          │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │Performance│ │ Battery  │  │ Asset  ││
│  │ Monitor  │  │ Manager  │  │ Loader ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

### File Structure
```
eco-warriors/
├── index.html
├── vite.config.js              # Vite build configuration
├── manifest.json               # PWA manifest
├── service-worker.js           # Offline support
├── src/
│   ├── main.js                 # Entry point
│   ├── game/
│   │   ├── GameLoop.js         # Main game loop
│   │   ├── GameState.js        # State management
│   │   └── Config.js           # Game constants
│   ├── entities/
│   │   ├── Basket.js           # Player basket (Three.js mesh)
│   │   ├── WaterDrop.js        # Clean water drops (Three.js sprite)
│   │   └── Pollutant.js        # Trash/oil/plastic (Three.js sprite)
│   ├── systems/
│   │   ├── EntityManager.js    # Entity lifecycle
│   │   ├── CollisionSystem.js  # Collision detection
│   │   ├── SpawnerSystem.js    # Item spawning
│   │   ├── ScoreSystem.js      # Score tracking
│   │   ├── DifficultyManager.js# Difficulty scaling
│   │   └── AudioManager.js     # Sound/music
│   ├── rendering/
│   │   ├── ThreeRenderer.js    # Three.js WebGL renderer
│   │   ├── SceneManager.js     # Three.js scene setup
│   │   ├── CameraController.js # Orthographic camera
│   │   ├── TextureManager.js   # Texture loading/caching
│   │   └── PatternLibrary.js   # African patterns (Three.js materials)
│   ├── mobile/
│   │   ├── PerformanceMonitor.js # FPS tracking, thermal monitoring
│   │   ├── BatteryManager.js   # Battery-aware optimizations
│   │   ├── TouchHandler.js     # Mobile touch input
│   │   └── DeviceDetector.js   # Device capabilities detection
│   ├── ui/
│   │   ├── UIManager.js        # UI controller (HTML overlay)
│   │   ├── MenuScreen.js       # Main menu
│   │   ├── GameScreen.js       # Gameplay UI (HUD)
│   │   └── GameOverScreen.js   # End screen
│   └── utils/
│       ├── AssetLoader.js      # Progressive asset loading
│       ├── StorageManager.js   # LocalStorage
│       └── ObjectPool.js       # Object pooling for entities
├── assets/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── textures/
│   │   ├── sprites/            # PNG textures (512x512 max)
│   │   ├── patterns/           # African pattern textures
│   │   └── atlas.png           # Texture atlas
│   ├── models/                 # Optional GLB/GLTF models
│   │   └── basket.glb          # 3D basket model (< 500 triangles)
│   └── data/
│       ├── proverbs.json       # African wisdom
│       └── educational.json    # Eco facts
└── styles/
    └── game.css                # UI overlay styles
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

**Purpose**: Player-controlled collection basket (Three.js Mesh)

**Interface**:
```javascript
class Basket extends Entity {
  constructor(x, y, textureManager)
  mesh: THREE.Mesh              // Three.js mesh object
  moveLeft(speed)               // Move basket left
  moveRight(speed)              // Move basket right
  stopMovement()                // Halt movement
  getBounds()                   // Get collision box
  playCollectAnimation()        // Visual feedback (scale tween)
  updatePosition(deltaTime)     // Update mesh position
}
```

**Three.js Implementation**:
```javascript
// Create basket mesh
const geometry = new THREE.PlaneGeometry(0.8, 0.6);
const texture = textureManager.getTexture('basket');
const material = new THREE.MeshBasicMaterial({ 
  map: texture, 
  transparent: true 
});
this.mesh = new THREE.Mesh(geometry, material);
```

**Properties**:
- Position: Bottom center of screen (world coords)
- Size: 0.8 x 0.6 world units (80x60 pixels equivalent)
- Movement speed: 3.0 world units/second
- Texture: Traditional African gourd/basket design (PNG with alpha)

### 4. Water Drop (WaterDrop.js)

**Purpose**: Collectible clean water drops (Three.js Sprite)

**Interface**:
```javascript
class WaterDrop extends Entity {
  constructor(x, y, speed, textureManager)
  sprite: THREE.Sprite          // Three.js sprite object
  update(deltaTime)             // Update position
  getBounds()                   // Get collision box
  getPointValue()               // Return 10 points
  reset(x, y, speed)            // Reset for object pooling
}
```

**Three.js Implementation**:
```javascript
// Create water drop sprite
const texture = textureManager.getTexture('waterDrop');
const material = new THREE.SpriteMaterial({ 
  map: texture, 
  transparent: true 
});
this.sprite = new THREE.Sprite(material);
this.sprite.scale.set(0.3, 0.4, 1);
```

**Properties**:
- Size: 0.3 x 0.4 world units (30x40 pixels equivalent)
- Fall speed: 1.5-4.0 world units/second (difficulty-based)
- Texture: Blue-green water droplet with shine (PNG with alpha)
- Point value: +10
- Pooled: Reused from object pool for performance

### 5. Pollutant (Pollutant.js)

**Purpose**: Hazardous items to avoid (Three.js Sprite)

**Interface**:
```javascript
class Pollutant extends Entity {
  constructor(x, y, speed, subtype, textureManager)
  sprite: THREE.Sprite          // Three.js sprite object
  update(deltaTime)             // Update position
  getBounds()                   // Get collision box
  getPointPenalty()             // Return -5 points
  getSubtype()                  // 'trash' | 'oil' | 'plastic'
  reset(x, y, speed, subtype)   // Reset for object pooling
}
```

**Three.js Implementation**:
```javascript
// Create pollutant sprite
const textureName = `pollutant_${subtype}`;
const texture = textureManager.getTexture(textureName);
const material = new THREE.SpriteMaterial({ 
  map: texture, 
  transparent: true 
});
this.sprite = new THREE.Sprite(material);
this.sprite.scale.set(0.35, 0.35, 1);
```

**Properties**:
- Size: 0.35 x 0.35 world units (35x35 pixels equivalent)
- Fall speed: 1.5-4.0 world units/second
- Subtypes: Trash bag, oil barrel, plastic bottle (3 textures)
- Point penalty: -5
- Pooled: Reused from object pool for performance

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

### 11. Three.js Renderer (ThreeRenderer.js)

**Purpose**: Manage Three.js WebGL rendering pipeline for mobile devices

**Interface**:
```javascript
class ThreeRenderer {
  constructor(container)
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  renderer: THREE.WebGLRenderer
  init()                         // Initialize Three.js
  setupCamera()                  // Configure orthographic camera
  setupLighting()                // Add ambient/directional lights
  createSprite(texture)          // Create THREE.Sprite
  createMesh(geometry, material) // Create THREE.Mesh
  updateEntities(entities)       // Update entity positions
  render()                       // Render frame
  resize()                       // Handle window resize
  dispose()                      // Cleanup resources
}
```

**Three.js Configuration**:
```javascript
{
  antialias: false,              // Disabled for mobile performance
  powerPreference: 'low-power',  // Battery optimization
  alpha: false,                  // Opaque background
  stencil: false,                // Not needed
  depth: true,                   // Enable depth testing
  pixelRatio: Math.min(window.devicePixelRatio, 2) // Cap at 2x
}
```

**Rendering Order**:
1. Background plane (gradient texture + patterns)
2. Falling items (THREE.Sprite instances)
3. Player basket (THREE.Mesh with texture)
4. Particle system (THREE.Points)
5. HTML UI overlay (positioned above canvas)

### 12. Pattern Library (PatternLibrary.js)

**Purpose**: Store and render African geometric patterns as Three.js materials

**Interface**:
```javascript
class PatternLibrary {
  loadPatterns()                 // Initialize pattern textures
  getPattern(name)               // Retrieve pattern material
  createPatternMaterial(texture) // Create THREE.MeshBasicMaterial
  applyPatternToMesh(mesh, pattern) // Apply pattern to geometry
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

### 13. Scene Manager (SceneManager.js)

**Purpose**: Manage Three.js scene setup and background elements

**Interface**:
```javascript
class SceneManager {
  constructor(scene)
  setupBackground()              // Create background plane
  setupLighting()                // Add lights to scene
  addEntity(entity)              // Add entity to scene
  removeEntity(entity)           // Remove entity from scene
  updateBackground(level)        // Change background based on level
}
```

**Scene Configuration**:
- Orthographic camera for 2D-style gameplay
- Ambient light for overall illumination
- Directional light for subtle depth
- Background plane with gradient texture

### 14. Camera Controller (CameraController.js)

**Purpose**: Manage orthographic camera for 2D perspective in 3D space

**Interface**:
```javascript
class CameraController {
  constructor(aspect)
  camera: THREE.OrthographicCamera
  setupCamera()                  // Initialize camera bounds
  updateAspect(width, height)    // Handle screen resize
  screenToWorld(x, y)            // Convert screen to world coords
}
```

**Camera Setup**:
```javascript
// Orthographic camera for 2D gameplay
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;
camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,
  frustumSize * aspect / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  1000
);
camera.position.z = 10;
```

### 15. Texture Manager (TextureManager.js)

**Purpose**: Load, cache, and manage textures for mobile optimization

**Interface**:
```javascript
class TextureManager {
  constructor()
  loadTexture(path)              // Load single texture
  loadTextureAtlas(path, data)   // Load texture atlas
  getTexture(name)               // Retrieve cached texture
  preloadTextures(paths)         // Batch load textures
  disposeTexture(name)           // Free texture memory
}
```

**Mobile Optimization**:
- Use texture atlases to reduce draw calls
- Compress textures (max 512x512px)
- Enable mipmapping for distant objects
- Lazy load non-critical textures

### 16. Performance Monitor (PerformanceMonitor.js)

**Purpose**: Track performance metrics and adjust quality for mobile devices

**Interface**:
```javascript
class PerformanceMonitor {
  constructor()
  trackFPS()                     // Monitor frame rate
  trackMemory()                  // Monitor memory usage
  detectThermalThrottling()      // Detect device heating
  adjustQuality(level)           // Change quality settings
  getRecommendedSettings()       // Get optimal settings
}
```

**Quality Levels**:
```javascript
{
  high: {
    pixelRatio: 2,
    particleCount: 20,
    shadowsEnabled: false,
    antialiasing: false
  },
  medium: {
    pixelRatio: 1.5,
    particleCount: 10,
    shadowsEnabled: false,
    antialiasing: false
  },
  low: {
    pixelRatio: 1,
    particleCount: 5,
    shadowsEnabled: false,
    antialiasing: false
  }
}
```

### 17. Battery Manager (BatteryManager.js)

**Purpose**: Optimize performance based on battery level and charging status

**Interface**:
```javascript
class BatteryManager {
  constructor()
  getBatteryLevel()              // Get current battery %
  isCharging()                   // Check if device charging
  enablePowerSaving()            // Reduce performance
  disablePowerSaving()           // Restore performance
  onBatteryChange(callback)      // Listen to battery events
}
```

**Power Saving Mode**:
- Reduce target FPS from 60 to 30
- Lower pixel ratio to 1
- Reduce particle effects
- Disable non-essential animations

### 18. Touch Handler (TouchHandler.js)

**Purpose**: Handle mobile touch input with gesture support

**Interface**:
```javascript
class TouchHandler {
  constructor(element)
  onTouchStart(callback)         // Touch begin
  onTouchMove(callback)          // Touch drag
  onTouchEnd(callback)           // Touch release
  getTouchPosition()             // Get current touch coords
  enableHapticFeedback()         // Vibration feedback
}
```

**Touch Features**:
- Support for single touch drag
- Touch position smoothing
- Haptic feedback on collisions
- Prevent default scrolling behavior

### 19. Asset Loader (AssetLoader.js)

**Purpose**: Progressive loading of game assets with priority system

**Interface**:
```javascript
class AssetLoader {
  constructor()
  loadCriticalAssets()           // Load essential assets first
  loadSecondaryAssets()          // Load nice-to-have assets
  getLoadProgress()              // Return 0-100%
  onLoadComplete(callback)       // Callback when done
}
```

**Loading Priority**:
1. Critical: Basket texture, water drop, basic UI
2. High: Pollutant textures, background patterns
3. Medium: Audio files, particle textures
4. Low: Educational content, proverbs

### 20. Object Pool (ObjectPool.js)

**Purpose**: Reuse Three.js objects to reduce garbage collection

**Interface**:
```javascript
class ObjectPool {
  constructor(factory, initialSize)
  acquire()                      // Get object from pool
  release(object)                // Return object to pool
  expand(count)                  // Add more objects
  clear()                        // Remove all objects
}
```

**Pooled Objects**:
- Water drop sprites (pool size: 30)
- Pollutant sprites (pool size: 20)
- Particle systems (pool size: 10)

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

### Three.js Rendering Optimization
- Use texture atlases to batch draw calls (< 50 per frame)
- Disable antialiasing for mobile performance
- Set `powerPreference: 'low-power'` in WebGLRenderer
- Cap pixel ratio at 2x maximum
- Use `THREE.Sprite` for 2D objects (more efficient than meshes)
- Implement frustum culling for off-screen objects
- Limit particle effects to 20 simultaneous
- Use `THREE.BufferGeometry` for all geometries

### Memory Management
- Object pooling for sprites (pre-allocate 50 objects)
- Dispose geometries and materials when not needed
- Remove off-screen entities immediately
- Compress textures to 512x512px maximum
- Use texture atlases to reduce memory footprint
- Implement lazy loading for non-critical assets
- Monitor memory usage and trigger cleanup at 120MB

### Mobile-First Optimization
- Target 30 FPS on devices from past 5 years
- Adaptive quality based on device performance
- Battery-aware rendering (reduce FPS when low battery)
- Thermal throttling detection and response
- Touch event throttling (16ms minimum)
- Progressive asset loading (critical assets first)
- Service worker caching for offline play
- Responsive canvas sizing with safe area support

### Network Optimization
- Compress audio files (MP3 at 128kbps)
- Use WebP for textures where supported
- Implement asset preloading with progress indicator
- Cache assets in IndexedDB for repeat sessions
- Lazy load educational content and proverbs

## Accessibility Considerations

### Mobile Accessibility
- Touch targets minimum 44x44 pixels (iOS/Android guidelines)
- Support for one-handed play (portrait orientation)
- Haptic feedback for collisions (optional)
- Safe area insets for notched devices
- Support for reduced motion preferences

### Visual Accessibility
- High contrast mode option
- Colorblind-friendly palette alternatives
- Adjustable text size for educational content
- Optional visual indicators for audio cues
- Clear visual feedback for all interactions

### Performance Accessibility
- Adjustable game speed setting
- Battery saver mode
- Reduced effects mode for older devices
- Offline play support via PWA

## Mobile-First Design Principles

### Screen Orientation
- **Primary**: Portrait mode (9:16 aspect ratio)
- **Secondary**: Landscape support (optional)
- Responsive layout adapts to all screen sizes (320px - 1024px width)

### Touch Interaction Design
- **Single Touch**: Drag left/right to move basket
- **Tap**: Pause game, menu navigation
- **Swipe**: Quick basket movement
- **No multi-touch required**: Accessible for all users

### Device Support Matrix
```javascript
{
  minimum: {
    os: 'iOS 12+ / Android 8+',
    ram: '2GB',
    gpu: 'Any with WebGL support',
    screen: '320x568px (iPhone SE)'
  },
  recommended: {
    os: 'iOS 14+ / Android 10+',
    ram: '4GB',
    gpu: 'Adreno 506+ / Mali-G71+',
    screen: '375x667px (iPhone 8)'
  }
}
```

### Progressive Web App (PWA) Features
- **Installable**: Add to home screen
- **Offline Play**: Service worker caching
- **Fast Loading**: < 3 second initial load
- **App-like Experience**: Fullscreen mode, no browser chrome
- **Push Notifications**: Daily challenge reminders (optional)

### Network Resilience
- Graceful degradation on slow connections
- Offline mode with cached assets
- Progressive loading with visual feedback
- Retry logic for failed asset loads

### Thermal Management
- Monitor device temperature via performance metrics
- Reduce quality when thermal throttling detected
- Pause game with warning if device overheating
- Resume normal quality when temperature normalizes

## Future Enhancements

1. **Multiplayer Mode**: Compete with friends for high scores
2. **Power-Ups**: Temporary shields, slow-motion, magnet
3. **Achievements**: Unlock badges for milestones
4. **Daily Challenges**: Special objectives for rewards
5. **Expanded Education**: Mini-lessons between levels
6. **Character Customization**: Unlock different basket designs
7. **Seasonal Events**: Special themes for holidays
8. **Leaderboards**: Global and regional rankings
9. **Social Sharing**: Share scores on social media
10. **AR Mode**: Use device camera for augmented reality gameplay
