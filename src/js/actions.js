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
