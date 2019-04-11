const hudContainerNode = $('.hud');

function showHud() {
	hudContainerNode.style.display = 'block';
}

function hideHud() {
	hudContainerNode.style.display = 'none';
}


///////////
// Score //
///////////
const scoreNode = $('.score-lbl');

function renderScoreHud() {
	scoreNode.innerText = `SCORE: ${state.game.score}`;
}

renderScoreHud();


//////////////////
// Pause Button //
//////////////////

handleClick($('.pause-btn'), () => pauseGame());


////////////////////
// Slow-Mo Status //
////////////////////

const slowmoNode = $('.slowmo');
const slowmoBarNode = $('.slowmo__bar');

function renderSlowmoStatus(percentRemaining) {
	slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
	slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}
