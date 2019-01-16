// Enums
const GAME_MODE_RANKED = Symbol('GAME_MODE_RANKED');
const GAME_MODE_CASUAL = Symbol('GAME_MODE_CASUAL');

const state = {
	game: {
		mode: GAME_MODE_RANKED,
		// Run time of current game.
		time: 0,
		score: 0
	}
};
