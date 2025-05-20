/**
 * Core engine module for handling scene, renderer, and game loop
 */
export class Core {
    constructor(containerId) {
        this.entities = [];
        this.updateCallbacks = [];
        this.setupRenderer(containerId);
        this.setupScene();
        this.setupEventListeners();
    }

    setupRenderer(containerId) {
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById(containerId).appendChild(this.renderer.domElement);
    }

    setupScene() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    }

    setupEventListeners() {
        // Window resize handling
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    addEntity(entity) {
        this.entities.push(entity);
        if (entity.object) {
            this.scene.add(entity.object);
        }
        return entity;
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            if (entity.object) {
                this.scene.remove(entity.object);
            }
        }
    }

    registerUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    update(deltaTime) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
        
        // Call any registered update callbacks
        this.updateCallbacks.forEach(callback => {
            callback(deltaTime);
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        let lastTime = 0;
        
        const gameLoop = (timestamp) => {
            const deltaTime = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            // Update game state
            this.update(deltaTime);
            
            // Render frame
            this.render();
            
            // Queue next frame
            requestAnimationFrame(gameLoop);
        };
        
        // Start the game loop
        requestAnimationFrame(gameLoop);
    }
}