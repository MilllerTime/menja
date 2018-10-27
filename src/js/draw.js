function draw(ctx, width, height, viewScale) {
	const halfW = width / 2;
	const halfH = height / 2;

	// 3D Polys
	// ---------------

	allPolys.forEach(p => {
		if (p.normalCamera.z < 0) return;

		const { vertices } = p;
		const lastV = vertices[vertices.length - 1];
		const normalLight = p.normalWorld.y * 0.7 + p.normalWorld.z * -0.7;
		const lightness = normalLight > 0
			? 10
			: ((normalLight ** 32 - normalLight) / 2) * 90 + 10;

		ctx.fillStyle = `hsl(${p.color.h},${p.color.s}%,${lightness}%)`;
		ctx.beginPath();
		ctx.moveTo(lastV.x, lastV.y);
		for (let v of vertices) {
			ctx.lineTo(v.x, v.y);
		}
		ctx.fill();
	});


	// Touch Strokes
	// ---------------

	ctx.strokeStyle = touchTrailColor;

	for (let i=1; i<touchPoints.length; i++) {
		const current = touchPoints[i];
		const prev = touchPoints[i-1];
		if (current.touchBreak || prev.touchBreak) {
			continue;
		}
		const scale = current.life / touchPointLife;
		ctx.lineWidth = scale * touchTrailThickness;
		ctx.beginPath();
		ctx.moveTo(prev.x, prev.y);
		ctx.lineTo(current.x, current.y);
		ctx.stroke();
	}
}
