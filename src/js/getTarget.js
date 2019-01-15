// Pool target instances by color, using a Map.
// keys are color objects, and values are arrays of targets.
const targetPool = new Map(allColors.map(c=>([c, []])));



const getTarget = (() => {

	const shouldSpawnPink = makeSpawnerWithCooldown(0.3, 12000, { numUnits: 2 });
	const shouldSpawnSlowmo = makeSpawnerWithCooldown(0.1, 20000, { numUnits: 1 });

	// Cached array instances, no need to allocate every time.
	const axisOptions = [
		['x', 'y'],
		['y', 'z'],
		['z', 'x']
	];

	function getTargetOfColor(color) {
		let target = targetPool.get(color).pop();
		if (!target) {
			target = new Entity({
				model: optimizeModel(makeRecursiveCubeModel({
					recursionLevel: 1,
					splitFn: mengerSpongeSplit,
					color: color,
					scale: targetRadius
				}))
			});
			target.color = color;
		}
		return target;
	}

	return function getTarget() {
		// Target Parameters
		// --------------------------------
		let color = pickOne([BLUE, GREEN, ORANGE]);
		let health = 1;
		let maxHealth = 3;

		// Target Parameter Overrides
		// --------------------------------
		if (shouldSpawnPink()) {
			color = PINK;
			health = 3;
		}

		// Target Creation
		// --------------------------------
		const target = getTargetOfColor(color);
		target.hit = false;
		target.maxHealth = maxHealth;
		target.health = health;
		updateTargetHealth(target, 0);

		const spinSpeeds = [
			Math.random() * 0.1 - 0.05,
			Math.random() * 0.1 - 0.05
		];

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
	const strokeWidth = target.health - 1;
	const strokeColor = makeTargetGlueColor(target);
	target.polys.forEach(p => {
		p.strokeWidth = strokeWidth;
		p.strokeColor = strokeColor;
	});
};


const returnTarget = target => {
	target.reset();
	targetPool.get(target.color).push(target);
};
