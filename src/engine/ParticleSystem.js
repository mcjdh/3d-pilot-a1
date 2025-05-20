/**
 * Particle system for creating visual effects
 */
export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particleSystems = [];
    }

    /**
     * Create a new particle effect
     * @param {object} options - Configuration for the particle effect
     * @returns {object} The created particle system
     */
    createEffect(options = {}) {
        const config = {
            position: options.position || { x: 0, y: 0, z: 0 },
            count: options.count || 20,
            size: options.size || 0.1,
            color: options.color || 0xffffff,
            lifetime: options.lifetime || 1,
            speed: options.speed || 1,
            texture: options.texture || null
        };

        // Create particles
        const particles = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        const lifetimes = [];

        for (let i = 0; i < config.count; i++) {
            // Random initial positions within small radius
            const x = config.position.x + (Math.random() - 0.5) * 0.2;
            const y = config.position.y + (Math.random() - 0.5) * 0.2;
            const z = config.position.z + (Math.random() - 0.5) * 0.2;
            
            positions.push(x, y, z);
            
            // Random velocities in all directions
            const angle = Math.random() * Math.PI * 2;
            const speed = config.speed * (0.5 + Math.random());
            velocities.push(
                Math.cos(angle) * speed * (Math.random() - 0.5),
                Math.random() * speed,
                Math.sin(angle) * speed * (Math.random() - 0.5)
            );
            
            // Random lifetime for each particle
            lifetimes.push(config.lifetime * (0.7 + Math.random() * 0.6));
        }

        particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        // Create material
        const material = new THREE.PointsMaterial({
            color: config.color,
            size: config.size,
            transparent: true,
            opacity: 0.8,
            map: config.texture
        });

        // Create the particle system
        const particleSystem = new THREE.Points(particles, material);
        this.scene.add(particleSystem);
        
        // Store data for animation
        const system = {
            object: particleSystem,
            positions: particles.attributes.position.array,
            velocities: velocities,
            lifetimes: lifetimes,
            initialLifetimes: [...lifetimes],
            createdAt: Date.now() / 1000
        };
        
        this.particleSystems.push(system);
        return system;
    }

    /**
     * Update all particle systems
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        const systemsToRemove = [];
        
        this.particleSystems.forEach((system, index) => {
            const positions = system.positions;
            const velocities = system.velocities;
            const lifetimes = system.lifetimes;
            let allDead = true;
            
            // Update each particle
            for (let i = 0; i < positions.length; i += 3) {
                // Skip dead particles
                if (lifetimes[i/3] <= 0) continue;
                
                // Update lifetime
                lifetimes[i/3] -= deltaTime;
                
                // If particle is still alive
                if (lifetimes[i/3] > 0) {
                    allDead = false;
                    
                    // Update position based on velocity
                    positions[i] += velocities[i] * deltaTime;
                    positions[i+1] += velocities[i+1] * deltaTime;
                    positions[i+2] += velocities[i+2] * deltaTime;
                    
                    // Apply gravity
                    velocities[i+1] -= 1 * deltaTime;
                }
            }
            
            // If all particles are dead, mark for removal
            if (allDead) {
                systemsToRemove.push(index);
            }
            
            // Update opacity based on lifetime
            const age = Date.now() / 1000 - system.createdAt;
            const material = system.object.material;
            material.opacity = Math.max(0, 0.8 * (1 - age / (system.initialLifetimes[0] * 1.2)));
            
            // Update the geometry
            system.object.geometry.attributes.position.needsUpdate = true;
        });
        
        // Remove dead systems (in reverse order to avoid index issues)
        for (let i = systemsToRemove.length - 1; i >= 0; i--) {
            const system = this.particleSystems[systemsToRemove[i]];
            this.scene.remove(system.object);
            this.particleSystems.splice(systemsToRemove[i], 1);
        }
    }

    /**
     * Create a collision effect
     * @param {object} position - Position of the collision
     * @param {number} color - Color of the particles
     */
    createCollisionEffect(position, color = 0xffaa00) {
        return this.createEffect({
            position: position,
            count: 15,
            size: 0.05,
            color: color,
            lifetime: 0.5,
            speed: 2
        });
    }

    /**
     * Create a pickup effect
     * @param {object} position - Position of the pickup
     * @param {number} color - Color of the particles
     */
    createPickupEffect(position, color = 0x00ffaa) {
        return this.createEffect({
            position: position,
            count: 20,
            size: 0.08,
            color: color,
            lifetime: 0.8,
            speed: 1.5
        });
    }

    /**
     * Create a portal effect
     * @param {object} position - Position of the portal
     * @param {number} color - Color of the particles
     */
    createPortalEffect(position, color = 0x6688ff) {
        return this.createEffect({
            position: position,
            count: 30,
            size: 0.1,
            color: color,
            lifetime: 1.2,
            speed: 1
        });
    }
}