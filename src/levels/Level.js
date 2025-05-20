/**
 * Level class for handling level generation and management
 */
export class Level {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
    }

    // Load level data
    load(levelData) {
        this.clear(); // Clear previous level objects
        this.data = levelData;
        
        // Create level geometry
        this.createGround();
        this.createWalls();
        
        // Return player start position
        return {
            x: this.data.start.x + 0.5, 
            y: 1.6, 
            z: this.data.start.z + 0.5
        };
    }

    // Create the ground plane
    createGround() {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(this.data.width, this.data.height),
            new THREE.MeshBasicMaterial({ color: 0x20232a })
        );
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);
        this.objects.push(ground);
    }

    // Create walls based on grid data
    createWalls() {
        for (let z = 0; z < this.data.grid.length; z++) {
            for (let x = 0; x < this.data.grid[z].length; x++) {
                if (this.data.grid[z][x] === 1) {
                    const wall = new THREE.Mesh(
                        new THREE.BoxGeometry(1, 2, 1),
                        new THREE.MeshBasicMaterial({ color: 0xeeeeee })
                    );
                    wall.position.set(x + 0.5, 1, z + 0.5);
                    this.scene.add(wall);
                    this.objects.push(wall);
                }
            }
        }
    }

    // Clear all level objects
    clear() {
        this.objects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.objects = [];
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
        
        // Return level data object
        return {
            name: "Procedural Level",
            width: width,
            height: height,
            start: { x: startX, z: startZ },
            grid: grid
        };
    }
}