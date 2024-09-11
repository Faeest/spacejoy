let gamecanvas;
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
	init(new Player(), { emit: true, recieverClass: "Camera" });
	init(new Player({ immovable: true }), { emit: true, recieverClass: "Camera" });
	// frameRate(10)
}

function draw() {
	GameObjects.getItemByClass("Camera").proccess();
	GameObjects.getItemByClass("Player").proccess();
	background(0);
	Utilities.renderGrid(GameObjects.getItemByClass("Camera").position);
	Utilities.renderFPS();
	Utilities.renderDelta();
	Utilities.debug([GameObjects.getItemByClass("Camera"), GameObjects.getItemByClass("Player")]);
	push();
	// translate(p5.Vector.sub(createVector(width * 0.5, height * 0.5), GameObjects.getItemByClass("Player").position));
	translate(GameObjects.getItemByClass("Camera").position);
	_.forEach(GameObjects.getAllItemByClass("Player"), (e) => {
		e.value.render();
	});
	pop();
}

Controller.search();
window.addEventListener(
	"gc.controller.found",
	function (event) {
		var controller = event.detail.controller;
		console.log("Controller found at index " + controller.index + ".");
		console.log("'" + controller.name + "' is ready!");
	},
	false
);
window.addEventListener(
	"gc.button.press",
	function (event) {
		console.log(event.detail.name);
	},
	false
);
