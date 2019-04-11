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
