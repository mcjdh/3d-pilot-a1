/**
 * Player entity with first-person controls
 */
export class Player {
    constructor(inputSystem, cameraRef) {
        // Store references
        this.input = inputSystem;
        this.camera = cameraRef;
        
        // Movement properties
        this.speed = 4; // Units per second
        this.rotationSpeed = 0.002; // Radians per pixel of mouse movement
        this.pitch = 0;
        this.yaw = 0;
        
        // Create player object (container for camera)
        this.object = new THREE.Object3D();
        this.object.position.set(1, 1.6, 1); // Default position
        this.object.add(this.camera);
        
        // Setup camera positioning
        this.camera.position.set(0, 0, 0); // Relative to player
        
        // Setup pointer lock handling
        this.setupPointerLock();
    }
    
    setupPointerLock() {
        // Set callback for pointer lock changes
        this.input.setPointerLockCallback((locked) => {
            document.getElementById('instructions').style.display = locked ? 'none' : '';
        });
        
        // Click to lock pointer
        document.body.addEventListener('click', () => {
            if (!this.input.isPointerLocked) {
                this.input.requestPointerLock(document.body);
            }
        });
    }
    
    update(deltaTime) {
        this.handleRotation();
        this.handleMovement(deltaTime);
    }
    
    handleRotation() {
        // Only handle rotation if pointer is locked
        if (!this.input.isPointerLocked) return;
        
        // Update rotation based on mouse movement
        this.yaw -= this.input.mouseDelta.x * this.rotationSpeed;
        this.pitch -= this.input.mouseDelta.y * this.rotationSpeed;
        
        // Clamp pitch to prevent flipping
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
        
        // Apply rotation
        this.object.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
        
        // Reset mouse delta
        this.input.resetMouseDelta();
    }
    
    handleMovement(deltaTime) {
        let dirX = 0, dirZ = 0;
        
        // WASD movement
        if (this.input.isKeyPressed('KeyW')) dirZ -= 1;
        if (this.input.isKeyPressed('KeyS')) dirZ += 1;
        if (this.input.isKeyPressed('KeyA')) dirX -= 1;
        if (this.input.isKeyPressed('KeyD')) dirX += 1;
        
        // If there's input, move the player
        if (dirX !== 0 || dirZ !== 0) {
            const angle = this.object.rotation.y;
            const dx = (dirX * Math.cos(angle) - dirZ * Math.sin(angle)) * this.speed * deltaTime;
            const dz = (dirX * Math.sin(angle) + dirZ * Math.cos(angle)) * this.speed * deltaTime;
            
            this.object.position.x += dx;
            this.object.position.z += dz;
        }
    }
    
    // Set player position (used when changing levels)
    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }
}