/**
 * Main Game class that initializes and connects all game systems
 */
import { Core } from './engine/Core.js';
import { InputSystem } from './engine/Input.js';
import { Player } from './entities/Player.js';
import { LevelManager } from './levels/LevelManager.js';
import { HUD } from './ui/HUD.js';
import { LEVELS } from './levels/LevelData.js';

export class Game {
    constructor(containerId) {
        // Initialize core engine
        this.core = new Core(containerId);
        
        // Initialize input system
        this.input = new InputSystem();
        
        // Initialize HUD
        this.hud = new HUD();
        
        // Initialize player
        this.player = new Player(this.input, this.core.camera);
        this.core.addEntity(this.player);
        
        // Initialize level manager
        this.levelManager = new LevelManager(this.core.scene, this.player, this.hud);
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
    
    start() {
        // Load the first level
        this.levelManager.loadLevel(0);
        
        // Start the game loop
        this.core.start();
        
        // Display welcome message
        this.hud.showMessage("Game started! WASD to move, mouse to look", 5000);
    }
}