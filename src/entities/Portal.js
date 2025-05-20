/**
 * Portal entity for level transitions
 */
export class Portal {
    constructor(position, scene, particleSystem) {
        this.scene = scene;
        this.particleSystem = particleSystem;
        this.active = false;
        this.used = false;
        this.position = position;
        this.rotationSpeed = 0.5; // radians per second
        
        // Create the visual representation
        this.createMesh(position);
        
        // Add hitbox
        this.createHitbox(position);
        
        // Track last particle emission time
        this.lastParticleTime = 0;
    }

    /**
     * Create portal mesh
     * @param {object} position - Position of the portal
     */
    createMesh(position) {
        this.object = new THREE.Group();
        
        // Create portal frame (torus)
        this.frame = new THREE.Mesh(
            new THREE.TorusGeometry(0.4, 0.1, 16, 32),
            new THREE.MeshStandardMaterial({ 
                color: 0x444444, 
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0x222222
            })
        );
        this.object.add(this.frame);
        
        // Create inactive portal center
        this.center = new THREE.Mesh(
            new THREE.CircleGeometry(0.38, 32),
            new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                transparent: true,
                opacity: 0.5
            })
        );
        this.center.position.z = 0.01;
        this.object.add(this.center);
        
        // Position the portal
        this.object.position.set(position.x, position.y, position.z);
        
        // Store initial Y for animation
        this.initialY = position.y;
        
        // Add to scene
        this.scene.add(this.object);
    }

    /**
     * Create hitbox for collision detection
     * @param {object} position - Position of the portal
     */
    createHitbox(position) {
        this.hitbox = new THREE.Box3();
        this.hitbox.setFromCenterAndSize(
            new THREE.Vector3(position.x, position.y, position.z),
            new THREE.Vector3(0.8, 1, 0.5)
        );
    }

    /**
     * Update portal animation
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Rotate the portal
        this.object.rotation.z += this.rotationSpeed * deltaTime;
        
        // Slight hover effect
        this.object.position.y = this.initialY + Math.sin(Date.now() / 800) * 0.05;
        
        // Update hitbox position
        this.hitbox.setFromCenterAndSize(
            this.object.position.clone(),
            new THREE.Vector3(0.8, 1, 0.5)
        );
        
        // If active, emit particles periodically
        if (this.active && !this.used) {
            const currentTime = Date.now();
            if (currentTime - this.lastParticleTime > 500) {
                this.lastParticleTime = currentTime;
                
                if (this.particleSystem) {
                    this.particleSystem.createPortalEffect(this.object.position, 0x6688ff);
                }
            }
        }
    }

    /**
     * Activate the portal
     */
    activate() {
        if (this.active) return;
        
        this.active = true;
        
        // Change appearance for active portal
        this.frame.material.color.set(0x4466cc);
        this.frame.material.emissive.set(0x2244aa);
        
        this.center.material.color.set(0x6688ff);
        this.center.material.opacity = 0.7;
        
        // Create activation effect
        if (this.particleSystem) {
            for (let i = 0; i < 3; i++) {
                this.particleSystem.createPortalEffect(this.object.position, 0x6688ff);
            }
        }
    }

    /**
     * Use the portal (teleport)
     */
    use() {
        if (!this.active || this.used) return false;
        
        this.used = true;
        
        // Create usage effect
        if (this.particleSystem) {
            for (let i = 0; i < 5; i++) {
                this.particleSystem.createPortalEffect(this.object.position, 0xaaccff);
            }
        }
        
        return true;
    }
}