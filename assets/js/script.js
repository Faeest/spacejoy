let gamecanvas;

let args, points, rope;

const drawRopePoints = (points, colour, lw) => {
	for (i = 0; i < points.length; i++) {
		const p = points[i];
		const prev = i > 0 ? points[i - 1] : null;

		if (prev) {
			stroke(colour);
			strokeWeight(lw);
			line(prev.pos.x, prev.pos.y, p.pos.x, p.pos.y);
		}
	}
};

function setup() {
	let dimension;
	if (windowWidth > windowHeight) {
		dimension = windowHeight < 600 ? windowHeight : 600;
	} else {
		dimension = windowWidth < 600 ? windowWidth : 600;
	}
	gamecanvas = createCanvas(dimension, dimension);
	gamecanvas.canvas.parentElement.classList.add("d-flex", "justify-content-center");
	frameRate(60);
	init(new Camera({ recieveReferences: true }));
	init(new Player({ controlID: 1, controller: false }), { emit: true, recieverClass: "Camera" });
	init(new Player({ controlID: 0, controller: false }), { emit: true, recieverClass: "Camera" });
	frameRate(60);

	args = {
		start: createVector(100, height - 100),
		end: createVector(width - 100, height - 100),
		resolution: 8,
		mass: 0.88,
		damping: 0.95,
		gravity: createVector(0, 0),
		solverIterations: 100,
		ropeColour: color(32, 192, 160),
		ropeSize: 4,
	};

	points = Rope.generate(args.start, args.end, args.resolution, args.mass, args.damping);

	rope = new Rope(points, args.solverIterations);
}

function draw() {
	// make the rope good, it's now just a successed experiement applying on the game. :D
	if (GameObjects.getAllItemByClass("Player").length > 1) {
		let point0 = rope.getPoint(0);
		point0.pos.set(GameObjects.getAllItemByClass("Player")[0].value.position);
		let point49 = rope.getPoint(49);
		point49.pos.set(GameObjects.getAllItemByClass("Player")[1].value.position);
	}
	listener.update();
	GameObjects.getItemByClass("Camera").proccess();
	_.forEach(GameObjects.getAllItemByClass("Player"), (e) => {
		e.value.proccess();
	});
	background(0);
	Utilities.renderGrid(GameObjects.getItemByClass("Camera").position);
	Utilities.renderFPS();
	Utilities.renderDelta();
	Utilities.debug([GameObjects.getItemByClass("Camera"), ...GameObjects.getAllItemByClass("Player")]);
	push();
	translate(GameObjects.getItemByClass("Camera").position);
	_.forEach(GameObjects.getAllItemByClass("Player"), (e) => {
		e.value.render();
	});
	if (listener.handlers[0]) {
		fill(255)
			.noStroke()
			.strokeWeight(0)
			.text(listener.handlers[0].axes[0] + " " + listener.handlers[0].axes[1], 10, 20);
	}
	rope.update(args.gravity, deltaTime * 0.001); // deltaTime
	drawRopePoints(points, args.ropeColour, args.ropeSize);
	pop();
}
const { GamepadListener } = gamepad;
const listener = new GamepadListener({ precision: 2 });

// listener.on("gamepad:button", (event) => {
// 	const {
// 		index, // Gamepad index: Number [0-3].
// 		button, // Button index: Number [0-N].
// 		value, // Current value: Number between 0 and 1. Float in analog mode, integer otherwise.
// 		pressed, // Native GamepadButton pressed value: Boolean.
// 		gamepad, // Native Gamepad object
// 	} = event.detail;
// 	if (pressed) {
// 		console.log(index, button, value);
// 	}
// });
// listener.on("gamepad:axis", (event) => {
// 	const {
// 		index, // Gamepad index: Number [0-3].
// 		axis, // Axis index: Number [0-N].
// 		value, // Current value: Number between -1 and 1. Float in analog mode, integer otherwise.
// 		gamepad, // Native Gamepad object
// 	} = event.detail;
// 	console.log(index, (axis > 1 ? "right" : "left") + ":" + (axis ? "vert" : "hor"), value);
// });
listener.start();
