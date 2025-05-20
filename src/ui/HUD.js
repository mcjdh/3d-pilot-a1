/**
 * HUD class for managing UI elements
 */
export class HUD {
    constructor() {
        // Store UI element references
        this.elements = {
            levelInfo: document.getElementById('level-info'),
            instructions: document.getElementById('instructions')
        };
    }

    // Update level information display
    updateLevelInfo(levelIndex, levelName) {
        if (this.elements.levelInfo) {
            this.elements.levelInfo.textContent = `Level ${levelIndex + 1}: ${levelName}`;
        }
    }

    // Show a temporary message on screen
    showMessage(message, duration = 3000) {
        // Create message element if it doesn't exist
        if (!this.elements.message) {
            const messageEl = document.createElement('div');
            messageEl.id = 'hud-message';
            messageEl.style.position = 'absolute';
            messageEl.style.top = '50%';
            messageEl.style.left = '50%';
            messageEl.style.transform = 'translate(-50%, -50%)';
            messageEl.style.background = 'rgba(0, 0, 0, 0.7)';
            messageEl.style.color = 'white';
            messageEl.style.padding = '15px 25px';
            messageEl.style.borderRadius = '5px';
            messageEl.style.fontFamily = 'monospace, sans-serif';
            messageEl.style.fontSize = '18px';
            messageEl.style.zIndex = '100';
            messageEl.style.pointerEvents = 'none';
            messageEl.style.transition = 'opacity 0.3s';
            document.body.appendChild(messageEl);
            this.elements.message = messageEl;
        }
        
        // Clear any existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Show message
        this.elements.message.textContent = message;
        this.elements.message.style.opacity = '1';
        
        // Set timeout to hide message
        this.messageTimeout = setTimeout(() => {
            this.elements.message.style.opacity = '0';
        }, duration);
    }
    
    // Toggle instructions visibility
    setInstructionsVisible(visible) {
        if (this.elements.instructions) {
            this.elements.instructions.style.display = visible ? '' : 'none';
        }
    }
}