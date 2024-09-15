class Utlities_class {
	constructor() {
		this.currentFPS = 0;
		this.currentDelta = 0;
		this.gridResolution = 30;
	}
	renderFPS() {
		if (frameCount % 10 == 0) {
			this.currentFPS = round(frameRate());
		}
		push();
		fill(255)
			.noStroke()
			.strokeWeight(0)
			.text(this.currentFPS + " / s", 10, 20);
		pop();
		return;
	} //! FPS counter
	renderDelta() {
		push();
		fill(255)
			.noStroke()
			.strokeWeight(0)
			.text(round(round(deltaTime)) + " ms", 10, 40);
		pop();
		return;
	} //! Delta Time
	renderGrid(anchor = createVector(0, 0)) {
		push();
		stroke(50);
		for (let i = -10; i < 30; i++) {
			if (i * this.gridResolution < width * 1.5) {
				let xpos = i * this.gridResolution + ((anchor.x * 1) % this.gridResolution);
				line(xpos, -100, xpos, height + 100);
			}
			if (i * this.gridResolution < height * 1.5) {
				let ypox = i * this.gridResolution + ((anchor.y * 1) % this.gridResolution);
				line(-100, ypox, width + 100, ypox);
			}
		}
		pop();
		return;
	}
	debug(...args) {
		if (args[0]) {
			push();
			fill(255).noStroke().strokeWeight(0);
			args[0]?.forEach((e, x) => {
				if (e?.value) {
					e = e.value;
				}
				if (e.constructor.name == "Player") {
					let addition = p5.Vector.mult(e.velocity, deltaTime * 0.001);
					text(e.constructor.name + " : " + addition.x + ", " + addition.y, 10, 60 + (x + 1) * 40);
				}
				text(e.constructor.name + " : " + e.position.x + ", " + e.position.y, 10, 40 + (x + 1) * 40);
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