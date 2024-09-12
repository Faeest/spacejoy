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
				text(e.constructor.name + " : " + e.position.x + ", " + e.position.y, 10, 40 + (x + 1) * 20);
			});
			pop();
		}
		return;
	}
}
const Utilities = new Utlities_class();
