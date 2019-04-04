///////////
// SCORE //
///////////
const scoreNode = $('.score-lbl');

function updateScore(inc) {
	state.game.score += inc;
	scoreNode.innerText = `SCORE: ${state.game.score}`;
}

updateScore(0);

function updateCubeCount(inc) {
	state.game.cubeCount += inc;
}


////////////////////
// SLOW-MO STATUS //
////////////////////

const slowmoNode = $('.slowmo');
const slowmoBarNode = $('.slowmo__bar');

function setSlowmoStatus(percentRemaining) {
	slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
	slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}
