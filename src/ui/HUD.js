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
        
        // Create key counter element
        this.createKeyCounter();
        
        // Create objective display
        this.createObjectiveDisplay();
    }
    
    // Create key counter UI element
    createKeyCounter() {
        const keyCounter = document.createElement('div');
        keyCounter.id = 'key-counter';
        keyCounter.style.marginTop = '10px';
        keyCounter.style.fontSize = '1.1em';
        keyCounter.style.color = '#ffcc00';
        keyCounter.textContent = 'Keys: 0/0';
        
        // Add to UI
        document.querySelector('#ui').appendChild(keyCounter);
        this.elements.keyCounter = keyCounter;
    }
    
    // Create objective display
    createObjectiveDisplay() {
        const objective = document.createElement('div');
        objective.id = 'objective';
        objective.style.marginTop = '10px';
        objective.style.fontSize = '1.1em';
        objective.style.color = '#aaccff';
        objective.textContent = 'Objective: Collect all keys to open the portal';
        
        // Add to UI
        document.querySelector('#ui').appendChild(objective);
        this.elements.objective = objective;
    }

    // Update level information display
    updateLevelInfo(levelIndex, levelName) {
        if (this.elements.levelInfo) {
            this.elements.levelInfo.textContent = `Level ${levelIndex + 1}: ${levelName}`;
        }
    }
    
    // Update key count display
    updateKeyInfo(collected, total) {
        if (this.elements.keyCounter) {
            this.elements.keyCounter.textContent = `Keys: ${collected}/${total}`;
            
            // Update objective text based on key collection
            if (collected === total && total > 0) {
                this.updateObjective('Find the portal to exit the level');
            } else if (total > 0) {
                this.updateObjective(`Collect all keys to open the portal (${collected}/${total})`);
            }
        }
    }
    
    // Update objective text
    updateObjective(text) {
        if (this.elements.objective) {
            this.elements.objective.textContent = `Objective: ${text}`;
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