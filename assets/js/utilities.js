class Utlities_class {
	constructor() {
		this.currentFPS = 0;
		this.currentDelta = 0;
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
	} //! FPS counter
	renderDelta() {
		push();
		fill(255)
			.noStroke()
			.strokeWeight(0)
			.text(round(round(deltaTime)) + " ms", 10, 40);
		pop();
	} //! Delta Time
}
const Utilities = new Utlities_class();
