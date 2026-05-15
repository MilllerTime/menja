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

function renderMultiShotStatus(percentRemaining) {
	const multiShotNode = $('.multishot');
	if (multiShotNode) {
		multiShotNode.style.opacity = percentRemaining;
	}
}

function showBossHealthBar() {
	const bossHealthNode = $('.boss-health');
	if (bossHealthNode) {
		bossHealthNode.style.display = 'block';
		updateBossHealthDisplay(1);
	}
}

function hideBossHealthBar() {
	const bossHealthNode = $('.boss-health');
	if (bossHealthNode) {
		bossHealthNode.style.display = 'none';
	}
}

function updateBossHealthDisplay(percent) {
	const bossHealthBar = $('.boss-health__bar');
	const bossHealthLbl = $('.boss-health__lbl');
	if (bossHealthBar) {
		bossHealthBar.style.transform = `scaleX(${percent})`;
	}
	if (bossHealthLbl) {
		bossHealthLbl.textContent = `BOSS: ${Math.round(percent * 100)}%`;
	}
}

function showChallengeDisplay() {
	const challengeNode = $('.challenge');
	if (challengeNode) {
		challengeNode.style.display = 'block';
	}
}

function hideChallengeDisplay() {
	const challengeNode = $('.challenge');
	if (challengeNode) {
		challengeNode.style.display = 'none';
	}
}

function updateChallengeDisplay(percentRemaining) {
	const challengeBar = $('.challenge__bar');
	const challengeLbl = $('.challenge__lbl');
	if (challengeBar && activeChallenge) {
		challengeBar.style.transform = `scaleX(${percentRemaining})`;
	}
	if (challengeLbl && activeChallenge) {
		challengeLbl.textContent = `${activeChallenge.type}: ${activeChallenge.progress}/${activeChallenge.target}`;
	}
}

function showChallengeNotification(message) {
	const notificationNode = $('.notification');
	if (notificationNode) {
		notificationNode.textContent = message;
		notificationNode.style.opacity = 1;
		notificationNode.style.display = 'block';
		
		setTimeout(() => {
			notificationNode.style.opacity = 0;
			setTimeout(() => {
				notificationNode.style.display = 'none';
			}, 500);
		}, 2000);
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
