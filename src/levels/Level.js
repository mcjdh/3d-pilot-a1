/**
 * Level class for handling level generation and management
 */
import { Key } from '../entities/Key.js';
import { Portal } from '../entities/Portal.js';

export class Level {
    constructor(scene, particleSystem, textureLoader, hitboxHelper) {
        this.scene = scene;
        this.particleSystem = particleSystem;
        this.textureLoader = textureLoader;
        this.hitboxHelper = hitboxHelper;
        this.objects = [];
        this.keys = [];
        this.portal = null;
        this.lights = [];
        
        // Initialize textures if loader is provided
        if (this.textureLoader) {
            this.initTextures();
        }
    }

    // Initialize textures
    initTextures() {
        if (!this.textureLoader.has('wall')) {
            this.textureLoader.load('wall', 'https://threejs.org/examples/textures/brick_diffuse.jpg');
        }
        if (!this.textureLoader.has('floor')) {
            this.textureLoader.load('floor', 'https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
        }
        if (!this.textureLoader.has('ceiling')) {
            this.textureLoader.load('ceiling', 'https://threejs.org/examples/textures/plaster.jpg');
        }
    }

    // Load level data
    load(levelData) {
        this.clear(); // Clear previous level objects
        this.data = levelData;
        
        // Setup lighting
        this.setupLighting();
        
        // Create level geometry
        this.createGround();
        this.createCeiling();
        this.createWalls();
        
        // Create keys and portal
        this.createKeys();
        this.createPortal();
        
        // Return player start position
        return {
            x: this.data.start.x + 0.5, 
            y: 1.6, 
            z: this.data.start.z + 0.5
        };
    }

    // Setup lighting for the level
    setupLighting() {
        // Ambient light for overall scene illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Add a main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // Add point lights throughout the level
        const width = this.data.width;
        const height = this.data.height;
        
        // Add a light near the center of the level
        const centerLight = new THREE.PointLight(0xffffcc, 0.7, 10);
        centerLight.position.set(width/2, 1.8, height/2);
        this.scene.add(centerLight);
        this.lights.push(centerLight);
    }

    // Create the ground plane
    createGround() {
        let material;
        
        if (this.textureLoader && this.textureLoader.has('floor')) {
            const texture = this.textureLoader.get('floor');
            texture.repeat.set(this.data.width, this.data.height);
            material = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.8,
                metalness: 0.2
            });
        } else {
            material = new THREE.MeshStandardMaterial({ color: 0x20232a });
        }
        
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(this.data.width, this.data.height),
            material
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(this.data.width/2, 0, this.data.height/2);
        this.scene.add(ground);
        this.objects.push(ground);
    }

    // Create ceiling 
    createCeiling() {
        let material;
        
        if (this.textureLoader && this.textureLoader.has('ceiling')) {
            const texture = this.textureLoader.get('ceiling');
            texture.repeat.set(this.data.width, this.data.height);
            material = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.9,
                metalness: 0.1
            });
        } else {
            material = new THREE.MeshStandardMaterial({ color: 0x303030 });
        }
        
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.data.width, this.data.height),
            material
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(this.data.width/2, 2, this.data.height/2);
        this.scene.add(ceiling);
        this.objects.push(ceiling);
    }

    // Create walls based on grid data
    createWalls() {
        let material;
        
        if (this.textureLoader && this.textureLoader.has('wall')) {
            const texture = this.textureLoader.get('wall');
            material = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.7,
                metalness: 0.1
            });
        } else {
            material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
        }
        
        // Create wall geometry only once for efficiency
        const wallGeometry = new THREE.BoxGeometry(1, 2, 1);
        
        for (let z = 0; z < this.data.grid.length; z++) {
            for (let x = 0; x < this.data.grid[z].length; x++) {
                if (this.data.grid[z][x] === 1) {
                    const wall = new THREE.Mesh(wallGeometry, material);
                    
                    // Give each wall a hitbox for collision detection
                    wall.userData.hitbox = new THREE.Box3().setFromObject(wall);
                    
                    wall.position.set(x + 0.5, 1, z + 0.5);
                    this.scene.add(wall);
                    this.objects.push(wall);
                }
            }
        }
    }

    // Create keys at predefined or random locations
    createKeys() {
        // If level has predefined keys, use those
        if (this.data.keys && this.data.keys.length > 0) {
            this.data.keys.forEach(keyPos => {
                const key = new Key(
                    { x: keyPos.x + 0.5, y: 0.7, z: keyPos.z + 0.5 },
                    this.scene,
                    this.particleSystem
                );
                key.initialY = 0.7;
                this.keys.push(key);
            });
        } 
        // Otherwise, generate random keys
        else {
            // Find empty spaces for keys (up to 3)
            const keyPositions = this.findEmptyPositions(3);
            
            keyPositions.forEach(pos => {
                const key = new Key(
                    { x: pos.x + 0.5, y: 0.7, z: pos.z + 0.5 },
                    this.scene,
                    this.particleSystem
                );
                key.initialY = 0.7;
                this.keys.push(key);
            });
        }
    }

    // Create a portal for level exit
    createPortal() {
        // Use predefined portal position if available
        let portalPos;
        if (this.data.portal) {
            portalPos = {
                x: this.data.portal.x + 0.5,
                y: 1,
                z: this.data.portal.z + 0.5
            };
        } else {
            // Find an empty space far from start
            const positions = this.findEmptyPositions(1, this.data.start);
            if (positions.length > 0) {
                portalPos = {
                    x: positions[0].x + 0.5,
                    y: 1,
                    z: positions[0].z + 0.5
                };
            } else {
                // Fallback position
                portalPos = {
                    x: this.data.width - 2 + 0.5,
                    y: 1,
                    z: this.data.height - 2 + 0.5
                };
            }
        }
        
        this.portal = new Portal(portalPos, this.scene, this.particleSystem);
    }

    // Find empty positions in the grid
    findEmptyPositions(count, avoidPos = null, minDistance = 3) {
        const positions = [];
        const width = this.data.width;
        const height = this.data.height;
        
        // Create a list of all possible empty positions
        const emptyPositions = [];
        for (let z = 1; z < height - 1; z++) {
            for (let x = 1; x < width - 1; x++) {
                if (this.data.grid[z][x] === 0) {
                    // Skip start position and adjacent tiles
                    if (avoidPos && 
                        Math.abs(x - avoidPos.x) + Math.abs(z - avoidPos.z) < minDistance) {
                        continue;
                    }
                    
                    emptyPositions.push({ x, z });
                }
            }
        }
        
        // Shuffle the array
        for (let i = emptyPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [emptyPositions[i], emptyPositions[j]] = [emptyPositions[j], emptyPositions[i]];
        }
        
        // Take the first 'count' positions
        return emptyPositions.slice(0, count);
    }

    // Clear all level objects
    clear() {
        // Remove objects
        this.objects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.objects = [];
        
        // Remove lights
        this.lights.forEach(light => {
            this.scene.remove(light);
        });
        this.lights = [];
        
        // Clear keys and portal
        this.keys = [];
        this.portal = null;
    }

    // Update level entities
    update(deltaTime) {
        // Update keys
        this.keys.forEach(key => {
            if (key.update) key.update(deltaTime);
        });
        
        // Update portal
        if (this.portal && this.portal.update) {
            this.portal.update(deltaTime);
        }
        
        // Check if all keys are collected and activate portal if so
        if (this.portal && !this.portal.active) {
            const allKeysCollected = this.keys.every(key => key.collected);
            if (allKeysCollected && this.keys.length > 0) {
                this.portal.activate();
            }
        }
    }

    // Get all collidable objects with hitboxes
    getCollidables() {
        return this.objects.filter(obj => obj.userData && obj.userData.hitbox);
    }

    // Check player collisions with keys
    checkKeyCollisions(playerBoundingBox) {
        let collected = false;
        
        this.keys.forEach(key => {
            if (!key.collected && key.hitbox.intersectsBox(playerBoundingBox)) {
                key.collect();
                collected = true;
            }
        });
        
        return collected;
    }

    // Check player collision with portal
    checkPortalCollision(playerBoundingBox) {
        if (this.portal && this.portal.active && !this.portal.used && 
            this.portal.hitbox.intersectsBox(playerBoundingBox)) {
            return this.portal.use();
        }
        
        return false;
    }

    // Get remaining key count
    getRemainingKeyCount() {
        return this.keys.filter(key => !key.collected).length;
    }

    // Update hitbox visualizations
    updateHitboxVisualizations(hitboxHelper) {
        if (!hitboxHelper) return;
        
        // Visualize wall hitboxes
        this.objects.forEach((obj, index) => {
            if (obj.userData && obj.userData.hitbox) {
                hitboxHelper.createOrUpdateHitboxMesh(
                    obj.userData.hitbox,
                    `wall_${index}`,
                    0xee4444
                );
            }
        });
        
        // Visualize key hitboxes
        this.keys.forEach((key, index) => {
            if (key && key.hitbox && !key.collected) {
                hitboxHelper.createOrUpdateHitboxMesh(
                    key.hitbox,
                    `key_${index}`,
                    0xffcc00
                );
            }
        });
        
        // Visualize portal hitbox
        if (this.portal && this.portal.hitbox) {
            hitboxHelper.createOrUpdateHitboxMesh(
                this.portal.hitbox,
                'portal',
                0x6688ff
            );
        }
    }

    // Get total key count
    getTotalKeyCount() {
        return this.keys.length;
    }

    // Stub for procedural generation
    // This would be expanded in the future for actual procedural generation
    static generateProceduralLevel(width, height, complexity = 0.5) {
        // Create empty grid filled with walls
        const grid = Array(height).fill().map(() => Array(width).fill(1));
        
        // Simple maze algorithm could go here
        // For now, just create a simple room with random inner walls
        
        // Create border
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Make borders solid
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    grid[y][x] = 1;
                } 
                // Make interior mostly empty with some random walls
                else {
                    grid[y][x] = Math.random() < complexity ? 1 : 0;
                }
            }
        }
        
        // Ensure start position is empty (for player placement)
        const startX = 1;
        const startZ = 1;
        grid[startZ][startX] = 0;
        
        // Generate key positions (3 keys)
        const keyPositions = [];
        for (let i = 0; i < 3; i++) {
            let keyX, keyZ;
            // Find an empty position away from start
            do {
                keyX = Math.floor(Math.random() * (width - 4)) + 2;
                keyZ = Math.floor(Math.random() * (height - 4)) + 2;
            } while (grid[keyZ][keyX] !== 0 || 
                     (Math.abs(keyX - startX) + Math.abs(keyZ - startZ) < 3) ||
                     keyPositions.some(pos => pos.x === keyX && pos.z === keyZ));
            
            keyPositions.push({ x: keyX, z: keyZ });
        }
        
        // Generate portal position
        let portalX, portalZ;
        do {
            portalX = Math.floor(Math.random() * (width - 4)) + 2;
            portalZ = Math.floor(Math.random() * (height - 4)) + 2;
        } while (grid[portalZ][portalX] !== 0 || 
                 (Math.abs(portalX - startX) + Math.abs(portalZ - startZ) < 5) ||
                 keyPositions.some(pos => pos.x === portalX && pos.z === portalZ));
        
        // Return level data object
        return {
            name: "Procedural Level",
            width: width,
            height: height,
            start: { x: startX, z: startZ },
            grid: grid,
            keys: keyPositions,
            portal: { x: portalX, z: portalZ }
        };
    }
}