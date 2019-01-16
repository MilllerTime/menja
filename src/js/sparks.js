const sparks = [];
const sparkPool = [];


function addSpark(x, y, xD, yD) {
	const spark = sparkPool.pop() || {};

	spark.x = x + xD * 0.5;
	spark.y = y + yD * 0.5;
	spark.xD = xD;
	spark.yD = yD;
	spark.life = random(200, 300);
	spark.maxLife = spark.life;

	sparks.push(spark);

	return spark;
}


// Spherical spark burst
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


// Make a target "leak" sparks from all vertices.
// This is used to create the effect of target glue "shedding".
let glueShedVertices;
function glueShedSparks(target) {
	if (!glueShedVertices) {
		glueShedVertices = cloneVertices(target.vertices);
	} else {
		copyVerticesTo(target.vertices, glueShedVertices);
	}

	glueShedVertices.forEach(v => {
		if (Math.random() < 0.4) {
			projectVertex(v);
			addSpark(
				v.x,
				v.y,
				random(-12, 12),
				random(-12, 12)
			);
		}
	});
}

function returnSpark(spark) {
	sparkPool.push(spark);
}
