// All active targets
const targets = [];

// Pool target instances by color, using a Map.
// keys are color objects, and values are arrays of targets.
// Also pool wireframe instances separately.
const targetPool = new Map(allColors.map(c=>([c, []])));
const targetWireframePool = new Map(allColors.map(c=>([c, []])));
const targetYellowPool = new Map([ [YELLOW, []] ]);
const targetPurplePool = new Map([ [PURPLE, []] ]);
const targetRedPool = new Map([ [RED, []] ]);



const getTarget = (() => {

	const slowmoSpawner = makeSpawner({
		chance: 0.5,
		cooldownPerSpawn: 10000,
		maxSpawns: 1
	});

	let doubleStrong = false;
	const strongSpawner = makeSpawner({
		chance: 0.3,
		cooldownPerSpawn: 12000,
		maxSpawns: 1
	});

	const spinnerSpawner = makeSpawner({
		chance: 0.1,
		cooldownPerSpawn: 10000,
		maxSpawns: 1
	});

	const bombSpawner = makeSpawner({
		chance: 0.4,
		cooldownPerSpawn: 8000,
		maxSpawns: 1
	});

	const coinSpawner = makeSpawner({
		chance: 0.6,
		cooldownPerSpawn: 5000,
		maxSpawns: 1
	});

	const freezePowerupSpawner = makeSpawner({
		chance: 0.2,
		cooldownPerSpawn: 15000,
		maxSpawns: 1
	});

	const shockwavePowerupSpawner = makeSpawner({
		chance: 0.2,
		cooldownPerSpawn: 15000,
		maxSpawns: 1
	});

	// Cached array instances, no need to allocate every time.
	const axisOptions = [
		['x', 'y'],
		['y', 'z'],
		['z', 'x']
	];

	function getTargetOfStyle(color, wireframe) {
		let pool;
		if (color === YELLOW) pool = targetYellowPool;
		else if (color === PURPLE) pool = targetPurplePool;
		else if (color === RED) pool = targetRedPool;
		else pool = wireframe ? targetWireframePool : targetPool;
		
		let target = pool.get(color).pop();
		if (!target) {
			target = new Entity({
				model: optimizeModel(makeRecursiveCubeModel({
					recursionLevel: 1,
					splitFn: mengerSpongeSplit,
					scale: targetRadius
				})),
				color: color,
				wireframe: wireframe
			});

			// Init any properties that will be used.
			// These will not be automatically reset when recycled.
			target.color = color;
			target.wireframe = wireframe;
			// Some properties don't have their final value yet.
			// Initialize with any value of the right type.
			target.hit = false;
			target.maxHealth = 0;
			target.health = 0;
			target.blockType = BLOCK_TYPE_NORMAL;
		}
		return target;
	}

	return function getTarget() {
		if (doubleStrong && state.game.score <= doubleStrongEnableScore) {
			doubleStrong = false;
			// Spawner is reset automatically when game resets.
		} else if (!doubleStrong && state.game.score > doubleStrongEnableScore) {
			doubleStrong = true;
			strongSpawner.mutate({ maxSpawns: 2 });
		}

		// Target Parameters
		// --------------------------------
		let color = pickOne([BLUE, GREEN, ORANGE]);
		let wireframe = false;
		let health = 1;
		let maxHealth = 3;
		const spinner = state.game.cubeCount >= spinnerThreshold && isInGame() && spinnerSpawner.shouldSpawn();
		let blockType = BLOCK_TYPE_NORMAL;
		let specialEffect = null;

		// Target Parameter Overrides
		// --------------------------------
		if (state.game.cubeCount >= slowmoThreshold && slowmoSpawner.shouldSpawn()) {
			color = BLUE;
			wireframe = true;
			blockType = BLOCK_TYPE_WIREFRAME;
		}
		else if (state.game.cubeCount >= strongThreshold && strongSpawner.shouldSpawn()) {
			color = PINK;
			health = 3;
			blockType = BLOCK_TYPE_STRONG;
		}
		else if (state.game.cubeCount >= spinnerThreshold && spinner) {
			blockType = BLOCK_TYPE_SPINNER;
		}
		else if (state.game.cubeCount >= bombThreshold && bombSpawner.shouldSpawn()) {
			color = RED;
			blockType = BLOCK_TYPE_BOMB;
			specialEffect = 'bomb';
		}
		else if (state.game.cubeCount >= coinThreshold && coinSpawner.shouldSpawn()) {
			color = YELLOW;
			blockType = BLOCK_TYPE_COIN;
			specialEffect = 'coin';
		}
		else if (state.game.cubeCount >= powerupThreshold && freezePowerupSpawner.shouldSpawn()) {
			color = PURPLE;
			blockType = BLOCK_TYPE_POWERUP_FREEZE;
			specialEffect = 'freeze';
		}
		else if (state.game.cubeCount >= powerupThreshold && shockwavePowerupSpawner.shouldSpawn() && state.game.cooldowns.shockwave <= 0) {
			color = PURPLE;
			blockType = BLOCK_TYPE_POWERUP_SHOCKWAVE;
			specialEffect = 'shockwave';
		}

		// Target Creation
		// --------------------------------
		const target = getTargetOfStyle(color, wireframe);
		target.hit = false;
		target.maxHealth = maxHealth;
		target.health = health;
		target.blockType = blockType;
		target.specialEffect = specialEffect;
		updateTargetHealth(target, 0);

		const spinSpeeds = [
			Math.random() * 0.1 - 0.05,
			Math.random() * 0.1 - 0.05
		];

		if (spinner || blockType === BLOCK_TYPE_SPINNER) {
			// Ends up spinning a random axis
			spinSpeeds[0] = -0.25;
			spinSpeeds[1] = 0;
			target.rotateZ = random(0, TAU);
		}

		const axes = pickOne(axisOptions);

		spinSpeeds.forEach((spinSpeed, i) => {
			switch (axes[i]) {
				case 'x':
					target.rotateXD = spinSpeed;
					break;
				case 'y':
					target.rotateYD = spinSpeed;
					break;
				case 'z':
					target.rotateZD = spinSpeed;
					break;
			}
		});

		return target;
	}
})();


const updateTargetHealth = (target, healthDelta) => {
	target.health += healthDelta;
	// Only update stroke on non-wireframe targets.
	// Showing "glue" is a temporary attempt to display health. For now, there's
	// no reason to have wireframe targets with high health, so we're fine.
	if (!target.wireframe) {
		const strokeWidth = target.health - 1;
		const strokeColor = makeTargetGlueColor(target);
		for (let p of target.polys) {
			p.strokeWidth = strokeWidth;
			p.strokeColor = strokeColor;
		}
	}
	
	// Visual indicator for special blocks
	if (target.specialEffect === 'bomb') {
		for (let p of target.polys) {
			p.color = RED;
		}
	} else if (target.specialEffect === 'coin') {
		for (let p of target.polys) {
			p.color = YELLOW;
		}
	} else if (target.specialEffect === 'freeze' || target.specialEffect === 'shockwave') {
		for (let p of target.polys) {
			p.color = PURPLE;
		}
	}
};


const returnTarget = target => {
	target.reset();
	const pool = target.wireframe ? targetWireframePool : 
		target.color === YELLOW ? targetYellowPool :
		target.color === PURPLE ? targetPurplePool :
		target.color === RED ? targetRedPool : targetPool;
	pool.get(target.color).push(target);
};


function resetAllTargets() {
	while(targets.length) {
		returnTarget(targets.pop());
	}
}

// Bomb explosion effect
function createBombExplosion(x, y, radius) {
	// Create visual burst
	sparkBurst(x, y, 30, 20);
	
	// Apply explosion to all nearby targets
	for (let i = targets.length - 1; i >= 0; i--) {
		const target = targets[i];
		const dx = target.x - x;
		const dy = target.y - y;
		const distance = Math.hypot(dx, dy);
		
		if (distance < radius) {
			// Destroy target instantly
			incrementScore(25);
			createBurst(target, 1);
			sparkBurst(target.projected.x, target.projected.y, 8, 10);
			targets.splice(i, 1);
			returnTarget(target);
		}
	}
}
