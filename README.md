# 3D Pilot A1

A minimalist first-person 3D game engine prototype, optimized for the web (HTML/JS/CSS) using Three.js. Features WASD controls, mouse look, and simple grid-based levels that chain together for a progression campaign.

## Controls

- **WASD:** Move (forward, left, backward, right)
- **Mouse:** Look around (click to lock pointer)
- **Esc:** Release mouse pointer

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

- Edit `levels/levels.js`.
- Add new entries to the `LEVELS` array.
    - Each level is an object with `name`, `width`, `height`, `start`, and `grid` (2D array: 1=wall, 0=floor).
    - Example included in the file.
- The game automatically loads levels in order.

---

Minimal starter project for experimentation, learning, and prototyping.