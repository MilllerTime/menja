const hudContainerNode = $('.hud');

function setHudVisibility(visible) {
	if (visible) {
		hudContainerNode.style.display = 'block';
	} else {
		hudContainerNode.style.display = 'none';
	}
}


///////////
// Score //
///////////
const scoreNode = $('.score-lbl');
const cubeCountNode = $('.cube-count-lbl');
const comboNode = $('.combo-lbl');

function renderScoreHud() {
	if (isCasualGame()) {
		scoreNode.style.display = 'none';
		cubeCountNode.style.opacity = 1;
	} else {
		scoreNode.innerText = `SCORE: ${state.game.score}`;
		scoreNode.style.display = 'block';
		cubeCountNode.style.opacity = 0.65 ;
	}
	cubeCountNode.innerText = `CUBES SMASHED: ${state.game.cubeCount}`;
}

renderScoreHud();

function renderComboDisplay() {
	if (state.game.combo > 1 && isInGame()) {
		comboNode.textContent = `${state.game.combo}x COMBO (${state.game.comboMultiplier}x)`;
		comboNode.style.opacity = 1;
	} else {
		comboNode.style.opacity = 0;
	}
}

function renderFreezeStatus(percentRemaining) {
	const freezeNode = $('.freeze');
	if (freezeNode) {
		freezeNode.style.opacity = percentRemaining;
	}
}

function renderShockwaveCooldown(percentRemaining) {
	const shockwaveNode = $('.shockwave-cd');
	if (shockwaveNode) {
		shockwaveNode.style.opacity = percentRemaining > 0 ? 1 : 0;
		shockwaveNode.style.transform = `scaleX(${percentRemaining})`;
	}
}


//////////////////
// Pause Button //
//////////////////

handlePointerDown($('.pause-btn'), () => pauseGame());


////////////////////
// Slow-Mo Status //
////////////////////

const slowmoNode = $('.slowmo');
const slowmoBarNode = $('.slowmo__bar');

function renderSlowmoStatus(percentRemaining) {
	slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
	slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}
