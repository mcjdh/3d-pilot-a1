/**
 * Level Manager for loading and managing game levels
 */
import { Level } from './Level.js';

export class LevelManager {
    constructor(scene, player, hud) {
        this.scene = scene;
        this.player = player;
        this.hud = hud;
        this.currentLevel = 0;
        this.levelInstance = new Level(scene);
        this.levels = [];
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
        
        // Load the level
        const startPos = this.levelInstance.load(levelData);
        
        // Update HUD
        this.hud.updateLevelInfo(this.currentLevel, levelData.name);
        
        // Position player
        this.player.setPosition(startPos.x, startPos.y, startPos.z);
        
        return true;
    }
}