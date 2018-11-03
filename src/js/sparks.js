const sparks = [];
const sparkPool = [];


function addSpark(x, y, xD, yD) {
	const spark = sparkPool.pop() || {};

	spark.x = x + xD * 0.5;
	spark.y = y + yD * 0.5;
	spark.xD = xD;
	spark.yD = yD;
	spark.life = random(200, 300);

	sparks.push(spark);

	return spark;
}

function sparkBurst(x, y, count, maxSpeed) {
	const angleInc = TAU / count;
	for (let i=0; i<count; i++) {
		const angle = i * angleInc + angleInc * Math.random();
		const speed = (1 - Math.random() ** 3) * maxSpeed;
		addSpark(
			x,
			y,
			Math.sin(angle) * speed,
			Math.cos(angle) * speed
		);
	}
}

function returnSpark(spark) {
	sparkPool.push(spark);
}
