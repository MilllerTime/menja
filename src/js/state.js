///////////
// Enums //
///////////

// Game Modes
const GAME_MODE_RANKED = Symbol('GAME_MODE_RANKED');
const GAME_MODE_CASUAL = Symbol('GAME_MODE_CASUAL');

// Available Menus
const MENU_MAIN = Symbol('MENU_MAIN');
const MENU_PAUSE = Symbol('MENU_PAUSE');
const MENU_SCORE = Symbol('MENU_SCORE');



//////////////////
// Global State //
//////////////////

const state = {
	game: {
		mode: GAME_MODE_RANKED,
		// Run time of current game.
		time: 0,
		// Player score.
		score: 0,
		// Total number of cubes smashed in game.
		cubeCount: 0,
		// Current combo count.
		combo: 0,
		// Time of last hit (for combo tracking).
		lastHitTime: 0,
		// Combo multiplier.
		comboMultiplier: 1,
		// Active power-ups.
		powerUps: {
			freeze: false,
			shockwave: false
		},
		// Cooldowns.
		cooldowns: {
			shockwave: 0
		}
	},
	menus: {
		// Set to `null` to hide all menus
		active: MENU_MAIN
	}
};


////////////////////////////
// Global State Selectors //
////////////////////////////

const isInGame = () => !state.menus.active;
const isMenuVisible = () => !!state.menus.active;
const isCasualGame = () => state.game.mode === GAME_MODE_CASUAL;
const isPaused = () => state.menus.active === MENU_PAUSE;


///////////////////
// Local Storage //
///////////////////

const highScoreKey = '__menja__highScore';
const getHighScore = () => {
	const raw = localStorage.getItem(highScoreKey);
	return raw ? parseInt(raw, 10) : 0;
};

let _lastHighscore = getHighScore();
const setHighScore = score => {
	_lastHighscore = getHighScore();
	localStorage.setItem(highScoreKey, String(score));
};

const isNewHighScore = () => state.game.score > _lastHighscore;
