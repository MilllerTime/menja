
let spawnTime = 0;
const spawnDelay = 1000;
const maxSpawnX = 450;
const targets = [];
const pointerDelta = { x: 0, y: 0 };
const pointerDeltaScaled = { x: 0, y: 0 };


function tick(width, height, simTime, simSpeed, lag) {
	const centerX = width / 2;
	const centerY = height / 2;

	// Pointer Tracking
	// -------------------

	// Compute speed and x/y deltas.
	// There is also a "scaled" variant taking game speed into account. This serves two purposes:
	//  - Lag won't create large spikes in speed/deltas
	//  - In slow mo, speed is increased proportionately to match "reality". Without this boost,
	//    it feels like your actions are dampened in slow mo.
	pointerDelta.x = 0;
	pointerDelta.y = 0;
	pointerDeltaScaled.x = 0;
	pointerDeltaScaled.y = 0;
	const lastPointer = touchPoints[touchPoints.length - 1];

	if (pointerIsDown && lastPointer && !lastPointer.touchBreak) {
		pointerDelta.x = (pointerScene.x - lastPointer.x);
		pointerDelta.y = (pointerScene.y - lastPointer.y);
		pointerDeltaScaled.x = pointerDelta.x / simSpeed;
		pointerDeltaScaled.y = pointerDelta.y / simSpeed;
	}
	const pointerSpeed = Math.hypot(pointerDelta.x, pointerDelta.y);
	const pointerSpeedScaled = pointerSpeed / simSpeed;

	// Track points for later calculations, including drawing trail.
	touchPoints.forEach(p => p.life -= simTime);

	if (pointerIsDown) {
		touchPoints.push({
			x: pointerScene.x,
			y: pointerScene.y,
			life: touchPointLife
		});
	}

	while (touchPoints[0] && touchPoints[0].life <= 0) {
		touchPoints.shift();
	}


	// Entity Manipulation
	// --------------------

	// Spawn targets
	spawnTime -= simTime;
	if (spawnTime <= 0) {
		spawnTime = spawnDelay;
		const target = getTarget();
		const spawnRadius = Math.min(centerX * 0.8, maxSpawnX);
		target.x = (Math.random() * spawnRadius * 2 - spawnRadius);
		target.y = centerY + targetHitRadius;
		target.z = (Math.random() * targetRadius*2 - targetRadius);
		target.yD = -20;
		targets.push(target);
	}

	// Animate targets and remove when offscreen
	const leftBound = -centerX + targetRadius;
	const rightBound = centerX - targetRadius;
	const ceiling = -centerY - 100;
	const boundDamping = 0.4;

	targetLoop:
	for (let i = targets.length - 1; i >= 0; i--) {
		const target = targets[i];
		target.x += target.xD * simSpeed;
		target.y += target.yD * simSpeed;

		if (target.y > centerY + targetHitRadius) {
			targets.splice(i, 1);
			returnTarget(target);
			continue;
		} else if (target.y < ceiling) {
			target.y = ceiling;
			target.yD = 3;
		}

		if (target.x < leftBound) {
			target.x = leftBound;
			target.xD *= -boundDamping;
		} else if (target.x > rightBound) {
			target.x = rightBound;
			target.xD *= -boundDamping;
		}

		target.yD += 0.3 * simSpeed;
		target.rotateX += target.rotateXD * simSpeed;
		target.rotateY += target.rotateYD * simSpeed;
		target.rotateZ += target.rotateZD * simSpeed;
		target.transform();
		target.project();


		if (pointerSpeedScaled > minPointerSpeed) {
			// If pointer is moving really fast, we want to hittest multiple points along the path.
			// We can't use scaled pointer speed to determine this, since we care about actual screen
			// distance covered.
			const hitTestCount = Math.ceil(pointerSpeed / targetRadius * 2);
			// Start loop at `1` and use `<=` check, so we skip 0% and end up at 100%.
			// This omits the previous point position, and includes the most recent.
			for (let ii=1; ii<=hitTestCount; ii++) {
				const percent = 1 - (ii / hitTestCount);
				const hitX = pointerScene.x - pointerDelta.x * percent;
				const hitY = pointerScene.y - pointerDelta.y * percent;
				const distance = Math.hypot(
					hitX - target.projected.x,
					hitY - target.projected.y
				);

				if (distance <= targetHitRadius) {
					// Hit! (though we don't want to allow hits on multiple sequential frames)
					if (!target.hit) {
						target.hit = true;
						target.xD += pointerDeltaScaled.x * hitDampening;
						target.yD += pointerDeltaScaled.y * hitDampening;
						target.rotateXD += pointerDeltaScaled.y * 0.001;
						target.rotateYD += pointerDeltaScaled.x * 0.001;
						createBurst(target);
						targets.splice(i, 1);
						returnTarget(target);
					}
					// Break the current loop and continue the outer loop.
					// This skips to processing the next target.
					continue targetLoop;
				}
			}
		}

		// This code will only run if target hasn't been "hit".
		target.hit = false;
	}

	for (let i = cubes.length - 1; i >= 0; i--) {
		const cube = cubes[i];
		cube.x += cube.xD * simSpeed;
		cube.y += cube.yD * simSpeed;
		cube.z += cube.zD * simSpeed;

		// Removal conditions
		if (
			// Bottom of screen
			cube.y > centerY + targetHitRadius ||
			cube.x < -centerX - targetHitRadius ||
			// Sides of screen
			cube.x > centerX + targetHitRadius ||
			// Too close to camera (based on a percentage and constant value)
			cube.z > cameraDistance * 0.8 - targetRadius
		) {
			cubes.splice(i, 1);
			returnCube(cube);
			continue;
		}

		if (cube.y < ceiling) {
			cube.y = ceiling;
			cube.yD = 2;
		}

		cube.yD += 0.3 * simSpeed;
		cube.rotateX += cube.rotateXD * simSpeed;
		cube.rotateY += cube.rotateYD * simSpeed;
		cube.rotateZ += cube.rotateZD * simSpeed;
		cube.transform();
	}

	// 3D transforms
	// -------------------

	// Aggregate all scene vertices/polys
	allVertices.length = 0;
	allPolys.length = 0;
	targets.forEach(entity => {
		allVertices.push(...entity.vertices);
		allPolys.push(...entity.polys);
	});

	cubes.forEach(entity => {
		allVertices.push(...entity.vertices);
		allPolys.push(...entity.polys);
	});

	// Scene calculations/transformations
	allPolys.forEach(p => computePolyNormal(p, 'normalWorld'));
	allPolys.forEach(computePolyDepth);
	allPolys.sort((a, b) => b.depth - a.depth);

	// Perspective projection
	allVertices.forEach(projectVertex);

	allPolys.forEach(p => computePolyNormal(p, 'normalCamera'));
}
