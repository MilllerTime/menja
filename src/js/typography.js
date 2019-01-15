const scoreNode = document.createElement('div');
scoreNode.classList.add('score-lbl');
document.body.appendChild(scoreNode);

function updateScore(inc) {
	state.game.score += inc;
	scoreNode.innerText = `SCORE: ${state.game.score}`;
}

updateScore(0);
