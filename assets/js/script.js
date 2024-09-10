let gamecanvas;
function setup() {
	init(new Camera({ recieveReferences: true }));
	init(new Player(), { emit: true, recieverClass: "Camera" });
	let dimension;
	if (windowWidth > windowHeight) {
		dimension = windowHeight < 600 ? windowHeight : 600;
	} else {
		dimension = windowWidth < 600 ? windowWidth : 600;
	}
	gamecanvas = createCanvas(dimension, dimension);
	gamecanvas.canvas.parentElement.classList.add("d-flex", "justify-content-center");
	frameRate(60);
}

function draw() {
	background(0);
	Utilities.renderFPS();
	Utilities.renderDelta();
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
