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
        
        // Create hitbox for collision detection
        this.updateBoundingBox();
        
        // Track collisions
        this.colliders = [];
        
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
        this.updateBoundingBox();
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
            // Normalize diagonal movement
            if (dirX !== 0 && dirZ !== 0) {
                const length = Math.sqrt(dirX * dirX + dirZ * dirZ);
                dirX /= length;
                dirZ /= length;
            }
            
            // Get camera yaw angle
            const angle = this.object.rotation.y;
            
            // Calculate movement vector relative to camera orientation
            const dx = (dirX * Math.cos(angle) - dirZ * Math.sin(angle)) * this.speed * deltaTime;
            const dz = (dirX * Math.sin(angle) + dirZ * Math.cos(angle)) * this.speed * deltaTime;
            
            // Clamp maximum movement distance to prevent tunneling at high speeds or low framerates
            const maxStep = 0.1; // Maximum distance per frame
            const stepLengthSq = dx * dx + dz * dz;
            
            let finalDx = dx;
            let finalDz = dz;
            
            // If step is too large, scale it down
            if (stepLengthSq > maxStep * maxStep) {
                const scaleFactor = maxStep / Math.sqrt(stepLengthSq);
                finalDx = dx * scaleFactor;
                finalDz = dz * scaleFactor;
            }
            
            // Store current position in case we need to revert
            const oldPosition = this.object.position.clone();
            
            // Try moving on each axis separately to allow sliding along walls
            const newPosition = oldPosition.clone();
            
            // Try moving along X axis
            newPosition.x += finalDx;
            if (this.checkCollisions(newPosition)) {
                newPosition.x = oldPosition.x; // Revert X movement
            }
            
            // Try moving along Z axis
            newPosition.z += finalDz;
            if (this.checkCollisions(newPosition)) {
                newPosition.z = oldPosition.z; // Revert Z movement
            }
            
            // If we couldn't move on either axis individually, try small steps
            // This helps prevent getting stuck on corners
            if (newPosition.x === oldPosition.x && newPosition.z === oldPosition.z && stepLengthSq > 0) {
                // Try small steps at different angles to find a valid path
                for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                    const testPosition = oldPosition.clone();
                    testPosition.x += Math.cos(angle) * maxStep * 0.5;
                    testPosition.z += Math.sin(angle) * maxStep * 0.5;
                    
                    if (!this.checkCollisions(testPosition)) {
                        newPosition.copy(testPosition);
                        break;
                    }
                }
            }
            
            // Apply new position
            this.object.position.copy(newPosition);
        }
    }
    
    // Update the player's bounding box for collision detection
    updateBoundingBox() {
        // Create a bounding box representing the player's body
        this.boundingBox = new THREE.Box3();
        
        // Player is represented as a box with a small margin to prevent getting caught on corners
        // Width and depth slightly smaller than the actual size (0.6 -> 0.5) to avoid corner issues
        this.boundingBox.setFromCenterAndSize(
            this.object.position.clone(),
            new THREE.Vector3(0.5, 1.8, 0.5)
        );
    }
    
    // Check for collisions with a potential new position
    checkCollisions(newPosition) {
        // Create a bounding box for the potential new position
        const potentialBox = new THREE.Box3();
        potentialBox.setFromCenterAndSize(
            newPosition.clone(),
            new THREE.Vector3(0.5, 1.8, 0.5)  // Matching the player hitbox dimensions
        );
        
        // Check against all collidables
        for (let i = 0; i < this.colliders.length; i++) {
            const collider = this.colliders[i];
            if (collider.userData && collider.userData.hitbox) {
                if (potentialBox.intersectsBox(collider.userData.hitbox)) {
                    return true; // Collision detected
                }
            }
        }
        
        return false; // No collision
    }
    
    // Set colliders for collision detection
    setColliders(colliders) {
        this.colliders = colliders;
    }
    
    // Get the player's bounding box
    getBoundingBox() {
        return this.boundingBox;
    }
    
    // Set player position (used when changing levels)
    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
        this.updateBoundingBox();
    }
}