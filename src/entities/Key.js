/**
 * Key entity for level progression
 */
export class Key {
    constructor(position, scene, particleSystem) {
        this.scene = scene;
        this.particleSystem = particleSystem;
        this.collected = false;
        this.rotationSpeed = 1; // radians per second
        
        // Create mesh
        this.createMesh(position);
        
        // Add hitbox
        this.createHitbox(position);
    }

    /**
     * Create key mesh
     * @param {object} position - Position of the key
     */
    createMesh(position) {
        // Create a simple key shape
        this.object = new THREE.Group();
        
        // Key head (circle)
        const keyHead = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16),
            new THREE.MeshStandardMaterial({ 
                color: 0xffcc00,
                metalness: 0.7,
                roughness: 0.2
            })
        );
        keyHead.rotation.x = Math.PI / 2;
        keyHead.position.y = 0.15;
        this.object.add(keyHead);
        
        // Key shaft
        const keyShaft = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.3, 0.05),
            new THREE.MeshStandardMaterial({ 
                color: 0xffcc00,
                metalness: 0.7,
                roughness: 0.2
            })
        );
        this.object.add(keyShaft);
        
        // Key bits
        const keyBit1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.05, 0.05),
            new THREE.MeshStandardMaterial({ 
                color: 0xffcc00,
                metalness: 0.7,
                roughness: 0.2
            })
        );
        keyBit1.position.set(0.075, -0.1, 0);
        this.object.add(keyBit1);
        
        const keyBit2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.05, 0.05),
            new THREE.MeshStandardMaterial({ 
                color: 0xffcc00,
                metalness: 0.7,
                roughness: 0.2
            })
        );
        keyBit2.position.set(0.065, -0.15, 0);
        this.object.add(keyBit2);
        
        // Position the key
        this.object.position.set(position.x, position.y, position.z);
        
        // Add to scene
        this.scene.add(this.object);
    }

    /**
     * Create hitbox for collision detection
     * @param {object} position - Position of the key
     */
    createHitbox(position) {
        this.hitbox = new THREE.Box3();
        this.hitbox.setFromCenterAndSize(
            new THREE.Vector3(position.x, position.y, position.z),
            new THREE.Vector3(0.3, 0.3, 0.3)
        );
    }

    /**
     * Update key animation
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (this.collected) return;
        
        // Rotate the key
        this.object.rotation.y += this.rotationSpeed * deltaTime;
        
        // Float up and down
        this.object.position.y = this.initialY + Math.sin(Date.now() / 500) * 0.05;
        
        // Update hitbox position
        this.hitbox.setFromCenterAndSize(
            this.object.position.clone(),
            new THREE.Vector3(0.3, 0.3, 0.3)
        );
    }

    /**
     * Collect the key
     */
    collect() {
        if (this.collected) return;
        
        this.collected = true;
        
        // Create pickup effect
        if (this.particleSystem) {
            this.particleSystem.createPickupEffect(this.object.position, 0xffcc00);
        }
        
        // Hide the key
        this.scene.remove(this.object);
        
        return true;
    }
}