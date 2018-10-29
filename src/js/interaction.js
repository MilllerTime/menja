// Interaction
// -----------------------------
let isChangingSpeed = false;

function handlePointerDown(x, y) {
	if (!pointerIsDown) {
		pointerIsDown = true;
		pointerScreen.x = x;
		pointerScreen.y = y;

		if (y > window.innerHeight - 40) {
			isChangingSpeed = true;
		}
	}
}

function handlePointerUp() {
	pointerIsDown = false;
	isChangingSpeed = false;
	touchPoints.push({
			touchBreak: true,
			life: touchPointLife
	});
}

function handlePointerMove(x, y) {
	if (pointerIsDown) {
		pointerScreen.x = x;
		pointerScreen.y = y;

		if (isChangingSpeed) {
			gameSpeed = x / window.innerWidth;
		}
	}
}


// Use pointer events if available, otherwise fallback to touch events (for iOS).
if ('PointerEvent' in window) {
	canvas.addEventListener('pointerdown', event => {
		event.isPrimary && handlePointerDown(event.clientX, event.clientY);
	});

	canvas.addEventListener('pointerup', event => {
		event.isPrimary && handlePointerUp();
	});

	canvas.addEventListener('pointermove', event => {
		event.isPrimary && handlePointerMove(event.clientX, event.clientY);
	});

	// We also need to know if the mouse leaves the page. For this game, it's best if that
	// cancels a swipe, so essentially acts as a "mouseup" event.
	document.addEventListener('mouseout', handlePointerUp);
} else {
	let activeTouchId = null;
	canvas.addEventListener('touchstart', event => {
		if (!pointerIsDown) {
			const touch = event.changedTouches[0];
			activeTouchId = touch.identifier;
			handlePointerDown(touch.clientX, touch.clientY);
		}
	});
	canvas.addEventListener('touchend', event => {
		for (let touch of event.changedTouches) {
			if (touch.identifier === activeTouchId) {
				handlePointerUp();
				break;
			}
		}
	});
	canvas.addEventListener('touchmove', event => {
		for (let touch of event.changedTouches) {
			if (touch.identifier === activeTouchId) {
				handlePointerMove(touch.clientX, touch.clientY);
				event.preventDefault();
				break;
			}
		}
	}, { passive: false });
}
