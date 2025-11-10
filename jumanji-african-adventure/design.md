# Game Design Document: Jumanji: African Adventure

## Overview

Jumanji: African Adventure is a mobile board game that reimagines the classic Jumanji concept through an authentic African lens. Players embark on a journey from the savanna to a hidden village, rolling decorated dice to move along a winding path through diverse African landscapes. Random events featuring wildlife encounters, natural hazards, and cultural power-ups create unpredictable gameplay. The game combines nostalgia with educational content about African ecosystems, wildlife, and culture, targeting ages 10+ with 5-10 minute gameplay sessions.

### Core Pillars
1. **Cultural Celebration**: Authentic African aesthetics, landscapes, and storytelling
2. **Unpredictable Adventure**: Random events create unique experiences each playthrough
3. **Educational Value**: Learn about African wildlife, ecosystems, and geography
4. **Accessible Strategy**: Simple mechanics with meaningful decisions

## Architecture

### Technology Stack
- **Platform**: HTML5/JavaScript (cross-platform mobile via Cordova/Capacitor)
- **Rendering**: HTML5 Canvas API for 2D board and animations
- **Audio**: Web Audio API for music and sound effects
- **Storage**: LocalStorage for statistics and unlockables
- **Build Tools**: Webpack, Babel for ES6+ support

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
│  │  Board   │  │  Dice    │  │ Event  ││
│  │ Manager  │  │ System   │  │System  ││
│  └──────────┘  └──────────┘  └────────┘│
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Player   │  │PowerUp   │  │ Audio  ││
│  │ Manager  │  │ Manager  │  │Manager ││
│  └──────────┘  └──────────┘  └────────┘│
├─────────────────────────────────────────┤
│         Rendering & Assets              │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Canvas   │  │Landscape │  │ Sprite ││
│  │Renderer  │  │ Renderer │  │Manager ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

### File Structure
```
jumanji-african-adventure/
├── index.html
├── src/
│   ├── main.js                    # Entry point
│   ├── game/
│   │   ├── GameLoop.js            # Main game loop
│   │   ├── GameState.js           # State management
│   │   └── Config.js              # Game constants
│   ├── board/
│   │   ├── BoardManager.js        # Board logic
│   │   ├── Tile.js                # Individual tile
│   │   ├── Path.js                # Path generation
│   │   └── Landscape.js           # Terrain types
│   ├── systems/
│   │   ├── DiceSystem.js          # Dice rolling
│   │   ├── EventSystem.js         # Event triggering
│   │   ├── PlayerManager.js       # Player state
│   │   ├── PowerUpManager.js      # Power-up logic
│   │   └── AudioManager.js        # Sound/music
│   ├── events/
│   │   ├── WildlifeEvent.js       # Animal encounters
│   │   ├── HazardEvent.js         # Natural obstacles
│   │   └── PowerUpEvent.js        # Item collection
│   ├── rendering/
│   │   ├── CanvasRenderer.js      # Canvas drawing
│   │   ├── LandscapeRenderer.js   # Terrain visuals
│   │   ├── TileRenderer.js        # Tile drawing
│   │   └── AnimationManager.js    # Animations
│   ├── ui/
│   │   ├── UIManager.js           # UI controller
│   │   ├── MenuScreen.js          # Main menu
│   │   ├── GameScreen.js          # Gameplay UI
│   │   ├── EventPopup.js          # Event display
│   │   └── VictoryScreen.js       # Win/lose screens
│   └── utils/
│       ├── InputHandler.js        # Touch input
│       ├── StorageManager.js      # LocalStorage
│       └── RandomGenerator.js     # Seeded random
├── assets/
│   ├── audio/
│   │   ├── music/
│   │   │   ├── savanna_theme.mp3
│   │   │   ├── rainforest_theme.mp3
│   │   │   └── victory_theme.mp3
│   │   └── sfx/
│   │       ├── dice_roll.mp3
│   │       ├── animal_sounds/
│   │       └── hazard_sounds/
│   ├── images/
│   │   ├── board/
│   │   │   ├── tiles/
│   │   │   └── landscapes/
│   │   ├── characters/
│   │   ├── dice/
│   │   ├── wildlife/
│   │   └── powerups/
│   └── data/
│       ├── events.json            # Event definitions
│       ├── wildlife_facts.json    # Educational content
│       └── proverbs.json          # African wisdom
└── styles/
    └── game.css
```

## Components and Interfaces

### 1. Game Loop (GameLoop.js)

**Purpose**: Manages game state transitions and update cycles

**Interface**:
```javascript
class GameLoop {
  constructor(gameState, renderer, systems)
  start()                    // Begin game
  update(deltaTime)          // Update game state
  render()                   // Draw current frame
  pause()                    // Pause game
  resume()                   // Resume game
}
```

**State Machine**:
```
MENU → PLAYING → (PAUSED) → VICTORY/GAME_OVER → MENU
```

### 2. Board Manager (BoardManager.js)

**Purpose**: Generate and manage the game board

**Interface**:
```javascript
class BoardManager {
  constructor(config)
  generateBoard()            // Create board path
  getTile(index)             // Get tile by position
  getTotalTiles()            // Get board length
  getPathCoordinates()       // Get visual path data
  randomizeEventTiles()      // Shuffle event positions
}
```

**Board Generation Algorithm**:
```javascript
function generateBoard() {
  const tiles = [];
  const totalTiles = 30;
  const landscapes = ['savanna', 'rainforest', 'river', 'mountain'];
  
  for (let i = 0; i < totalTiles; i++) {
    const landscape = landscapes[Math.floor(i / 7.5)];
    const isEvent = Math.random() < 0.6; // 60% event tiles
    
    tiles.push(new Tile({
      index: i,
      landscape: landscape,
      isEvent: isEvent,
      coordinates: calculatePathPosition(i, totalTiles)
    }));
  }
  
  return tiles;
}
```

### 3. Tile (Tile.js)

**Purpose**: Represent individual board spaces

**Interface**:
```javascript
class Tile {
  constructor(properties)
  getIndex()                 // Tile position
  getLandscape()             // Terrain type
  isEventTile()              // Has event?
  getCoordinates()           // Visual position
  setEvent(event)            // Assign event
  getEvent()                 // Get assigned event
}
```

**Tile Data Structure**:
```javascript
{
  index: number,             // 0-29
  landscape: 'savanna' | 'rainforest' | 'river' | 'mountain',
  isEvent: boolean,
  isPowerUp: boolean,
  event: Event | null,
  coordinates: { x: number, y: number },
  visualStyle: {
    color: string,
    pattern: string,
    icon: string
  }
}
```

### 4. Dice System (DiceSystem.js)

**Purpose**: Handle dice rolling mechanics

**Interface**:
```javascript
class DiceSystem {
  constructor(audioManager)
  roll()                     // Roll dice (1-6)
  animateRoll(callback)      // Visual animation
  getCurrentValue()          // Get last roll
  isRolling()                // Check if animating
}
```

**Roll Animation**:
```javascript
function animateRoll(callback) {
  const duration = 1500; // 1.5 seconds
  const frames = 15;
  let currentFrame = 0;
  
  const interval = setInterval(() => {
    this.displayValue = Math.floor(Math.random() * 6) + 1;
    currentFrame++;
    
    if (currentFrame >= frames) {
      clearInterval(interval);
      this.finalValue = Math.floor(Math.random() * 6) + 1;
      callback(this.finalValue);
    }
  }, duration / frames);
  
  this.audioManager.playSFX('dice_roll');
}
```

### 5. Event System (EventSystem.js)

**Purpose**: Manage and trigger random events

**Interface**:
```javascript
class EventSystem {
  constructor(eventData)
  loadEvents(jsonData)       // Load event definitions
  triggerEvent(tile, player) // Execute event
  getRandomEvent(type)       // Get random event by type
  displayEventPopup(event)   // Show event UI
}
```

**Event Types**:
- Wildlife Events (40%)
- Hazard Events (40%)
- Power-Up Events (20%)

### 6. Wildlife Event (WildlifeEvent.js)

**Purpose**: Animal encounter events

**Interface**:
```javascript
class WildlifeEvent {
  constructor(data)
  execute(player)            // Apply event effect
  getDescription()           // Event text
  getAnimalFact()            // Educational content
  getAnimation()             // Visual animation
}
```

**Wildlife Event Examples**:
```javascript
{
  name: "Mischievous Monkeys",
  animal: "vervet_monkey",
  effect: { type: "moveBackward", amount: 2 },
  description: "Playful monkeys steal your supplies!",
  fact: "Vervet monkeys live in groups of up to 50 individuals",
  animation: "monkey_swing",
  sound: "monkey_chatter"
}

{
  name: "Blocking Hippos",
  animal: "hippopotamus",
  effect: { type: "skipTurn", amount: 1 },
  description: "A hippo blocks your path. Wait for it to move.",
  fact: "Hippos can hold their breath underwater for up to 5 minutes",
  animation: "hippo_block",
  sound: "hippo_grunt"
}

{
  name: "Helpful Elephants",
  animal: "african_elephant",
  effect: { type: "moveForward", amount: 3 },
  description: "Elephants guide you through the terrain!",
  fact: "African elephants are the largest land animals on Earth",
  animation: "elephant_walk",
  sound: "elephant_trumpet"
}
```

### 7. Hazard Event (HazardEvent.js)

**Purpose**: Natural obstacle events

**Interface**:
```javascript
class HazardEvent {
  constructor(data)
  execute(player)            // Apply hazard effect
  getDescription()           // Hazard text
  getAnimation()             // Visual effect
}
```

**Hazard Event Examples**:
```javascript
{
  name: "Quicksand Trap",
  effect: { type: "moveBackward", amount: 3 },
  description: "You sink into quicksand! Struggle back to safety.",
  animation: "quicksand_sink",
  sound: "mud_splash"
}

{
  name: "Falling Logs",
  effect: { type: "reduceDice", amount: 2 },
  description: "Falling logs slow your progress.",
  animation: "logs_fall",
  sound: "wood_crash"
}

{
  name: "River Crossing",
  effect: { type: "requireEvenRoll" },
  description: "Cross the river safely by rolling an even number.",
  animation: "river_flow",
  sound: "water_rush"
}
```

### 8. Power-Up Manager (PowerUpManager.js)

**Purpose**: Handle power-up collection and usage

**Interface**:
```javascript
class PowerUpManager {
  constructor()
  addPowerUp(type)           // Add to inventory
  usePowerUp(type, player)   // Activate power-up
  hasPowerUp(type)           // Check availability
  getInventory()             // Get all power-ups
  clearInventory()           // Remove all
}
```

**Power-Up Types**:
```javascript
{
  magicDrum: {
    name: "Magic Drum",
    description: "Reroll the dice once",
    icon: "drum_icon",
    effect: (player, diceSystem) => {
      diceSystem.roll();
    }
  },
  
  shield: {
    name: "Protective Shield",
    description: "Negate the next negative event",
    icon: "shield_icon",
    effect: (player) => {
      player.setShieldActive(true);
    }
  },
  
  vineSwing: {
    name: "Vine Swing",
    description: "Swing forward 5 tiles",
    icon: "vine_icon",
    effect: (player) => {
      player.moveForward(5);
    }
  }
}
```

### 9. Player Manager (PlayerManager.js)

**Purpose**: Track player state and position

**Interface**:
```javascript
class PlayerManager {
  constructor(startPosition)
  moveForward(spaces)        // Move ahead
  moveBackward(spaces)       // Move back
  getCurrentPosition()       // Get tile index
  skipTurn()                 // Miss next turn
  setShieldActive(active)    // Shield status
  hasShield()                // Check shield
  getTotalMoves()            // Move count
  getPlayTime()              // Session duration
}
```

**Player State**:
```javascript
{
  position: number,          // Current tile (0-29)
  powerUps: string[],        // Collected power-ups
  shieldActive: boolean,     // Protected from events
  turnSkipped: boolean,      // Must skip next turn
  totalMoves: number,        // Dice rolls made
  playTime: number,          // Seconds elapsed
  eventsEncountered: Event[] // History
}
```

### 10. Canvas Renderer (CanvasRenderer.js)

**Purpose**: Draw all visual elements

**Interface**:
```javascript
class CanvasRenderer {
  constructor(canvasElement)
  clear()                    // Clear canvas
  drawBoard(board)           // Draw path and tiles
  drawPlayer(player)         // Draw player piece
  drawDice(value, animating) // Draw dice
  drawUI(uiData)             // Draw HUD
  drawEventPopup(event)      // Draw event overlay
}
```

**Rendering Layers**:
1. Background landscape
2. Board path and tiles
3. Player piece
4. Dice
5. Power-up inventory
6. Event popup overlay
7. UI elements (turn counter, position)

### 11. Landscape Renderer (LandscapeRenderer.js)

**Purpose**: Draw terrain-specific visuals

**Interface**:
```javascript
class LandscapeRenderer {
  constructor()
  drawSavanna(ctx, bounds)   // Golden grass, acacias
  drawRainforest(ctx, bounds)// Dense foliage
  drawRiver(ctx, bounds)     // Flowing water
  drawMountain(ctx, bounds)  // Rocky peaks
}
```

**Landscape Visual Styles**:
```javascript
{
  savanna: {
    backgroundColor: '#F4A460', // Sandy brown
    accentColor: '#DAA520',     // Goldenrod
    patterns: ['grass_tufts', 'acacia_trees'],
    ambientSound: 'savanna_wind'
  },
  
  rainforest: {
    backgroundColor: '#228B22', // Forest green
    accentColor: '#006400',     // Dark green
    patterns: ['dense_leaves', 'vines'],
    ambientSound: 'jungle_birds'
  },
  
  river: {
    backgroundColor: '#4682B4', // Steel blue
    accentColor: '#1E90FF',     // Dodger blue
    patterns: ['water_ripples', 'reeds'],
    ambientSound: 'flowing_water'
  },
  
  mountain: {
    backgroundColor: '#696969', // Dim gray
    accentColor: '#A9A9A9',     // Dark gray
    patterns: ['rock_formations', 'sparse_trees'],
    ambientSound: 'mountain_wind'
  }
}
```

### 12. Audio Manager (AudioManager.js)

**Purpose**: Manage music and sound effects

**Interface**:
```javascript
class AudioManager {
  constructor()
  loadAudio(audioFiles)      // Preload sounds
  playMusic(track, loop)     // Background music
  playSFX(soundName)         // Sound effect
  playAnimalSound(animal)    // Wildlife sounds
  setMusicVolume(volume)     // 0.0 - 1.0
  setSFXVolume(volume)       // 0.0 - 1.0
  crossfade(fromTrack, toTrack, duration)
}
```

**Audio Assets**:
- **Music Tracks**:
  - Savanna: Djembe and kora melody
  - Rainforest: Dense percussion with flutes
  - River: Flowing rhythms with kalimba
  - Mountain: Sparse, echoing drums
  - Victory: Celebratory full ensemble

- **Sound Effects**:
  - Dice roll: Drum percussion
  - Move piece: Footstep sounds
  - Event trigger: Suspenseful note
  - Power-up collect: Chime sound
  - Victory: Triumphant horns

- **Animal Sounds**:
  - Monkey: Chattering
  - Hippo: Deep grunt
  - Elephant: Trumpet call
  - Lion: Distant roar
  - Birds: Tropical calls

## Data Models

### Game State
```javascript
{
  status: 'menu' | 'playing' | 'paused' | 'victory' | 'gameOver',
  board: Tile[],
  player: PlayerState,
  dice: {
    currentValue: number,
    isRolling: boolean
  },
  turn: number,
  startTime: number,
  settings: {
    musicVolume: number,
    sfxVolume: number,
    showTutorial: boolean
  },
  statistics: {
    gamesPlayed: number,
    wins: number,
    losses: number,
    bestTime: number,
    totalPlayTime: number
  }
}
```

### Event Data Structure
```javascript
{
  id: string,
  type: 'wildlife' | 'hazard' | 'powerup',
  name: string,
  description: string,
  effect: {
    type: 'moveForward' | 'moveBackward' | 'skipTurn' | 'reduceDice' | 'requireEvenRoll',
    amount: number
  },
  visual: {
    animation: string,
    icon: string,
    color: string
  },
  audio: {
    sound: string,
    music: string | null
  },
  educational: {
    fact: string,
    category: string
  }
}
```

### Board Configuration
```javascript
{
  totalTiles: 30,
  startTile: 0,
  finishTile: 29,
  eventTilePercentage: 0.6,
  powerUpTilePercentage: 0.15,
  landscapeDistribution: {
    savanna: [0, 7],
    rainforest: [8, 14],
    river: [15, 21],
    mountain: [22, 29]
  },
  pathShape: 'winding' | 'spiral' | 'zigzag'
}
```

## Error Handling

### Input Validation
- Prevent dice roll during animation
- Validate power-up usage conditions
- Handle rapid tap inputs gracefully

### Asset Loading
```javascript
async function loadGameAssets() {
  try {
    await Promise.all([
      audioManager.loadAudio(audioFiles),
      spriteManager.loadSprites(imageFiles),
      dataManager.loadJSON(dataFiles)
    ]);
  } catch (error) {
    console.error('Asset loading failed:', error);
    showErrorScreen('Failed to load game. Please refresh.');
  }
}
```

### Game State Recovery
- Auto-save game state every turn
- Restore from LocalStorage on crash
- Validate saved state before loading

### Performance Monitoring
- Track frame rate and warn if below 25 FPS
- Limit simultaneous animations to 3
- Implement asset lazy loading

## Testing Strategy

### Unit Tests
- **Dice System**: Verify random distribution (1-6)
- **Board Manager**: Test path generation consistency
- **Event System**: Validate effect application
- **Player Manager**: Test position updates and boundaries

### Integration Tests
- **Dice + Player**: Roll dice → Move player → Update position
- **Event + Player**: Trigger event → Apply effect → Verify state
- **Power-Up + Event**: Use shield → Trigger negative event → Negate effect

### Gameplay Tests
- **Win Condition**: Reach tile 29 → Victory screen appears
- **Lose Condition**: Move past tile 0 → Game over screen appears
- **Event Variety**: Play 10 games → Encounter diverse events
- **Balance**: Average completion time 5-10 minutes

### Cultural Authenticity Tests
- **Visual Review**: Validate African patterns and colors
- **Audio Review**: Ensure authentic instrument sounds
- **Content Review**: Verify wildlife facts accuracy
- **Sensitivity Review**: Check for cultural appropriation

### Test Cases

**TC-001: Basic Gameplay Flow**
- Start game → Board generates with 30 tiles
- Tap dice → Roll animation plays → Value displayed
- Player piece moves forward by rolled amount
- Land on event tile → Event popup appears

**TC-002: Wildlife Event**
- Land on monkey event tile
- Event description displays with monkey illustration
- Player moves backward 2 tiles
- Educational fact about monkeys appears

**TC-003: Power-Up Collection and Usage**
- Land on power-up tile → Vine swing added to inventory
- Tap vine swing icon → Player moves forward 5 tiles
- Power-up removed from inventory

**TC-004: Victory Condition**
- Player on tile 27 → Roll 3 or higher
- Player reaches tile 29 (hidden village)
- Victory screen displays with stats
- Victory music plays

**TC-005: Landscape Transitions**
- Player moves from savanna (tile 7) to rainforest (tile 8)
- Background visuals change to rainforest theme
- Music crossfades to rainforest track
- Tile patterns update to match terrain

## Performance Optimization

### Rendering Optimization
- Pre-render static board elements to off-screen canvas
- Use sprite sheets for tiles and characters
- Implement viewport culling (only draw visible area)
- Cache landscape backgrounds

### Memory Management
- Limit event history to last 10 events
- Unload unused audio tracks
- Compress images to WebP format
- Use object pooling for animations

### Mobile Optimization
- Target 30 FPS on 3-year-old devices
- Limit canvas resolution to 1920x1080 max
- Implement touch event debouncing (100ms)
- Lazy load landscape assets

### Load Time Optimization
- Show loading screen with progress bar
- Load critical assets first (board, dice, player)
- Defer non-critical assets (some events, sounds)
- Compress audio to 128kbps MP3

## Accessibility Considerations

- Touch targets minimum 48x48 pixels
- High contrast mode for visuals
- Text-to-speech option for event descriptions
- Colorblind-friendly palette alternatives
- Adjustable text size
- Optional reduced motion mode

## Future Enhancements

1. **Multiplayer Mode**: 2-4 players take turns on same board
2. **Character Selection**: Choose from different African characters
3. **Custom Boards**: Unlock new paths and landscapes
4. **Achievement System**: Badges for milestones
5. **Story Mode**: Narrative-driven campaign
6. **Daily Challenges**: Special objectives for rewards
7. **Expanded Wildlife**: More animal encounters and facts
8. **Mini-Games**: Event-triggered skill challenges
9. **Leaderboards**: Fastest completion times
10. **Eco-Missions**: Real-world conservation tie-ins

## Educational Content Integration

### Wildlife Facts Database
```javascript
{
  "african_elephant": {
    "fact": "African elephants are the largest land animals, weighing up to 6,000 kg",
    "conservation": "Vulnerable - threatened by poaching and habitat loss",
    "habitat": "Savanna, forest, and desert regions across Africa"
  },
  "vervet_monkey": {
    "fact": "Vervet monkeys have distinct alarm calls for different predators",
    "conservation": "Least Concern - adaptable to various habitats",
    "habitat": "Savanna woodlands and riverine forests"
  }
  // ... 20+ more species
}
```

### Ecosystem Information
- Savanna: Grassland ecosystem, seasonal rainfall, diverse herbivores
- Rainforest: Dense canopy, high biodiversity, carbon storage
- River: Freshwater ecosystem, supports agriculture and wildlife
- Mountain: Alpine zones, unique flora, water sources

### African Proverbs
- "Smooth seas do not make skillful sailors" - African proverb
- "If you want to go fast, go alone. If you want to go far, go together" - African proverb
- "The best time to plant a tree was 20 years ago. The second best time is now" - African proverb

## Monetization Strategy (Optional)

- **Free Version**: Full game with occasional ads
- **Premium Version**: $2.99 - Ad-free, exclusive characters
- **In-App Purchases**: Character skins, board themes
- **Educational Pack**: $1.99 - Expanded wildlife facts and mini-lessons
