// Pool target instances by color
const targetPool = {};
targetHues.forEach(hue => targetPool[hue] = []);


const getTarget = (() => {

	// Cached array instances, no need to allocate every time.
	const axisOptions = [
		['x', 'y'],
		['y', 'z'],
		['z', 'x']
	];

	return function getTarget () {
		const hue = pickOne(targetHues);

		let target = targetPool[hue].pop();

		if (!target) {
			target = new Entity({
				model: optimizeModel(makeRecursiveCubeModel({
					recursionLevel: 1,
					splitFn: mengerSpongeSplit,
					color: { h: hue, s: 80, l: 50 },
					scale: targetRadius
				}))
			});
			target.hue = hue;
		}

		target.hit = false;
		target.health = 1;
		if (hue === 348) target.health = 3; // red takes 3 hits

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


const returnTarget = target => {
	target.reset();
	targetPool[target.hue].push(target);
};
