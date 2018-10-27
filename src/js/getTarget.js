const getTarget = (() => {

	// Cached array instances, no need to allocate every time.
	const axisOptions = [
		['x', 'y'],
		['y', 'z'],
		['z', 'x']
	];

	return function getTarget () {
		const hue = pickOne(targetHues);

		const target = new Entity({
			model: makeRecursiveCubeModel({
				recursionLevel: 1,
				splitFn: mengerSpongeSplit,
				color: { h: hue, s: 80, l: 50 },
				scale: targetRadius
			})
		});

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
