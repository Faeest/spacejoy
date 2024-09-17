const PRODUCTION = 0;
// const PRODUCTION = 1;
const GameObjects = new Dictionary();
const GameInputs = new Input();
let gamecanvas;
/** @type {RopeManager} */
let GameRopes;
let args, points, rope;

function setup() {
	GameRopes = new RopeManager({ mode: "closed" });
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
	init(new Player({ controlID: 1, width: 50, controller: false }), { emit: true, recieverClass: "Camera" });
	init(new Player({ controlID: 0, width: 50, controller: false, y: 50 }), { emit: true, recieverClass: "Camera" });
	init(new Player({ controlID: 0, width: 50, controller: true, y: 100 }), { emit: true, recieverClass: "Camera" });

	_.forEach(GameObjects.getAllItemByClass("Player"), (e) => {
		GameRopes.assignPlayerRef(e.id);
	});
	GameRopes.generate();
	frameRate(60);
}

function draw() {
	listener.update();
	background(0);
	GameObjects.getItemByClass("Camera").proccess();
	_.forEach(GameObjects.getAllItemByClass("Player"), (e) => {
		e.value.proccess();
	});
	Utilities.renderGrid(GameObjects.getItemByClass("Camera").position);
	Utilities.renderFPS();
	Utilities.renderDelta();
	Utilities.debug([GameObjects.getItemByClass("Camera"), ...GameObjects.getAllItemByClass("Player")]);
	push();
	translate(GameObjects.getItemByClass("Camera").position);
	GameRopes.update();
	GameRopes.render();
	_.forEach(GameObjects.getAllItemByClass("Player"), (e) => {
		e.value.render();
	});
	if (listener.handlers[0]) {
		fill(255)
			.noStroke()
			.strokeWeight(0)
			.text(listener.handlers[0].axes[0] + " " + listener.handlers[0].axes[1], 10, 20);
	}
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
