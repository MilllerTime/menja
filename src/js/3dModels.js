// Define models once. The origin is the center of the model.

// A simple cube, 8 vertices, 6 quads.
// Defaults to an edge length of 2 units, can be influenced with `scale`.
function makeCubeModel({ scale=1 }) {
	return {
		vertices: [
			// top
			{ x: -scale, y: -scale, z: scale },
			{ x:  scale, y: -scale, z: scale },
			{ x:  scale, y:  scale, z: scale },
			{ x: -scale, y:  scale, z: scale },
			// bottom
			{ x: -scale, y: -scale, z: -scale },
			{ x:  scale, y: -scale, z: -scale },
			{ x:  scale, y:  scale, z: -scale },
			{ x: -scale, y:  scale, z: -scale }
		],
		polys: [
			// z = 1
			{ vIndexes: [0, 1, 2, 3] },
			// z = -1
			{ vIndexes: [7, 6, 5, 4] },
			// y = 1
			{ vIndexes: [3, 2, 6, 7] },
			// y = -1
			{ vIndexes: [4, 5, 1, 0] },
			// x = 1
			{ vIndexes: [5, 6, 2, 1] },
			// x = -1
			{ vIndexes: [0, 3, 7, 4] }
		]
	};
}

// Not very optimized - lots of duplicate vertices are generated.
function makeRecursiveCubeModel({ recursionLevel, splitFn, color, scale=1 }) {
	const getScaleAtLevel = level => 1 / (3 ** level);

	// We can model level 0 manually. It's just a single, centered, cube.
	let cubeOrigins = [{ x: 0, y: 0, z: 0 }];

	// Recursively replace cubes with smaller cubes.
	for (let i=1; i<=recursionLevel; i++) {
		const scale = getScaleAtLevel(i) * 2;
		const cubeOrigins2 = [];
		cubeOrigins.forEach(origin => {
			cubeOrigins2.push(...splitFn(origin, scale));
		});
		cubeOrigins = cubeOrigins2;
	}

	const finalModel = { vertices: [], polys: [] };

	// Generate single cube model and scale it.
	const cubeModel = makeCubeModel({ scale: 1 });
	cubeModel.vertices.forEach(scaleVector(getScaleAtLevel(recursionLevel)));

	// Compute the max distance x, y, or z origin values will be.
	// Same result as `Math.max(...cubeOrigins.map(o => o.x))`, but much faster.
	const maxComponent = getScaleAtLevel(recursionLevel) * (3 ** recursionLevel - 1);

	// Place cube geometry at each origin.
	cubeOrigins.forEach((origin, cubeIndex) => {
		// To compute occlusion (shading), find origin component with greatest
		// magnitude and normalize it relative to `maxComponent`.
		const occlusion = Math.max(
			Math.abs(origin.x),
			Math.abs(origin.y),
			Math.abs(origin.z)
		) / maxComponent;
		// At lower iterations, occlusion looks better lightened up a bit.
		const occlusionLighter = recursionLevel > 2
			? occlusion
			: (occlusion + 0.8) / 1.8;
		// Clone, translate vertices to origin, and apply scale
		finalModel.vertices.push(
			...cubeModel.vertices.map(v => ({
				x: (v.x + origin.x) * scale,
				y: (v.y + origin.y) * scale,
				z: (v.z + origin.z) * scale
			}))
		);
		// Clone polys, shift referenced vertex indexes, and compute color.
		finalModel.polys.push(
			...cubeModel.polys.map(poly => ({
				vIndexes: poly.vIndexes.map(add(cubeIndex * 8))
			}))
		);
	});

	return finalModel;
}


// o: Vector3D - Position of cube's origin (center).
// s: Vector3D - Determines size of menger sponge.
function mengerSpongeSplit(o, s) {
	return [
		// Top
		{ x: o.x + s, y: o.y - s, z: o.z + s },
		{ x: o.x + s, y: o.y - s, z: o.z + 0 },
		{ x: o.x + s, y: o.y - s, z: o.z - s },
		{ x: o.x + 0, y: o.y - s, z: o.z + s },
		{ x: o.x + 0, y: o.y - s, z: o.z - s },
		{ x: o.x - s, y: o.y - s, z: o.z + s },
		{ x: o.x - s, y: o.y - s, z: o.z + 0 },
		{ x: o.x - s, y: o.y - s, z: o.z - s },
		// Bottom
		{ x: o.x + s, y: o.y + s, z: o.z + s },
		{ x: o.x + s, y: o.y + s, z: o.z + 0 },
		{ x: o.x + s, y: o.y + s, z: o.z - s },
		{ x: o.x + 0, y: o.y + s, z: o.z + s },
		{ x: o.x + 0, y: o.y + s, z: o.z - s },
		{ x: o.x - s, y: o.y + s, z: o.z + s },
		{ x: o.x - s, y: o.y + s, z: o.z + 0 },
		{ x: o.x - s, y: o.y + s, z: o.z - s },
		// Middle
		{ x: o.x + s, y: o.y + 0, z: o.z + s },
		{ x: o.x + s, y: o.y + 0, z: o.z - s },
		{ x: o.x - s, y: o.y + 0, z: o.z + s },
		{ x: o.x - s, y: o.y + 0, z: o.z - s }
	];
}



// Helper to optimize models by merging duplicate vertices within a threshold,
// and removing all polys that share the same vertices.
// Directly mutates the model.
function optimizeModel(model, threshold=0.0001) {
	const { vertices, polys } = model;

	const compareVertices = (v1, v2) => (
		Math.abs(v1.x - v2.x) < threshold &&
		Math.abs(v1.y - v2.y) < threshold &&
		Math.abs(v1.z - v2.z) < threshold
	);

	const comparePolys = (p1, p2) => {
		const v1 = p1.vIndexes;
		const v2 = p2.vIndexes;
		return (
			(
				v1[0] === v2[0] ||
				v1[0] === v2[1] ||
				v1[0] === v2[2] ||
				v1[0] === v2[3]
			) && (
				v1[1] === v2[0] ||
				v1[1] === v2[1] ||
				v1[1] === v2[2] ||
				v1[1] === v2[3]
			) && (
				v1[2] === v2[0] ||
				v1[2] === v2[1] ||
				v1[2] === v2[2] ||
				v1[2] === v2[3]
			) && (
				v1[3] === v2[0] ||
				v1[3] === v2[1] ||
				v1[3] === v2[2] ||
				v1[3] === v2[3]
			)
		);
	};


	vertices.forEach((v, i) => {
		v.originalIndexes = [i];
	});

	for (let i=vertices.length-1; i>=0; i--) {
		for (let ii=i-1; ii>=0; ii--) {
			const v1 = vertices[i];
			const v2 = vertices[ii];
			if (compareVertices(v1, v2)) {
				vertices.splice(i, 1);
				v2.originalIndexes.push(...v1.originalIndexes);
				break;
			}
		}
	}

	vertices.forEach((v, i) => {
		polys.forEach(p => {
			p.vIndexes.forEach((vi, ii, arr) => {
				const vo = v.originalIndexes;
				if (vo.includes(vi)) {
					arr[ii] = i;
				}
			});
		});
	});

	polys.forEach(p => {
		const vi = p.vIndexes;
		p.sum = vi[0] + vi[1] + vi[2] + vi[3];
	});
	polys.sort((a, b) => b.sum - a.sum);

	// Assumptions:
	// 1. Each poly will either have no duplicates or 1 duplicate.
	// 2. If two polys are equal, they are both hidden (two cubes touching),
	//    therefore both can be removed.
	for (let i=polys.length-1; i>=0; i--) {
		for (let ii=i-1; ii>=0; ii--) {
			const p1 = polys[i];
			const p2 = polys[ii];
			if (p1.sum !== p2.sum) break;
			if (comparePolys(p1, p2)) {
				polys.splice(i, 1);
				polys.splice(ii, 1);
				i--;
				break;
			}
		}
	}

	return model;
}
