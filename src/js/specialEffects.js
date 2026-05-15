// Special effects handler for power-ups and combos

let freezeRemaining = 0;
let shockwaveActive = false;
let shockwaveRadius = 0;
const shockwaveMaxRadius = 600;
const shockwaveGrowthRate = 15;

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
