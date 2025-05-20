# 3D Pilot A1

A minimalist first-person 3D game engine prototype, optimized for the web (HTML/JS/CSS) using Three.js. Features WASD controls, mouse look, and simple grid-based levels that chain together for a progression campaign.

## Controls

- **WASD:** Move (forward, left, backward, right)
- **Mouse:** Look around (click to lock pointer)
- **Esc:** Release mouse pointer
- **P:** Generate a procedural level (new feature)
- **Page Up/Down:** Switch between levels (new feature)
- **H:** Toggle hitbox visualization (debug mode)

## How to Run Locally

1. Clone the repository:
    ```
    git clone https://github.com/mcjdh/3d-pilot-a1.git
    cd 3d-pilot-a1
    ```
2. Serve the files using a local web server (required for ES modules and file access), e.g.:
    ```
    npx serve .
    ```
   Or use Python:
    ```
    python3 -m http.server
    ```
3. Open your browser to `http://localhost:5000` (or whatever port your server uses).

## How to Add New Levels

- Edit `src/levels/LevelData.js`.
- Add new entries to the `LEVELS` array.
    - Each level is an object with `name`, `width`, `height`, `start`, and `grid` (2D array: 1=wall, 0=floor).
    - Example included in the file.
- The game automatically loads levels in order.

## Project Structure

The engine is designed to be highly modular, making it easy to extend with new features:

```
/src
  /engine      - Core engine components (rendering, input, game loop)
  /entities    - Game entities like the player
  /levels      - Level system and procedural generation
  /ui          - Heads-up display and user interface
```

## Adding New Features

The modular architecture makes it easy to extend:

1. **New Entity Types**: Create new classes in `/src/entities/` and register them with the core.
2. **New Level Types**: Extend the Level class in `/src/levels/Level.js` or create procedural generators.
3. **New UI Elements**: Add components to the HUD class in `/src/ui/HUD.js`.

## Debugging Features

The game includes built-in debugging tools to help with development:

- **Hitbox Visualization**: Press 'H' to toggle wireframe visualization of collision hitboxes
- **Color Coding**: Different entity types have different colored hitboxes:
  - Player: Blue
  - Walls: Red
  - Keys: Yellow
  - Portal: Blue/Purple

These debug features help identify collision issues and understand the game's spatial relationships.

---

Minimal starter project for experimentation, learning, and prototyping.