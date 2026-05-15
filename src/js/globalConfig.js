// This file is run first, and provides global variables used by the entire program.
// Most of this should be configuration.

// Timing multiplier for entire game engine.
let gameSpeed = 1;

// Colors
const BLUE =   { r: 0x67, g: 0xd7, b: 0xf0 };
const GREEN =  { r: 0xa6, g: 0xe0, b: 0x2c };
const PINK =   { r: 0xfa, g: 0x24, b: 0x73 };
const ORANGE = { r: 0xfe, g: 0x95, b: 0x22 };
const YELLOW = { r: 0xff, g: 0xd7, b: 0x00 };
const PURPLE = { r: 0x9b, g: 0x59, b: 0xb6 };
const RED =    { r: 0xe7, g: 0x4c, b: 0x3c };
const allColors = [BLUE, GREEN, PINK, ORANGE];

// Gameplay
const getSpawnDelay = () => {
	const spawnDelayMax = 1400;
	const spawnDelayMin = 550;
	const spawnDelay = spawnDelayMax - state.game.cubeCount * 3.1;
	return Math.max(spawnDelay, spawnDelayMin);
}
const doubleStrongEnableScore = 2000;
// Number of cubes that must be smashed before activating a feature.
const slowmoThreshold = 10;
const strongThreshold = 25;
const spinnerThreshold = 25;
const bombThreshold = 15;
const coinThreshold = 5;
const powerupThreshold = 30;

// Combo system
const comboWindow = 2000; // ms to maintain combo
const maxComboMultiplier = 5;

// Power-up durations
const freezeDuration = 3000;
const shockwaveCooldown = 8000;

// Special block types
const BLOCK_TYPE_NORMAL = Symbol('BLOCK_TYPE_NORMAL');
const BLOCK_TYPE_STRONG = Symbol('BLOCK_TYPE_STRONG');
const BLOCK_TYPE_WIREFRAME = Symbol('BLOCK_TYPE_WIREFRAME');
const BLOCK_TYPE_SPINNER = Symbol('BLOCK_TYPE_SPINNER');
const BLOCK_TYPE_BOMB = Symbol('BLOCK_TYPE_BOMB');
const BLOCK_TYPE_COIN = Symbol('BLOCK_TYPE_COIN');
const BLOCK_TYPE_POWERUP_FREEZE = Symbol('BLOCK_TYPE_POWERUP_FREEZE');
const BLOCK_TYPE_POWERUP_SHOCKWAVE = Symbol('BLOCK_TYPE_POWERUP_SHOCKWAVE');

// Interaction state
let pointerIsDown = false;
// The last known position of the primary pointer in screen coordinates.`
let pointerScreen = { x: 0, y: 0 };
// Same as `pointerScreen`, but converted to scene coordinates in rAF.
let pointerScene = { x: 0, y: 0 };
// Minimum speed of pointer before "hits" are counted.
const minPointerSpeed = 60;
// The hit speed affects the direction the target post-hit. This number dampens that force.
const hitDampening = 0.1;
// Backboard receives shadows and is the farthest negative Z position of entities.
const backboardZ = -400;
const shadowColor = '#262e36';
// How much air drag is applied to standard objects
const airDrag = 0.022;
const gravity = 0.3;
// Spark config
const sparkColor = 'rgba(170,221,255,.9)';
const sparkThickness = 2.2;
const airDragSpark = 0.1;
// Track pointer positions to show trail
const touchTrailColor = 'rgba(170,221,255,.62)';
const touchTrailThickness = 7;
const touchPointLife = 120;
const touchPoints = [];
// Size of in-game targets. This affects rendered size and hit area.
const targetRadius = 40;
const targetHitRadius = 50;
const makeTargetGlueColor = target => {
	// const alpha = (target.health - 1) / (target.maxHealth - 1);
	// return `rgba(170,221,255,${alpha.toFixed(3)})`;
	return 'rgb(170,221,255)';
};
// Size of target fragments
const fragRadius = targetRadius / 3;



// Game canvas element needed in setup.js and interaction.js
const canvas = document.querySelector('#c');

// 3D camera config
// Affects perspective
const cameraDistance = 900;
// Does not affect perspective
const sceneScale = 1;
// Objects that get too close to the camera will be faded out to transparent over this range.
// const cameraFadeStartZ = 0.8*cameraDistance - 6*targetRadius;
const cameraFadeStartZ = 0.45*cameraDistance;
const cameraFadeEndZ = 0.65*cameraDistance;
const cameraFadeRange = cameraFadeEndZ - cameraFadeStartZ;

// Globals used to accumlate all vertices/polygons in each frame
const allVertices = [];
const allPolys = [];
const allShadowVertices = [];
const allShadowPolys = [];
