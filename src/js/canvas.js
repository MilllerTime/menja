function setupCanvases() {
	const ctx = canvas.getContext('2d');
	// devicePixelRatio alias
	const dpr = window.devicePixelRatio || 1;
	// View will be scaled so objects appear sized similarly on all screen sizes.
	let viewScale;
	// Dimensions (taking viewScale into account!)
	let width, height;

	function handleResize() {
		const w = window.innerWidth;
		const h = window.innerHeight;
		viewScale = h / 1000;
		width = w / viewScale;
		height = h / viewScale;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
	}

	// Set initial size
	handleResize();
	// resize fullscreen canvas
	window.addEventListener('resize', handleResize);


	// Run game loop
	let lastTimestamp = 0;
	function frameHandler(timestamp) {
		let frameTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		// always queue another frame
		raf();

		// If game is paused, we'll still track frameTime (above) but all other
		// game logic and drawing can be avoided.
		if (isPaused()) return;

		// make sure negative time isn't reported (first frame can be whacky)
		if (frameTime < 0) {
			frameTime = 17;
		}
		// - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
		else if (frameTime > 68) {
			frameTime = 68;
		}

		const halfW = width / 2;
		const halfH = height / 2;

		// Convert pointer position from screen to scene coords.
		pointerScene.x = pointerScreen.x / viewScale - halfW;
		pointerScene.y = pointerScreen.y / viewScale - halfH;

		const lag = frameTime / 16.6667;
		const simTime = gameSpeed * frameTime;
		const simSpeed = gameSpeed * lag;
		tick(width, height, simTime, simSpeed, lag);

		// Auto clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Auto scale drawing for high res displays, and incorporate `viewScale`.
		// Also shift canvas so (0, 0) is the middle of the screen.
		// This just works with 3D perspective projection.
		const drawScale = dpr * viewScale;
		ctx.scale(drawScale, drawScale);
		ctx.translate(halfW, halfH);
		draw(ctx, width, height, viewScale);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	const raf = () => requestAnimationFrame(frameHandler);
	// Start loop
	raf();
}
