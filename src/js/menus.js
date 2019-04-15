// Top-level menu containers
const menuContainerNode = $('.menus');
const menuMainNode = $('.menu--main');
const menuPauseNode = $('.menu--pause');
const menuScoreNode = $('.menu--score');

const finalScoreLblNode = $('.final-score-lbl');



function showMenu(node) {
	node.classList.add('active');
}

function hideMenu(node) {
	node.classList.remove('active');
}

function renderMenus() {
	hideMenu(menuMainNode);
	hideMenu(menuPauseNode);
	hideMenu(menuScoreNode);

	switch (state.menus.active) {
		case MENU_MAIN:
			showMenu(menuMainNode);
			break;
		case MENU_PAUSE:
			showMenu(menuPauseNode);
			break;
		case MENU_SCORE:
			finalScoreLblNode.textContent = state.game.score;
			showMenu(menuScoreNode);
			break;
	}

	setHudVisibility(!state.menus.active);
	menuContainerNode.classList.toggle('has-active', state.menus.active);
}

renderMenus();



////////////////////
// Button Actions //
////////////////////

// Main Menu
handleClick($('.play-normal-btn'), () => {
	setGameMode(GAME_MODE_RANKED);
	resetGame();
	setActiveMenu(null);
});

handleClick($('.play-casual-btn'), () => {
	setGameMode(GAME_MODE_CASUAL);
	resetGame();
	setActiveMenu(null);
});

// Pause Menu
handleClick($('.resume-btn'), () => resumeGame());
handleClick($('.menu-btn--pause'), () => setActiveMenu(MENU_MAIN));

// Score Menu
handleClick($('.play-again-btn'), () => {
	resetGame();
	setActiveMenu(null);
});

handleClick($('.menu-btn--score'), () => setActiveMenu(MENU_MAIN));
