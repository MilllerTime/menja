//////////////////
// MENU ACTIONS //
//////////////////

function setActiveMenu(menu) {
	state.menus.active = menu;
	renderMenus();
}


/////////////////
// HUD ACTIONS //
/////////////////

function setScore(score) {
	state.game.score = score;
	renderScoreHud();
}

function incrementScore(inc) {
	state.game.score += inc;
	if (state.game.score < 0) {
		state.game.score = 0;
	}
	renderScoreHud();
}

function setCubeCount(count) {
	state.game.cubeCount = count;
}

function incrementCubeCount(inc) {
	state.game.cubeCount += inc;
}


//////////////////
// GAME ACTIONS //
//////////////////

function setGameMode(mode) {
	state.game.mode = mode;
}

function resetGame() {
	resetAllTargets();
	setScore(0);
	setCubeCount(0);
}

function pauseGame() {
	isInGame() && setActiveMenu(MENU_PAUSE);
}

function resumeGame() {
	isPaused() && setActiveMenu(null);
}




////////////////////////
// KEYBOARD SHORTCUTS //
////////////////////////

window.addEventListener('keydown', event => {
	if (event.key === 'p') {
		isPaused() ? resumeGame() : pauseGame();
	}
});
