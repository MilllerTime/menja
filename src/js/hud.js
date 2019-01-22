///////////
// SCORE //
///////////
const scoreNode = document.createElement('div');
scoreNode.classList.add('score-lbl');
document.body.appendChild(scoreNode);

function updateScore(inc) {
	state.game.score += inc;
	scoreNode.innerText = `SCORE: ${state.game.score}`;
}

updateScore(0);


////////////////////
// SLOW-MO STATUS //
////////////////////

const slowmoNode = document.querySelector('.slowmo');
const slowmoBarNode = document.querySelector('.slowmo__bar');

function setSlowmoStatus(percentRemaining) {
	slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
	slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}
