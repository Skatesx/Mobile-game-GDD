# Implementation Plan: Eco-Warriors (Three.js Mobile-First)

- [x] 1. Set up project structure and Three.js foundation



  - Create project directory structure with Vite build system
  - Install Three.js and mobile optimization dependencies
  - Set up PWA manifest and service worker configuration
  - Create responsive HTML container with viewport meta tags
  - Configure Vite for mobile-optimized builds
  - _Requirements: 10.1, 10.2, 10.4_



- [ ] 2. Implement Three.js rendering system
  - [ ] 2.1 Create ThreeRenderer class with mobile optimizations
    - Initialize WebGLRenderer with low-power settings
    - Configure pixel ratio capping (max 2x)


    - Disable antialiasing for performance
    - Set up transparent background handling
    - _Requirements: 10.1_

  - [x] 2.2 Implement SceneManager for Three.js scene setup



    - Create THREE.Scene instance
    - Add ambient and directional lighting
    - Create background plane with gradient texture
    - Implement scene entity management (add/remove)
    - _Requirements: 10.1_



  - [ ] 2.3 Create CameraController with orthographic camera
    - Set up THREE.OrthographicCamera for 2D perspective
    - Implement responsive aspect ratio handling
    - Add screenToWorld coordinate conversion



    - Handle window resize events
    - _Requirements: 10.1_

- [ ] 3. Implement mobile-first input system
  - [x] 3.1 Create TouchHandler for mobile input


    - Implement touch event listeners (start, move, end)
    - Add touch position smoothing
    - Prevent default scrolling behavior
    - Add haptic feedback support (vibration API)
    - _Requirements: 1.1, 1.2, 10.5_



  - [ ] 3.2 Implement basket movement controls
    - Map touch drag to basket horizontal movement
    - Add boundary constraints for basket position



    - Implement smooth movement interpolation
    - Add touch release handling (stop movement)
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 4. Create texture management system

  - [ ] 4.1 Implement TextureManager class
    - Create texture loading with THREE.TextureLoader
    - Implement texture caching system
    - Add texture atlas support
    - Enable mipmapping for textures
    - _Requirements: 10.2_



  - [ ] 4.2 Create texture atlas for sprites
    - Combine water drop, pollutants, and UI textures
    - Compress textures to 512x512px maximum
    - Generate texture coordinates for atlas regions


    - _Requirements: 10.1_

  - [ ] 4.3 Implement AssetLoader with progressive loading
    - Create priority-based loading system (critical first)
    - Add loading progress tracking (0-100%)



    - Implement retry logic for failed loads
    - Show loading screen with progress indicator
    - _Requirements: 10.2_

- [x] 5. Implement game entities with Three.js


  - [ ] 5.1 Create Basket entity with THREE.Mesh
    - Create PlaneGeometry for basket
    - Apply basket texture with transparency
    - Implement movement methods (moveLeft, moveRight)



    - Add collection animation (scale tween)
    - _Requirements: 1.3, 5.1_

  - [x] 5.2 Create WaterDrop entity with THREE.Sprite


    - Create sprite with water drop texture
    - Implement falling physics (velocity-based)
    - Add getBounds() for collision detection
    - Implement reset() for object pooling
    - _Requirements: 2.1, 2.4, 3.1_



  - [ ] 5.3 Create Pollutant entity with THREE.Sprite
    - Create sprite with pollutant textures (3 types)
    - Implement falling physics
    - Add subtype handling (trash, oil, plastic)


    - Implement reset() for object pooling
    - _Requirements: 2.1, 2.4, 3.2_

  - [ ] 5.4 Implement EntityManager for lifecycle
    - Create entity creation and destruction methods
    - Add entity type querying (getEntitiesByType)
    - Implement updateAll() for entity updates
    - Add entity cleanup for off-screen objects
    - _Requirements: 2.5_

- [ ] 6. Create object pooling system
  - [ ] 6.1 Implement ObjectPool utility class
    - Create generic pool with factory pattern
    - Implement acquire() and release() methods
    - Add pool expansion capability
    - _Requirements: 10.3_

  - [ ] 6.2 Set up entity pools
    - Create water drop pool (size: 30)
    - Create pollutant pool (size: 20)
    - Create particle pool (size: 10)
    - _Requirements: 10.3_

- [ ] 7. Implement spawning and difficulty systems
  - [ ] 7.1 Create SpawnerSystem for item generation
    - Implement spawn timing with intervals (0.5-2s)
    - Add 70/30 probability for drops vs pollutants
    - Generate random horizontal spawn positions
    - Integrate with object pools
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ] 7.2 Implement DifficultyManager
    - Track difficulty level (1-10)
    - Implement level-up at 100-point intervals
    - Calculate spawn rate scaling (-10% per level)
    - Calculate fall speed scaling (+15% per level)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 7.3 Add difficulty visual feedback
    - Display level-up notification
    - Show transition effect with African patterns
    - Update background based on difficulty level
    - _Requirements: 4.5, 7.5_

- [ ] 8. Implement collision and scoring systems
  - [ ] 8.1 Create CollisionSystem with AABB detection
    - Implement isColliding() using AABB algorithm
    - Check collisions between basket and falling items
    - Handle collision callbacks
    - _Requirements: 3.1, 3.2_

  - [ ] 8.2 Implement ScoreSystem
    - Add points for water drops (+10)
    - Deduct points for pollutants (-5)
    - Enforce minimum score of 0
    - Track and persist high score
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 8.3 Add collision visual feedback
    - Create particle system for sparkle effect (water)
    - Create particle system for splash effect (pollutant)
    - Animate basket bounce on collection
    - Display score change animation
    - _Requirements: 3.5, 7.1, 7.2, 7.4_

- [ ] 9. Implement mobile performance optimization
  - [ ] 9.1 Create PerformanceMonitor class
    - Track FPS in real-time
    - Monitor memory usage
    - Detect thermal throttling via performance degradation
    - Implement quality adjustment based on metrics
    - _Requirements: 10.1_

  - [ ] 9.2 Implement BatteryManager
    - Access Battery Status API
    - Monitor battery level and charging status
    - Enable power-saving mode when battery low
    - Reduce FPS and effects in power-saving mode
    - _Requirements: 10.1_

  - [ ] 9.3 Add adaptive quality system
    - Define quality presets (high, medium, low)
    - Adjust pixel ratio based on performance
    - Scale particle count dynamically
    - Implement automatic quality switching
    - _Requirements: 10.1_

- [ ] 10. Create African cultural visual elements
  - [ ] 10.1 Implement PatternLibrary with Three.js materials
    - Load African pattern textures (Adinkra, Kente, Mudcloth)
    - Create THREE.MeshBasicMaterial for patterns
    - Implement pattern application to meshes
    - _Requirements: 5.2_

  - [ ] 10.2 Design basket with African aesthetics
    - Create traditional gourd/basket texture
    - Apply African patterns to basket design
    - Use earthy color palette
    - _Requirements: 5.1, 5.3_

  - [ ] 10.3 Create background with cultural elements
    - Design gradient background with earth tones
    - Add African pattern borders
    - Implement background plane in Three.js scene
    - _Requirements: 5.2, 5.3_

- [ ] 11. Implement audio system
  - [ ] 11.1 Create AudioManager with Web Audio API
    - Initialize AudioContext
    - Implement audio loading and caching
    - Add playMusic() and playSFX() methods
    - Implement independent volume controls
    - _Requirements: 8.5_

  - [ ] 11.2 Add sound effects
    - Create kalimba sound for water collection
    - Create percussion sound for pollutant collection
    - Add level-up drum roll sound
    - Add game over kora melody
    - _Requirements: 8.1, 8.2_

  - [ ] 11.3 Implement background music system
    - Create African percussion loop (djembe, kalimba)
    - Add dynamic music layers based on difficulty
    - Implement smooth music transitions
    - _Requirements: 8.3, 8.4_

- [ ] 12. Create game UI and state management
  - [ ] 12.1 Implement GameState manager
    - Define game states (menu, playing, paused, gameOver)
    - Implement state transitions
    - Handle state-specific logic
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 12.2 Create UIManager with HTML overlay
    - Position HTML UI over Three.js canvas
    - Implement responsive UI layout
    - Add touch-friendly button sizes (44x44px minimum)
    - _Requirements: 10.5_

  - [ ] 12.3 Design main menu screen
    - Create start menu with play, instructions, settings
    - Apply African-themed visual design
    - Add touch event handlers
    - _Requirements: 6.1_

  - [ ] 12.4 Implement gameplay HUD
    - Display current score with pulse animation
    - Show difficulty level indicator
    - Add pause button
    - Display educational tips
    - _Requirements: 7.3, 9.1_

  - [ ] 12.5 Create game over screen
    - Display final score and high score
    - Show replay and menu buttons
    - Display environmental fact
    - _Requirements: 6.5, 9.3_

- [ ] 13. Add educational content system
  - [ ] 13.1 Create educational content data files
    - Create proverbs.json with African wisdom
    - Create educational.json with water facts
    - Include at least 10 different messages
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 13.2 Implement content display system
    - Show tip at game start (3-5 seconds)
    - Display proverbs at milestones (50, 150, 300 points)
    - Show fact on game over
    - Ensure non-intrusive display
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 14. Implement storage and persistence
  - [ ] 14.1 Create StorageManager with fallback
    - Implement LocalStorage wrapper
    - Add error handling for storage failures
    - Implement in-memory fallback
    - _Requirements: 3.3_

  - [ ] 14.2 Add high score persistence
    - Save high score to LocalStorage
    - Load high score on game start
    - Display high score in UI
    - _Requirements: 3.3_

  - [ ] 14.3 Persist game settings
    - Save music and SFX volume levels
    - Save quality preference
    - Save tutorial completion status
    - _Requirements: 6.1_

- [ ] 15. Implement PWA features
  - [ ] 15.1 Create service worker for offline support
    - Cache critical game assets
    - Implement cache-first strategy
    - Add offline fallback page
    - _Requirements: 10.2_

  - [ ] 15.2 Configure PWA manifest
    - Set app name, icons, and theme colors
    - Configure display mode (fullscreen)
    - Set orientation preference (portrait)
    - _Requirements: 10.2_

  - [ ] 15.3 Add install prompt
    - Detect if app is installable
    - Show install banner on first visit
    - Handle install acceptance/rejection
    - _Requirements: 10.2_

- [ ] 16. Implement game loop and timing
  - [ ] 16.1 Create GameLoop class
    - Use requestAnimationFrame for rendering
    - Calculate delta time for smooth animations
    - Implement pause/resume functionality
    - Target 30 FPS for mobile
    - _Requirements: 10.1, 10.4_

  - [ ] 16.2 Coordinate system updates
    - Update entities in correct order
    - Update spawner system
    - Update difficulty manager
    - Check collisions
    - Update score
    - _Requirements: 10.1_

  - [ ] 16.3 Implement render pipeline
    - Clear previous frame
    - Update Three.js scene
    - Render Three.js frame
    - Update HTML UI overlay
    - _Requirements: 10.1_

- [ ] 17. Add accessibility features
  - [ ] 17.1 Implement reduced motion support
    - Detect prefers-reduced-motion setting
    - Disable non-essential animations
    - Simplify particle effects
    - _Requirements: 10.1_

  - [ ] 17.2 Add safe area support for notched devices
    - Detect safe area insets
    - Adjust UI positioning for notches
    - Test on iPhone X+ and Android notched devices
    - _Requirements: 10.5_

  - [ ] 17.3 Implement adjustable game speed
    - Add speed setting (slow, normal, fast)
    - Scale fall speeds accordingly
    - Persist speed preference
    - _Requirements: 1.5_

- [ ]* 18. Testing and optimization
  - [ ]* 18.1 Write unit tests for core systems
    - Test collision detection accuracy
    - Test score calculation logic
    - Test difficulty scaling formulas
    - Test object pooling behavior
    - _Requirements: All_

  - [ ]* 18.2 Perform device testing
    - Test on iOS devices (iPhone 8+, iPad)
    - Test on Android devices (various manufacturers)
    - Test on different screen sizes (320px - 1024px)
    - Verify 30+ FPS on 5-year-old devices
    - _Requirements: 10.1_

  - [ ]* 18.3 Optimize asset loading
    - Compress textures with WebP where supported
    - Compress audio files (MP3 at 128kbps)
    - Minimize JavaScript bundle size
    - Achieve < 3 second initial load
    - _Requirements: 10.2_

  - [ ]* 18.4 Cultural authenticity review
    - Validate African patterns and designs
    - Review proverbs with cultural consultants
    - Ensure respectful representation
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 18.5 Final polish and bug fixes
    - Fix any identified bugs
    - Smooth animations and transitions
    - Optimize memory usage (< 150MB)
    - Test offline functionality
    - _Requirements: 10.2, 10.3, 10.4_
