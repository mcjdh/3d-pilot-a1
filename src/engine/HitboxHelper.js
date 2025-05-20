/**
 * Hitbox visualization helper
 * Provides utilities for debugging hitboxes and collision detection
 */
export class HitboxHelper {
    constructor(scene) {
        this.scene = scene;
        this.enabled = false;
        this.hitboxMeshes = new Map(); // Store reference to visualization meshes
        this.material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.5 
        });
    }

    /**
     * Toggle hitbox visualization
     */
    toggle() {
        this.enabled = !this.enabled;
        
        // Show/hide all existing hitbox visualizations
        this.hitboxMeshes.forEach(mesh => {
            mesh.visible = this.enabled;
        });
        
        return this.enabled;
    }

    /**
     * Create or update a visualization for a hitbox
     * @param {THREE.Box3} hitbox - The hitbox to visualize
     * @param {string} id - Unique identifier for this hitbox
     * @param {number} color - Optional color override
     */
    createOrUpdateHitboxMesh(hitbox, id, color = null) {
        if (!hitbox) return;
        
        // Calculate the size of the hitbox
        const size = new THREE.Vector3();
        hitbox.getSize(size);
        
        // Get the center of the hitbox
        const center = new THREE.Vector3();
        hitbox.getCenter(center);
        
        // Check if we already have a mesh for this hitbox
        if (this.hitboxMeshes.has(id)) {
            const existingMesh = this.hitboxMeshes.get(id);
            
            // Update existing mesh position and size
            existingMesh.position.copy(center);
            existingMesh.scale.copy(size);
        } else {
            // Create a new mesh for this hitbox
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = color ? 
                new THREE.MeshBasicMaterial({ 
                    color: color, 
                    wireframe: true, 
                    transparent: true, 
                    opacity: 0.5 
                }) : this.material;
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(center);
            mesh.scale.copy(size);
            mesh.visible = this.enabled;
            
            // Add to scene and store reference
            this.scene.add(mesh);
            this.hitboxMeshes.set(id, mesh);
        }
    }

    /**
     * Remove a hitbox visualization
     * @param {string} id - Identifier of the hitbox to remove
     */
    removeHitboxMesh(id) {
        if (this.hitboxMeshes.has(id)) {
            const mesh = this.hitboxMeshes.get(id);
            this.scene.remove(mesh);
            this.hitboxMeshes.delete(id);
        }
    }

    /**
     * Clear all hitbox visualizations
     */
    clearAllHitboxes() {
        this.hitboxMeshes.forEach(mesh => {
            this.scene.remove(mesh);
        });
        this.hitboxMeshes.clear();
    }
}