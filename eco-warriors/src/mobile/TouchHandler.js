import { Config } from '../game/Config.js';

/**
 * TouchHandler - Manages mobile touch input with gesture support
 */
export class TouchHandler {
  constructor(element) {
    this.element = element;
    this.isActive = false;
    this.touchStartPos = { x: 0, y: 0 };
    this.currentTouchPos = { x: 0, y: 0 };
    this.smoothedTouchPos = { x: 0, y: 0 };
    this.touchId = null;
    
    // Callbacks
    this.onTouchStartCallback = null;
    this.onTouchMoveCallback = null;
    this.onTouchEndCallback = null;
    
    this.setupEventListeners();
    
    console.log('TouchHandler initialized');
  }
  
  /**
   * Set up touch event listeners
   */
  setupEventListeners() {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
    
    // Mouse events for desktop testing
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    
    console.log('Touch event listeners attached');
  }
  
  /**
   * Handle touch start
   */
  handleTouchStart(event) {
    event.preventDefault(); // Prevent scrolling
    
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.touchId = touch.identifier;
      this.isActive = true;
      
      this.touchStartPos = { x: touch.clientX, y: touch.clientY };
      this.currentTouchPos = { x: touch.clientX, y: touch.clientY };
      this.smoothedTouchPos = { x: touch.clientX, y: touch.clientY };
      
      if (this.onTouchStartCallback) {
        this.onTouchStartCallback(this.currentTouchPos);
      }
    }
  }
  
  /**
   * Handle touch move
   */
  handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling
    
    if (!this.isActive) return;
    
    // Find the touch we're tracking
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      if (touch.identifier === this.touchId) {
        this.currentTouchPos = { x: touch.clientX, y: touch.clientY };
        
        // Apply smoothing
        this.smoothedTouchPos.x += (this.currentTouchPos.x - this.smoothedTouchPos.x) * Config.MOBILE.TOUCH_SMOOTHING;
        this.smoothedTouchPos.y += (this.currentTouchPos.y - this.smoothedTouchPos.y) * Config.MOBILE.TOUCH_SMOOTHING;
        
        if (this.onTouchMoveCallback) {
          this.onTouchMoveCallback(this.smoothedTouchPos);
        }
        break;
      }
    }
  }
  
  /**
   * Handle touch end
   */
  handleTouchEnd(event) {
    if (!this.isActive) return;
    
    // Check if our tracked touch ended
    let touchEnded = true;
    for (let i = 0; i < event.touches.length; i++) {
      if (event.touches[i].identifier === this.touchId) {
        touchEnded = false;
        break;
      }
    }
    
    if (touchEnded) {
      this.isActive = false;
      this.touchId = null;
      
      if (this.onTouchEndCallback) {
        this.onTouchEndCallback(this.currentTouchPos);
      }
    }
  }
  
  /**
   * Handle mouse down (for desktop testing)
   */
  handleMouseDown(event) {
    this.isActive = true;
    this.touchStartPos = { x: event.clientX, y: event.clientY };
    this.currentTouchPos = { x: event.clientX, y: event.clientY };
    this.smoothedTouchPos = { x: event.clientX, y: event.clientY };
    
    if (this.onTouchStartCallback) {
      this.onTouchStartCallback(this.currentTouchPos);
    }
  }
  
  /**
   * Handle mouse move (for desktop testing)
   */
  handleMouseMove(event) {
    if (!this.isActive) return;
    
    this.currentTouchPos = { x: event.clientX, y: event.clientY };
    
    // Apply smoothing
    this.smoothedTouchPos.x += (this.currentTouchPos.x - this.smoothedTouchPos.x) * Config.MOBILE.TOUCH_SMOOTHING;
    this.smoothedTouchPos.y += (this.currentTouchPos.y - this.smoothedTouchPos.y) * Config.MOBILE.TOUCH_SMOOTHING;
    
    if (this.onTouchMoveCallback) {
      this.onTouchMoveCallback(this.smoothedTouchPos);
    }
  }
  
  /**
   * Handle mouse up (for desktop testing)
   */
  handleMouseUp(event) {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.onTouchEndCallback) {
      this.onTouchEndCallback(this.currentTouchPos);
    }
  }
  
  /**
   * Register touch start callback
   */
  onTouchStart(callback) {
    this.onTouchStartCallback = callback;
  }
  
  /**
   * Register touch move callback
   */
  onTouchMove(callback) {
    this.onTouchMoveCallback = callback;
  }
  
  /**
   * Register touch end callback
   */
  onTouchEnd(callback) {
    this.onTouchEndCallback = callback;
  }
  
  /**
   * Get current touch position
   */
  getTouchPosition() {
    return this.isActive ? { ...this.smoothedTouchPos } : null;
  }
  
  /**
   * Check if touch is active
   */
  isTouching() {
    return this.isActive;
  }
  
  /**
   * Enable haptic feedback (vibration)
   */
  enableHapticFeedback(duration = Config.MOBILE.HAPTIC_DURATION) {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }
  
  /**
   * Cleanup event listeners
   */
  dispose() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchEnd);
    
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('mouseleave', this.handleMouseUp);
    
    console.log('TouchHandler disposed');
  }
}
