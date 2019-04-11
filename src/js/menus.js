// Top-level menu containers
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

	if (state.menus.active) {
		hideHud();
	} else {
		showHud();
	}
}

renderMenus();



////////////////////
// Button Actions //
////////////////////

// Main Menu
handleClick($('.play-normal-btn'), () => {
	resetGame();
	setActiveMenu(null);
});

handleClick($('.play-casual-btn'), () => {

});

// Pause Menu
handleClick($('.resume-btn'), () => {
	resumeGame();
});

handleClick($('.menu-btn--pause'), () => {
	setActiveMenu(MENU_MAIN);
});


handleClick($('.play-again-btn'), () => {
	resetGame();
	setActiveMenu(null);
});

handleClick($('.menu-btn--score'), () => {
	setActiveMenu(MENU_MAIN);
});
