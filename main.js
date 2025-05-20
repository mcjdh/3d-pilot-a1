/**
 * Main entry point for the game
 */
import { Game } from './src/Game.js';

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('game-container');
    game.start();
});