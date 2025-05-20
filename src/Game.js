/**
 * Main Game class that initializes and connects all game systems
 */
import { Core } from './engine/Core.js';
import { InputSystem } from './engine/Input.js';
import { Player } from './entities/Player.js';
import { LevelManager } from './levels/LevelManager.js';
import { HUD } from './ui/HUD.js';
import { LEVELS } from './levels/LevelData.js';
import { TextureLoader } from './engine/TextureLoader.js';
import { ParticleSystem } from './engine/ParticleSystem.js';

export class Game {
    constructor(containerId) {
        // Initialize core engine
        this.core = new Core(containerId);
        
        // Initialize input system
        this.input = new InputSystem();
        
        // Initialize texture loader
        this.textureLoader = new TextureLoader();
        
        // Initialize particle system
        this.particleSystem = new ParticleSystem(this.core.scene);
        this.core.addEntity(this.particleSystem);
        
        // Initialize HUD
        this.hud = new HUD();
        
        // Initialize player
        this.player = new Player(this.input, this.core.camera);
        this.core.addEntity(this.player);
        
        // Initialize level manager
        this.levelManager = new LevelManager(
            this.core.scene, 
            this.player, 
            this.hud, 
            this.particleSystem, 
            this.textureLoader
        );
        this.levelManager.init(LEVELS);
        
        // Setup event listeners for game-specific controls
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Example: level switching (for demonstration)
        document.addEventListener('keydown', (e) => {
            // Page Up/Down to switch levels
            if (e.code === 'PageUp') {
                this.levelManager.loadNextLevel();
            } else if (e.code === 'PageDown') {
                this.levelManager.loadPreviousLevel();
            } else if (e.code === 'KeyP') {
                // Generate a procedural level with 'P' key
                this.levelManager.loadProceduralLevel();
                this.hud.showMessage("Generated procedural level");
            }
        });
    }
    
    update(deltaTime) {
        // Update level manager (for key/portal interactions)
        this.levelManager.update(deltaTime);
        
        // Set player's colliders to the current level's collidable objects
        if (this.levelManager.levelInstance) {
            this.player.setColliders(this.levelManager.levelInstance.getCollidables());
        }
    }
    
    start() {
        // Load the first level
        this.levelManager.loadLevel(0);
        
        // Register the game update function with the core
        this.core.registerUpdateCallback((deltaTime) => this.update(deltaTime));
        
        // Start the game loop
        this.core.start();
        
        // Display welcome message
        this.hud.showMessage("Game started! WASD to move, mouse to look. Collect keys to open portals!", 5000);
    }
}