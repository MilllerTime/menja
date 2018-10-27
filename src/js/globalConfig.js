// This file is run first, and provides global variables used by the entire program.
// Most of this should be configuration.

// Timing multiplier for entire game engine.
let gameSpeed = 1;

// Interaction state
let pointerIsDown = false;
// The last known position of the primary pointer in screen coordinates.`
let pointerScreen = { x: 0, y: 0 };
// Same as `pointerScreen`, but converted to scene coordinates in rAF.
let pointerScene = { x: 0, y: 0 };
// Minimum speed of pointer before "hits" are counted.
const minPointerSpeed = 10;
// The hit speed affects the direction the target post-hit. This number dampens that force.
const hitDampening = 0.1;
// Track pointer positions to show trail
const touchTrailColor = 'rgba(170, 221, 255, 0.62)';
const touchTrailThickness = 7;
const touchPointLife = 120;
const touchPoints = [];
// Size of in-game targets. This affects rendered size and hit area.
const targetRadius = 40;
const targetHitRadius = 50;
const targetHues = [16, 150, 192, 268, 348];


// Game canvas element needed in setup.js and interaction.js
const canvas = document.querySelector('#c');

// 3D camera config
// Affects perspective
const cameraDistance = 600;
// Does not affect perspective
const sceneScale = 1;

// Globals used to accumlate all vertices/polygons in each frame
const allVertices = [];
const allPolys = [];
