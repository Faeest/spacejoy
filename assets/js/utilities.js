class Utlities_class {
	constructor() {
		this.currentFPS = 0;
		this.currentDelta = 0;
		this.gridResolution = 30;
	}
	renderFPS() {
		camera.off();
		if (frameCount % 10 == 0) {
			this.currentFPS = round(frameRate());
		}
		push();
		fill(255);
		noStroke();
		strokeWeight(0);
		text(this.currentFPS + " / s", 10, height);
		pop();
		return;
	} //! FPS counter
	renderDelta() {
		camera.off();
		push();
		fill(255);
		noStroke();
		strokeWeight(0);
		text(round(deltaTime) + " ms", 10, height - 20);
		pop();
		return;
	} //! Delta Time
	renderGrid(anchor = createVector(0, 0), gridResolution = 40) {
		camera.off();
		push(); // Save the current state
		stroke(50); // Set the line color for grid lines
		// Calculate horizontal grid lines
		for (let i = -10; i * gridResolution <= width * 1.5; i++) {
			let xpos = i * gridResolution + ((-anchor.x * 1) % gridResolution);
			line(xpos, -100, xpos, height + 100);
		}
		// Calculate vertical grid lines
		for (let i = -10; i * gridResolution <= height * 1.5; i++) {
			let ypos = i * gridResolution + ((-anchor.y * 1) % gridResolution);
			line(-100, ypos, width + 100, ypos);
		}
		pop(); // Restore the previous state
	}
	debug(...args) {
		if (args[0]) {
			push();
			fill(255);
			noStroke();
			strokeWeight(0);
			args[0]?.forEach((e, x) => {
				if (e?.value) {
					e = e.value;
				}
				if (e?.type == "player" || e?.constructor?.name == "Player") {
					let addition = p5.Vector.mult(e.velocity, deltaTime * 0.001);
					text("movement" + " : " + round(addition.x, 2) + " X , " + round(addition.y, 2) + "Y", 10, height - (x + 1) * 40);
				}
				text((e?.type ?? e?.constructor?.name) + " : " + round(e?.position?.x || e?.x, 2) + "X , " + round(e?.position?.y || e?.y, 2) + "Y", 10, height - 20 - (x + 1) * 40);
			});
			pop();
		}
		return;
	}
}
const Utilities = new Utlities_class();
function easeOutExpo(x = 0) {
	return x === 1 ? 1 : 1 - Math.pow(4, -10 * x);
}
function easeOutExpo2(x = 0) {
	return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}