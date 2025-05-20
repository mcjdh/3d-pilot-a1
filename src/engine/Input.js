/**
 * Input system for handling keyboard and mouse events
 */
export class InputSystem {
    constructor() {
        // Keyboard state
        this.keys = {};
        // Mouse state
        this.mouseDelta = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };
        this.isPointerLocked = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            if (this.isPointerLocked) {
                this.mouseDelta.x = event.movementX || 0;
                this.mouseDelta.y = event.movementY || 0;
                this.mousePosition.x = event.clientX || 0;
                this.mousePosition.y = event.clientY || 0;
            }
        });

        // Pointer lock events
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
            if (this.onPointerLockChange) {
                this.onPointerLockChange(this.isPointerLocked);
            }
        });
    }
    
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
    
    requestPointerLock(element) {
        if (!this.isPointerLocked) {
            element.requestPointerLock();
        }
    }
    
    exitPointerLock() {
        if (this.isPointerLocked) {
            document.exitPointerLock();
        }
    }

    // Register callback for pointer lock change
    setPointerLockCallback(callback) {
        this.onPointerLockChange = callback;
    }
    
    // Reset the mouse delta after reading it
    resetMouseDelta() {
        const previousDelta = { x: this.mouseDelta.x, y: this.mouseDelta.y };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return previousDelta;
    }
}