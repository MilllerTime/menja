const scoreNode = document.createElement('div');
scoreNode.classList.add('score-lbl');
document.body.appendChild(scoreNode);

function updateScore(inc) {
	score += inc;
	scoreNode.innerText = `SCORE: ${score}`;
}

updateScore(0);
