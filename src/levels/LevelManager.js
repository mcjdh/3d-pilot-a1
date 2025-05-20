/**
 * Level Manager for loading and managing game levels
 */
import { Level } from './Level.js';

export class LevelManager {
    constructor(scene, player, hud, particleSystem, textureLoader) {
        this.scene = scene;
        this.player = player;
        this.hud = hud;
        this.particleSystem = particleSystem;
        this.textureLoader = textureLoader;
        this.currentLevel = 0;
        this.levelInstance = new Level(scene, particleSystem, textureLoader);
        this.levels = [];
        this.keysCollected = 0;
    }
    
    // Initialize with level data
    init(levelsData) {
        this.levels = levelsData;
    }
    
    // Load a specific level by index
    loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.levels.length) {
            console.error("Invalid level index:", levelIndex);
            return false;
        }
        
        // Store current level index
        this.currentLevel = levelIndex;
        
        // Get level data
        const levelData = this.levels[levelIndex];
        
        // Update HUD with level information
        this.hud.updateLevelInfo(levelIndex, levelData.name);
        
        // Reset keys collected
        this.keysCollected = 0;
        this.updateKeyDisplay();
        
        // Load level and get player start position
        const startPos = this.levelInstance.load(levelData);
        
        // Position player at start position
        this.player.setPosition(startPos.x, startPos.y, startPos.z);
        
        return true;
    }
    
    // Load the next level
    loadNextLevel() {
        return this.loadLevel(this.currentLevel + 1);
    }
    
    // Load the previous level
    loadPreviousLevel() {
        return this.loadLevel(this.currentLevel - 1);
    }
    
    // Get current level data
    getCurrentLevelData() {
        return this.levels[this.currentLevel];
    }
    
    // Load a procedurally generated level
    loadProceduralLevel(width = 15, height = 15, complexity = 0.3) {
        const levelData = Level.generateProceduralLevel(width, height, complexity);
        
        // Add to levels array for tracking
        this.levels.push(levelData);
        this.currentLevel = this.levels.length - 1;
        
        // Reset keys collected
        this.keysCollected = 0;
        this.updateKeyDisplay();
        
        // Load the level
        const startPos = this.levelInstance.load(levelData);
        
        // Update HUD
        this.hud.updateLevelInfo(this.currentLevel, levelData.name);
        
        // Position player
        this.player.setPosition(startPos.x, startPos.y, startPos.z);
        
        return true;
    }
    
    // Update the level state
    update(deltaTime) {
        if (this.levelInstance) {
            this.levelInstance.update(deltaTime);
            
            // Check for player collisions with keys
            if (this.player.getBoundingBox) {
                const playerBox = this.player.getBoundingBox();
                
                // Check key collisions
                if (this.levelInstance.checkKeyCollisions(playerBox)) {
                    this.keysCollected++;
                    this.updateKeyDisplay();
                    
                    // Show message about key collection
                    this.hud.showMessage("Key collected! " + 
                        (this.levelInstance.getRemainingKeyCount() === 0 ? 
                         "Portal activated!" : 
                         this.levelInstance.getRemainingKeyCount() + " remaining"));
                    
                    // If all keys collected, show message about portal
                    if (this.levelInstance.getRemainingKeyCount() === 0) {
                        setTimeout(() => {
                            this.hud.showMessage("Find the portal to proceed to the next level!", 4000);
                        }, 2000);
                    }
                }
                
                // Check portal collisions
                if (this.levelInstance.checkPortalCollision(playerBox)) {
                    // Show portal used message
                    this.hud.showMessage("Portal used! Moving to next level...", 2000);
                    
                    // Load next level after delay
                    setTimeout(() => {
                        this.loadNextLevel();
                    }, 1500);
                }
            }
        }
    }
    
    // Update the key count display in the HUD
    updateKeyDisplay() {
        const remaining = this.levelInstance ? this.levelInstance.getRemainingKeyCount() : 0;
        const total = this.levelInstance ? this.levelInstance.getTotalKeyCount() : 0;
        
        if (this.hud.updateKeyInfo) {
            this.hud.updateKeyInfo(total - remaining, total);
        }
    }
}