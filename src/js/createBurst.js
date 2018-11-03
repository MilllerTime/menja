// Track all active cubes
const cubes = [];
// Pool inactive cubes by color
const cubePool = {};
targetHues.forEach(hue => cubePool[hue] = []);

const createBurst = (() => {
	// Precompute some private data to be reused for all bursts.
	const basePositions = mengerSpongeSplit({ x:0, y:0, z:0 }, fragRadius*2);
	const positions = cloneVertices(basePositions);
	const prevPositions = cloneVertices(basePositions);
	const velocities = cloneVertices(basePositions);

	const basePositionNormals = basePositions.map(normalize);
	const positionNormals = cloneVertices(basePositionNormals);


	const cubeCount = basePositions.length;

	return (target, force=1) => {
		// Calculate cube positions, and what would have been the previous positions
		// when still a part of the larger cube.
		transformVertices(
			basePositions, positions,
			target.x, target.y, target.z,
			target.rotateX, target.rotateY, target.rotateZ,
			1, 1, 1
		);
		transformVertices(
			basePositions, prevPositions,
			target.x - target.xD, target.y - target.yD, target.z - target.zD,
			target.rotateX - target.rotateXD, target.rotateY - target.rotateYD, target.rotateZ - target.rotateZD,
			1, 1, 1
		);

		// Compute velocity of each cube, based on previous positions.
		// Will write to `velocities` array.
		for (let i=0; i<cubeCount; i++) {
			const position = positions[i];
			const prevPosition = prevPositions[i];
			const velocity = velocities[i];

			velocity.x = position.x - prevPosition.x;
			velocity.y = position.y - prevPosition.y;
			velocity.z = position.z - prevPosition.z;
		}



		// Apply target rotation to normals
		transformVertices(
			basePositionNormals, positionNormals,
			0, 0, 0,
			target.rotateX, target.rotateY, target.rotateZ,
			1, 1, 1
		);


		for (let i=0; i<cubeCount; i++) {
			const position = positions[i];
			const velocity = velocities[i];
			const normal = positionNormals[i];

			let cube = cubePool[target.hue].pop();

			if (!cube) {
				cube = new Entity({
					model: makeCubeModel({
						color: target.polys[0].color,
						scale: fragRadius
					})
				});
				cube.hue = target.hue;
			}

			cube.x = position.x;
			cube.y = position.y;
			cube.z = position.z;
			cube.rotateX = target.rotateX;
			cube.rotateY = target.rotateY;
			cube.rotateZ = target.rotateZ;


			const burstSpeed = 2 * force;
			const randSpeed = 2 * force;
			const rotateScale = 0.015;
			cube.xD = velocity.x + (normal.x * burstSpeed) + (Math.random() * randSpeed);
			cube.yD = velocity.y + (normal.y * burstSpeed) + (Math.random() * randSpeed);
			cube.zD = velocity.z + (normal.z * burstSpeed) + (Math.random() * randSpeed);
			cube.rotateXD = cube.xD * rotateScale;
			cube.rotateYD = cube.yD * rotateScale;
			cube.rotateZD = cube.zD * rotateScale;

			cubes.push(cube);
		};
	}
})();


const returnCube = cube => {
	cube.reset();
	cubePool[cube.hue].push(cube);
};
