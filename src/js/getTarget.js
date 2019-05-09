// All active targets
const targets = [];

// Pool target instances by color, using a Map.
// keys are color objects, and values are arrays of targets.
// Also pool wireframe instances separately.
const targetPool = new Map(allColors.map(c=>([c, []])));
const targetWireframePool = new Map(allColors.map(c=>([c, []])));



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

	// Cached array instances, no need to allocate every time.
	const axisOptions = [
		['x', 'y'],
		['y', 'z'],
		['z', 'x']
	];

	function getTargetOfStyle(color, wireframe) {
		const pool = wireframe ? targetWireframePool : targetPool;
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

		// Target Parameter Overrides
		// --------------------------------
		if (state.game.cubeCount >= slowmoThreshold && slowmoSpawner.shouldSpawn()) {
			color = BLUE;
			wireframe = true;
		}
		else if (state.game.cubeCount >= strongThreshold && strongSpawner.shouldSpawn()) {
			color = PINK;
			health = 3;
		}

		// Target Creation
		// --------------------------------
		const target = getTargetOfStyle(color, wireframe);
		target.hit = false;
		target.maxHealth = maxHealth;
		target.health = health;
		updateTargetHealth(target, 0);

		const spinSpeeds = [
			Math.random() * 0.1 - 0.05,
			Math.random() * 0.1 - 0.05
		];

		if (spinner) {
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
};


const returnTarget = target => {
	target.reset();
	const pool = target.wireframe ? targetWireframePool : targetPool;
	pool.get(target.color).push(target);
};


function resetAllTargets() {
	while(targets.length) {
		returnTarget(targets.pop());
	}
}
