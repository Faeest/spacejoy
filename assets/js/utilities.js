class Utlities_class {
	constructor() {
		this.currentFPS = 0;
		this.currentDelta = 0;
		this.gridResolution = 30;
	}
	renderStats() {
		let size = 32;
		let padding = 0.65;
		let textAnchor = "Frames :";
		camera.off();
		if (frameCount % 10 == 0) {
			this.currentFPS = round(frameRate());
			this.currentDelta = round(deltaTime);
		}
		push();
		fill(255);
		textSize(16);
		noStroke();
		strokeWeight(0);
		textAlign(LEFT);
		textFont(GameFonts.index(1).value);
		text("Frames", 10, size * padding * 1);
		text(":  " + this.currentFPS + " /s", 10 + textWidth(textAnchor), size * padding * 1);
		text("Latency", 10, size * padding * 2);
		text(":  " + round(this.currentDelta) + " ms", 10 + textWidth(textAnchor), size * padding * 2);
		text("Sprites", 10, size * padding * 3);
		text(":  " + p5play.spritesDrawn, 10 + textWidth(textAnchor), size * padding * 3);
		pop();
		return;
	} //! status renderer
	renderFPS() {
		let size = 32;
		camera.off();
		if (frameCount % 10 == 0) {
			this.currentFPS = round(frameRate());
			this.currentDelta = round(deltaTime);
		}
		push();
		fill(255);
		textSize(16).textAlign(LEFT).textFont(GameFonts.index(1).value);
		text(this.currentFPS + " FPS", size * 0.4, size * 0.7);
		pop();
		return;
	} //! status renderer
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
p5.prototype.collideCirclePoly = function (cx, cy, diameter, vertices, inside) {
	if (inside === undefined) {
		inside = false;
	}
	var next = 0;
	let pointInside = 0;
	for (var current = 0; current < vertices.length; current++) {
		next = current + 1;
		if (next === vertices.length) next = 0;
		var vc = vertices[current]; // c for "current"
		var vn = vertices[next]; // n for "next"
		var collision = this.collideLineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, diameter);
		if (inside && collision) pointInside++;
		if (!inside && collision) return true;
	}
	if (pointInside == vertices.length) return true;
	return false;
};
p5.prototype.collideLineCircle = function (x1, y1, x2, y2, cx, cy, diameter) {
	var inside1 = this.collidePointCircle(x1, y1, cx, cy, diameter);
	var inside2 = this.collidePointCircle(x2, y2, cx, cy, diameter);
	if (inside1 || inside2) return true;
	var distX = x1 - x2;
	var distY = y1 - y2;
	var len = this.sqrt(distX * distX + distY * distY);
	var dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / this.pow(len, 2);
	var closestX = x1 + dot * (x2 - x1);
	var closestY = y1 + dot * (y2 - y1);
	var onSegment = this.collidePointLine(closestX, closestY, x1, y1, x2, y2);
	if (!onSegment) return false;
	if (this._collideDebug) {
		this.ellipse(closestX, closestY, 10, 10);
	}
	distX = closestX - cx;
	distY = closestY - cy;
	var distance = this.sqrt(distX * distX + distY * distY);
	if (distance <= diameter / 2) {
		return true;
	}
	return false;
};
p5.prototype.collidePointCircle = function (x, y, cx, cy, d) {
	if (this.dist(x, y, cx, cy) <= d / 2) {
		return true;
	}
	return false;
};
p5.prototype.collidePointLine = function (px, py, x1, y1, x2, y2, buffer) {
	var d1 = this.dist(px, py, x1, y1);
	var d2 = this.dist(px, py, x2, y2);
	var lineLen = this.dist(x1, y1, x2, y2);
	if (buffer === undefined) {
		buffer = 0.1;
	} // higher # = less accurate
	if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
		return true;
	}
	return false;
};

p5.prototype.StatusHelper = class {
	constructor(text = 0, x = 0, y = 0, randomPosLength = 50) {
		this.pos = createVector(round(random(x - randomPosLength / 2, x + randomPosLength / 2)), round(random(y - randomPosLength / 2, y + randomPosLength / 2)));
		this.lifeTime = 1; // second
		this.fontSize = 14;
		this.fontColor = color("red");
		this.border = 0;
		this.borderColor = color("black");
		this.speed = 1; // second
		this.direction = createVector(0, -1);
		this.text = text;
		this.startTime = millis();
		this.die = false;
	}
	draw() {
		if (!this.die && millis() < this.startTime + this.lifeTime * 1000) {
			push();
			translate(this.pos.x, this.pos.y);
			textAlign(CENTER);
			fill(this.fontColor);
			textSize(this.fontSize);
			stroke(this.borderColor);
			strokeWeight(this.borderColor);
			// textFont(GameFonts.get(1));
			text(this.text, 0, 0);
			pop();
		}
	}
	update() {
		if (!this.die && millis() < this.startTime + this.lifeTime * 1000) {
			this.pos.add(p5.Vector.mult(this.direction, this.speed));
		} else {
			this.die = true;
		}
	}
};
p5.prototype.displayStatusHelper = function (player) {};
