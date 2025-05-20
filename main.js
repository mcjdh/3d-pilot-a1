import { LEVELS, getLevelData } from './levels/levels.js';

// Basic WASD and mouse controls
let camera, scene, renderer, controls, player;
let currentLevel = 0;

const move = { forward: false, backward: false, left: false, right: false };
let velocity = { x: 0, z: 0 };
const speed = 4; // units per second

function init() {
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game-container').appendChild(renderer.domElement);

  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(1, 1.6, 1);

  // Player
  player = new THREE.Object3D();
  player.position.set(1, 1.6, 1);
  scene.add(player);
  player.add(camera);

  // Mouse look
  let pointerLocked = false;
  const onPointerLockChange = () => {
    pointerLocked = !!document.pointerLockElement;
    document.getElementById('instructions').style.display = pointerLocked ? 'none' : '';
  };
  document.body.addEventListener('click', () => {
    if (!pointerLocked) renderer.domElement.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', onPointerLockChange);

  let pitch = 0, yaw = 0;
  document.addEventListener('mousemove', (e) => {
    if (!pointerLocked) return;
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    player.rotation.y = yaw;
    camera.rotation.x = pitch;
  });

  // Controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW') move.forward = true;
    if (e.code === 'KeyS') move.backward = true;
    if (e.code === 'KeyA') move.left = true;
    if (e.code === 'KeyD') move.right = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') move.forward = false;
    if (e.code === 'KeyS') move.backward = false;
    if (e.code === 'KeyA') move.left = false;
    if (e.code === 'KeyD') move.right = false;
  });

  loadLevel(currentLevel);
  animate();
}

function loadLevel(levelIdx) {
  // Clear scene except player/camera
  while (scene.children.length > 1) scene.remove(scene.children[1]);

  // Load level data
  const level = getLevelData(levelIdx);
  document.getElementById('level-info').textContent = `Level ${levelIdx + 1}: ${level.name}`;

  // Simple ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(level.width, level.height),
    new THREE.MeshBasicMaterial({ color: 0x20232a })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Walls from grid
  for (let z = 0; z < level.grid.length; z++) {
    for (let x = 0; x < level.grid[z].length; x++) {
      if (level.grid[z][x] === 1) {
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(1, 2, 1),
          new THREE.MeshBasicMaterial({ color: 0xeee })
        );
        wall.position.set(x + 0.5, 1, z + 0.5);
        scene.add(wall);
      }
    }
  }

  // Set player start
  player.position.set(level.start.x + 0.5, 1.6, level.start.z + 0.5);
}

function animate() {
  requestAnimationFrame(animate);

  // Movement
  let dirX = 0, dirZ = 0;
  if (move.forward) dirZ -= 1;
  if (move.backward) dirZ += 1;
  if (move.left) dirX -= 1;
  if (move.right) dirX += 1;
  if (dirX !== 0 || dirZ !== 0) {
    const angle = player.rotation.y;
    const dx = (dirX * Math.cos(angle) - dirZ * Math.sin(angle)) * speed * 0.016;
    const dz = (dirX * Math.sin(angle) + dirZ * Math.cos(angle)) * speed * 0.016;
    player.position.x += dx;
    player.position.z += dz;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Boot
init();