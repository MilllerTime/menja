// Special effects handler for power-ups and combos

let freezeRemaining = 0;
let shockwaveActive = false;
let shockwaveRadius = 0;
const shockwaveMaxRadius = 600;
const shockwaveGrowthRate = 15;

// Boss battle system
let bossActive = false;
let bossEntity = null;
let bossHealth = 100;
let bossMaxHealth = 100;
let bossSpawnTimer = 0;
const bossSpawnInterval = 60000; // Spawn boss every 60 seconds
const bossPhaseColors = [RED, PINK, ORANGE];

// Challenge/Quest system
let activeChallenge = null;
let challengeTimer = 0;
const challengeDuration = 30000; // 30 seconds per challenge
const challengeTypes = ['SPEED', 'COMBO', 'SURVIVAL', 'COLOR'];

// Multi-shot power-up
let multiShotActive = false;
let multiShotRemaining = 0;
const multiShotDuration = 5000;
const multiShotCooldown = 15000;

// Dynamic difficulty
let difficultyLevel = 1;
let dynamicSpawnRate = 1;
let dynamicSpeed = 1;

function updateSpecialEffects(simTime) {
	// Update freeze power-up
	if (state.game.powerUps.freeze) {
		freezeRemaining -= simTime;
		if (freezeRemaining <= 0) {
			state.game.powerUps.freeze = false;
			freezeRemaining = 0;
			gameSpeed = 1;
		} else {
			gameSpeed = 0.3;
		}
		renderFreezeStatus(freezeRemaining / freezeDuration);
	}
	
	// Update shockwave cooldown
	if (state.game.cooldowns.shockwave > 0) {
		state.game.cooldowns.shockwave -= simTime;
		if (state.game.cooldowns.shockwave < 0) {
			state.game.cooldowns.shockwave = 0;
		}
		renderShockwaveCooldown(state.game.cooldowns.shockwave / shockwaveCooldown);
	}
	
	// Update active shockwave effect
	if (shockwaveActive) {
		shockwaveRadius += shockwaveGrowthRate * (simTime / 16.6667);
		if (shockwaveRadius >= shockwaveMaxRadius) {
			shockwaveActive = false;
			shockwaveRadius = 0;
		}
	}
	
	// Update multi-shot power-up
	if (multiShotActive) {
		multiShotRemaining -= simTime;
		if (multiShotRemaining <= 0) {
			multiShotActive = false;
			multiShotRemaining = 0;
		}
		renderMultiShotStatus(multiShotRemaining / multiShotDuration);
	}
	
	// Update challenge timer
	if (activeChallenge) {
		challengeTimer -= simTime;
		if (challengeTimer <= 0) {
			completeChallenge();
		} else {
			updateChallengeDisplay(challengeTimer / challengeDuration);
		}
	}
	
	// Update boss battle
	if (bossActive && bossEntity) {
		updateBossBattle(simTime);
	}
	
	// Update dynamic difficulty
	updateDynamicDifficulty(simTime);
}

function activateFreeze() {
	state.game.powerUps.freeze = true;
	freezeRemaining = freezeDuration;
}

function activateShockwave(centerX, centerY) {
	if (state.game.cooldowns.shockwave > 0) return;
	
	shockwaveActive = true;
	shockwaveRadius = 0;
	state.game.cooldowns.shockwave = shockwaveCooldown;
	
	// Apply shockwave effect to all targets
	const shockwaveCenter = { x: centerX / 2, y: centerY / 2 };
	
	targets.forEach(target => {
		const dx = target.x - shockwaveCenter.x;
		const dy = target.y - shockwaveCenter.y;
		const distance = Math.hypot(dx, dy);
		
		if (distance < shockwaveMaxRadius) {
			// Push targets away from center
			const force = (1 - distance / shockwaveMaxRadius) * 30;
			target.xD += (dx / distance) * force;
			target.yD += (dy / distance) * force;
			target.zD += 10;
			
			// Add rotation
			target.rotateXD += random(-0.3, 0.3);
			target.rotateYD += random(-0.3, 0.3);
			target.rotateZD += random(-0.3, 0.3);
		}
	});
}

function triggerShockwaveVisual(x, y) {
	shockwaveActive = true;
	shockwaveRadius = 0;
}

function resetSpecialEffects() {
	freezeRemaining = 0;
	shockwaveActive = false;
	shockwaveRadius = 0;
	state.game.powerUps.freeze = false;
	state.game.powerUps.shockwave = false;
	state.game.cooldowns.shockwave = 0;
	gameSpeed = 1;
	multiShotActive = false;
	multiShotRemaining = 0;
	bossActive = false;
	bossEntity = null;
	bossHealth = 100;
	bossSpawnTimer = 0;
	activeChallenge = null;
	challengeTimer = 0;
	difficultyLevel = 1;
	dynamicSpawnRate = 1;
	dynamicSpeed = 1;
}

// Multi-shot power-up activation
function activateMultiShot() {
	if (multiShotActive) return;
	multiShotActive = true;
	multiShotRemaining = multiShotDuration;
}

// Boss battle system
function spawnBoss() {
	if (bossActive) return;
	
	bossActive = true;
	bossHealth = bossMaxHealth + (difficultyLevel * 20);
	bossMaxHealth = bossHealth;
	
	// Create boss entity (larger, stronger cube)
	const bossModel = optimizeModel(makeRecursiveCubeModel({
		recursionLevel: 2,
		splitFn: mengerSpongeSplit,
		scale: targetRadius * 2.5
	}));
	
	bossEntity = new Entity({
		model: bossModel,
		color: bossPhaseColors[0],
		wireframe: false
	});
	
	bossEntity.x = 0;
	bossEntity.y = -100;
	bossEntity.z = 0;
	bossEntity.health = bossHealth;
	bossEntity.maxHealth = bossMaxHealth;
	bossEntity.blockType = BLOCK_TYPE_BOSS;
	bossEntity.phase = 0;
	
	showBossHealthBar();
	showChallengeNotification('BOSS BATTLE!');
}

function updateBossBattle(simTime) {
	if (!bossEntity) return;
	
	// Boss movement pattern
	bossEntity.x += Math.sin(state.game.time / 500) * 3 * (simTime / 16.6667);
	bossEntity.y += Math.cos(state.game.time / 700) * 2 * (simTime / 16.6667);
	bossEntity.rotateY += 0.02 * (simTime / 16.6667);
	bossEntity.transform();
	bossEntity.project();
	
	// Update boss health display
	updateBossHealthDisplay(bossHealth / bossMaxHealth);
	
	// Check boss defeat
	if (bossHealth <= 0) {
		defeatBoss();
	}
}

function defeatBoss() {
	bossActive = false;
	bossEntity = null;
	
	// Big reward
	const reward = 500 * difficultyLevel;
	incrementScore(reward);
	showChallengeNotification(`BOSS DEFEATED! +${reward} PTS`);
	
	// Drop multiple power-ups
	for (let i = 0; i < 5; i++) {
		setTimeout(() => {
			const randomPowerup = Math.random() > 0.5 ? BLOCK_TYPE_POWERUP_FREEZE : BLOCK_TYPE_POWERUP_SHOCKWAVE;
			// Would need to spawn as collectible
		}, i * 200);
	}
	
	hideBossHealthBar();
	difficultyLevel++;
}

// Challenge system
function startRandomChallenge() {
	const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
	activeChallenge = {
		type: challengeType,
		target: 0,
		progress: 0
	};
	challengeTimer = challengeDuration;
	
	switch(challengeType) {
		case 'SPEED':
			activeChallenge.target = 15; // Smash 15 cubes
			showChallengeNotification('SPEED CHALLENGE: Smash 15 cubes!');
			break;
		case 'COMBO':
			activeChallenge.target = 10; // Get 10x combo
			showChallengeNotification('COMBO CHALLENGE: Get 10x combo!');
			break;
		case 'SURVIVAL':
			activeChallenge.target = 20; // Survive 20 seconds
			showChallengeNotification('SURVIVAL: Don\'t miss for 20s!');
			break;
		case 'COLOR':
			activeChallenge.target = 5; // Smash 5 colored blocks
			showChallengeNotification('COLOR CHALLENGE: Smash 5 special blocks!');
			break;
	}
	
	showChallengeDisplay();
}

function updateChallengeProgress(amount) {
	if (!activeChallenge) return;
	
	activeChallenge.progress += amount;
	updateChallengeDisplay(activeChallenge.progress / activeChallenge.target);
	
	if (activeChallenge.progress >= activeChallenge.target) {
		completeChallenge();
	}
}

function completeChallenge() {
	const rewards = {
		SPEED: 100,
		COMBO: 150,
		SURVIVAL: 120,
		COLOR: 80
	};
	
	const reward = rewards[activeChallenge?.type] || 50;
	incrementScore(reward * difficultyLevel);
	showChallengeNotification(`CHALLENGE COMPLETE! +${reward} PTS`);
	
	activeChallenge = null;
	hideChallengeDisplay();
	
	// Start next challenge after delay
	setTimeout(() => {
		if (isInGame() && !bossActive) {
			startRandomChallenge();
		}
	}, 5000);
}

// Dynamic difficulty system
function updateDynamicDifficulty(simTime) {
	// Increase difficulty based on score
	const newDifficulty = 1 + Math.floor(state.game.score / 1000);
	if (newDifficulty !== difficultyLevel) {
		difficultyLevel = newDifficulty;
		showChallengeNotification(`DIFFICULTY: ${difficultyLevel}`);
	}
	
	// Adjust spawn rate and speed based on difficulty
	dynamicSpawnRate = 1 - (Math.min(difficultyLevel, 10) * 0.05);
	dynamicSpeed = 1 + (Math.min(difficultyLevel, 5) * 0.1);
}

// Combo system
function updateCombo(simTime) {
	if (state.game.combo > 0) {
		state.game.lastHitTime += simTime;
		if (state.game.lastHitTime > comboWindow) {
			// Combo expired
			state.game.combo = 0;
			state.game.comboMultiplier = 1;
		}
	}
	renderComboDisplay();
}

function addComboHit() {
	if (isInGame()) {
		state.game.combo++;
		state.game.lastHitTime = 0;
		
		// Calculate multiplier (max 5x)
		state.game.comboMultiplier = Math.min(
			1 + Math.floor(state.game.combo / 5),
			maxComboMultiplier
		);
		
		renderComboDisplay();
	}
}

function getComboBonus(baseScore) {
	return baseScore * state.game.comboMultiplier;
}

function resetCombo() {
	state.game.combo = 0;
	state.game.lastHitTime = 0;
	state.game.comboMultiplier = 1;
}
