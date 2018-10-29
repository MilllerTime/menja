const cubes = [];
const cubePool = {};
targetHues.forEach(hue => cubePool[hue] = []);

const createBurst = target => {
	const scale = targetRadius / 3;
	mengerSpongeSplit(target, scale*2).forEach(position => {
		let cube = cubePool[target.hue].pop();

		if (!cube) {
			cube = new Entity({
				model: makeCubeModel({
					color: target.polys[0].color,
					scale: scale
				})
			});
			cube.hue = target.hue;
		}

		cube.x = position.x;
		cube.y = position.y;
		cube.z = position.z;
		// cube.rotateX = target.rotateX;
		// cube.rotateY = target.rotateY;
		// cube.rotateZ = target.rotateZ;

		const maxSpeed = 8;
		const rotateScale = 0.015;
		cube.xD = target.xD + (Math.random() * maxSpeed) - (maxSpeed * 0.5);
		cube.yD = target.yD + (Math.random() * maxSpeed) - (maxSpeed * 0.5);
		cube.zD = target.zD + (Math.random() * maxSpeed) - (maxSpeed * 0.5);
		cube.rotateXD = cube.xD * rotateScale;
		cube.rotateYD = cube.yD * rotateScale;
		cube.rotateZD = cube.zD * rotateScale;

		cubes.push(cube);
	});
}


const returnCube = cube => {
	cube.reset();
	cubePool[cube.hue].push(cube);
};
