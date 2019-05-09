// Track all active fragments
const frags = [];
// Pool inactive fragments by color, using a Map.
// keys are color objects, and values are arrays of fragments.
// // Also pool wireframe instances separately.
const fragPool = new Map(allColors.map(c=>([c, []])));
const fragWireframePool = new Map(allColors.map(c=>([c, []])));


const createBurst = (() => {
	// Precompute some private data to be reused for all bursts.
	const basePositions = mengerSpongeSplit({ x:0, y:0, z:0 }, fragRadius*2);
	const positions = cloneVertices(basePositions);
	const prevPositions = cloneVertices(basePositions);
	const velocities = cloneVertices(basePositions);

	const basePositionNormals = basePositions.map(normalize);
	const positionNormals = cloneVertices(basePositionNormals);


	const fragCount = basePositions.length;

	function getFragForTarget(target) {
		const pool = target.wireframe ? fragWireframePool : fragPool;
		let frag = pool.get(target.color).pop();
		if (!frag) {
			frag = new Entity({
				model: makeCubeModel({ scale: fragRadius }),
				color: target.color,
				wireframe: target.wireframe
			});
			frag.color = target.color;
			frag.wireframe = target.wireframe;
		}
		return frag;
	}

	return (target, force=1) => {
		// Calculate fragment positions, and what would have been the previous positions
		// when still a part of the larger target.
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

		// Compute velocity of each fragment, based on previous positions.
		// Will write to `velocities` array.
		for (let i=0; i<fragCount; i++) {
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


		for (let i=0; i<fragCount; i++) {
			const position = positions[i];
			const velocity = velocities[i];
			const normal = positionNormals[i];

			const frag = getFragForTarget(target);

			frag.x = position.x;
			frag.y = position.y;
			frag.z = position.z;
			frag.rotateX = target.rotateX;
			frag.rotateY = target.rotateY;
			frag.rotateZ = target.rotateZ;


			const burstSpeed = 2 * force;
			const randSpeed = 2 * force;
			const rotateScale = 0.015;
			frag.xD = velocity.x + (normal.x * burstSpeed) + (Math.random() * randSpeed);
			frag.yD = velocity.y + (normal.y * burstSpeed) + (Math.random() * randSpeed);
			frag.zD = velocity.z + (normal.z * burstSpeed) + (Math.random() * randSpeed);
			frag.rotateXD = frag.xD * rotateScale;
			frag.rotateYD = frag.yD * rotateScale;
			frag.rotateZD = frag.zD * rotateScale;

			frags.push(frag);
		};
	}
})();


const returnFrag = frag => {
	frag.reset();
	const pool = frag.wireframe ? fragWireframePool : fragPool;
	pool.get(frag.color).push(frag);
};
