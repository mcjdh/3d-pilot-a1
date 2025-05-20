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
import { HitboxHelper } from './engine/HitboxHelper.js';

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
        
        // Initialize hitbox visualization helper
        this.hitboxHelper = new HitboxHelper(this.core.scene);
        
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
            this.textureLoader,
            this.hitboxHelper
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
            } else if (e.code === 'KeyH') {
                // Toggle hitbox visualization with 'H' key
                const enabled = this.hitboxHelper.toggle();
                this.hud.showMessage(enabled ? "Hitbox visualization enabled" : "Hitbox visualization disabled");
            }
        });
    }
    
    update(deltaTime) {
        // Update level manager (for key/portal interactions)
        this.levelManager.update(deltaTime);
        
        // Set player's colliders to the current level's collidable objects
        if (this.levelManager.levelInstance) {
            this.player.setColliders(this.levelManager.levelInstance.getCollidables());
            
            // Update hitbox visualizations if enabled
            if (this.hitboxHelper.enabled) {
                // Visualize player hitbox
                this.hitboxHelper.createOrUpdateHitboxMesh(
                    this.player.getBoundingBox(), 
                    'player',
                    0x0088ff
                );
                
                // Visualize all collidable hitboxes
                this.levelManager.levelInstance.updateHitboxVisualizations(this.hitboxHelper);
            }
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