/**
 * NotificationManager - Display notifications and level-up messages
 */
export class NotificationManager {
  constructor() {
    this.notificationElement = null;
    this.currentTimeout = null;
    
    this.createNotificationElement();
    
    console.log('NotificationManager initialized');
  }
  
  /**
   * Create notification DOM element
   */
  createNotificationElement() {
    this.notificationElement = document.createElement('div');
    this.notificationElement.id = 'notification';
    this.notificationElement.className = 'notification';
    this.notificationElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #8B4513, #D2691E);
      color: #FFD700;
      padding: 30px 50px;
      border-radius: 15px;
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      border: 3px solid #FFD700;
    `;
    
    document.body.appendChild(this.notificationElement);
  }
  
  /**
   * Show level-up notification
   */
  showLevelUp(level) {
    this.show(`Level ${level}!`, 2000);
  }
  
  /**
   * Show custom notification
   */
  show(message, duration = 3000) {
    // Clear any existing timeout
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
    
    // Set message
    this.notificationElement.textContent = message;
    
    // Show notification
    this.notificationElement.style.opacity = '1';
    
    // Hide after duration
    this.currentTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }
  
  /**
   * Hide notification
   */
  hide() {
    this.notificationElement.style.opacity = '0';
    
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
  
  /**
   * Show proverb notification
   */
  showProverb(proverb) {
    const message = `"${proverb.text}"\n- ${proverb.origin}`;
    this.notificationElement.style.fontSize = '1.5rem';
    this.show(message, 4000);
    
    // Reset font size after hiding
    setTimeout(() => {
      this.notificationElement.style.fontSize = '2rem';
    }, 4500);
  }
  
  /**
   * Show educational tip
   */
  showTip(tip) {
    this.notificationElement.style.fontSize = '1.2rem';
    this.show(tip, 4000);
    
    // Reset font size after hiding
    setTimeout(() => {
      this.notificationElement.style.fontSize = '2rem';
    }, 4500);
  }
  
  /**
   * Cleanup
   */
  dispose() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
    
    if (this.notificationElement && this.notificationElement.parentNode) {
      this.notificationElement.parentNode.removeChild(this.notificationElement);
    }
    
    console.log('NotificationManager disposed');
  }
}
