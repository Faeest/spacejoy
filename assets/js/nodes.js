const PRODUCTION = 0;
// const PRODUCTION = 1;
class Dictionary {
	constructor() {
		/** @type {Array<DictionaryEntries>} */
		this.entries = [];
	}
	assignEntry(value, ...args) {
		this.entries.push(new DictionaryEntries(value, ...args));
	}
	/** @returns {GameObject} */
	getItemById(id = "") {
		return _.find(this.entries, (e) => {
			return e.id == id;
		})?.value;
	}
	/** @returns {GameObject} */
	getItemByClass(classes = "") {
		return _.find(this.entries, (e) => {
			return e.value.constructor.name == classes;
		})?.value;
	}
	/** @returns {GameObject[]} */
	getAllItemById(id = "") {
		return _.filter(this.entries, (e) => {
			return e.id == id;
		});
	}
	/** @returns {GameObject[]} */
	getAllItemByClass(classes = "") {
		return _.filter(this.entries, (e) => {
			return e.value.constructor.name == classes;
		});
	}
	proccessAll() {
		for (let entries of this.entries) {
			entries?.proccess?.();
		}
	}
}
class Input {
	constructor() {
		this.settings = {
			key: [
				[65, 68, 87, 83], // wasd
				[37, 39, 38, 40], // arrow
			],
			controller: [],
		};
	}
	movement(options = { controller: false, id: 0 }) {
		let action = createVector();
		if (options.controller) {
			if (listener.handlers[options.id]) {
				action.add(createVector(listener.handlers[options.id].axes[0], listener.handlers[options.id].axes[1]));
			}
		} else {
			if (this.settings.key[options.id]) {
				if (keyIsDown(this.settings.key[options.id][0])) {
					action.x -= 1;
				}
				if (keyIsDown(this.settings.key[options.id][1])) {
					action.x += 1;
				}
				if (keyIsDown(this.settings.key[options.id][2])) {
					action.y -= 1;
				}
				if (keyIsDown(this.settings.key[options.id][3])) {
					action.y += 1;
				}
			}
		}
		return action;
	}
}
class DictionaryEntries {
	constructor(value, ...args) {
		/** @type {String} */
		this.id = crypto.randomUUID();
		/** @type {GameObject | t.GamepadWrapper | null} */
		this.value = value ?? null;

		if (args[0]?.emit) {
			// console.log("emiting", GameObjects.getItemByClass(args[0]?.recieverClass));

			if (args[0]?.recieverClass) {
				if (GameObjects.getItemByClass(args[0]?.recieverClass)) {
					GameObjects.getItemByClass(args[0]?.recieverClass).assignReferences(this.id);
				}
			}
		}
	}
}
class GameObject {
	constructor(...args) {
		this.position = createVector(args[0]?.x ?? 0, args[0]?.y ?? 0);
		this.dimension = createVector(args[0]?.width ?? 0, args[0]?.height ?? 0);
		this.recieveReferences = args[0]?.recieveReferences ?? false;
		this.immovable = args[0]?.immovable ?? false;
		/** @type {Array<string>} */
		this.references = [];
	}
	assignReferences(ref) {
		if (this.recieveReferences) {
			this.references.push(ref);
		}
	}
}
class Camera extends GameObject {
	constructor(...args) {
		super({ ...args, x: width / 2, y: height / 2, recieveReferences: true });
		this.velocity = createVector();
		this.acceleration = createVector();
		this.targetPosition = createVector(width / 2, height / 2);
		this.easing = 0.1;
	}
	proccess() {
		// Create arrays to hold player positions
		let xaxis = [];
		let yaxis = [];

		// Collect positions of all players referenced
		for (let playerUUID of this.references) {
			let player = GameObjects.getItemById(playerUUID);
			if (player) {
				// Ensure the player exists
				xaxis.push(player.position.x);
				yaxis.push(player.position.y);
			}
		}

		// Calculate the median position for the players
		if (xaxis.length > 0 && yaxis.length > 0) {
			let medianX = width * 0.5 - round(_.reduce(xaxis, (sum, n) => sum + n) / _.size(xaxis));
			let medianY = height * 0.5 - round(_.reduce(yaxis, (sum, n) => sum + n) / _.size(yaxis));
			this.targetPosition.set(medianX, medianY);
		}

		this.position.x += floor((this.targetPosition.x - this.position.x) * easeOutExpo2(deltaTime * 0.001));
		this.position.y += floor((this.targetPosition.y - this.position.y) * easeOutExpo2(deltaTime * 0.001));
	}
}

const GameObjects = new Dictionary();
const GameInputs = new Input();

class Player extends GameObject {
	constructor(...args) {
		super({ ...args, width: 25 });
		this.velocity = createVector();
		this.acceleration = createVector();
		this.speed = 125;
		this.input = {
			controller: args?.[0]?.controller ?? false,
			id: args?.[0]?.controlID ?? 0,
		};
		this.rope = {
			ref: [],
			dist: 100,
		};
	}
	proccess() {
		if (!this.immovable) {
			let action = createVector();
			action.add(GameInputs.movement(this.input));

			action.normalize().mult(this.speed);

			this.acceleration.add(action);
			this.velocity.add(this.acceleration);
			this.position.add(p5.Vector.mult(this.velocity, deltaTime * 0.001));

			if (this.velocity.mag() < this.speed * 0.25) {
				this.velocity.set(0, 0);
			} else {
				this.velocity.mult(1 - easeOutExpo(deltaTime * 0.001));
				// this.velocity.mult(0.8);
			}
			this.acceleration.set(0, 0);
		}
	}
	render() {
		push();
		stroke(0);
		circle(this.position.x, this.position.y, this.dimension.x);
		if (!PRODUCTION) {
			stroke("#c1121f").strokeWeight(4);
			line(this.position.x, this.position.y, this.position.x + this.acceleration.x * 0.1, this.position.y + this.acceleration.y * 0.1);
			stroke("#669bbc").strokeWeight(4);
			line(this.position.x, this.position.y, this.position.x + this.velocity.x * 0.1, this.position.y + this.velocity.y * 0.1);
		}
		pop();
	}
}

class RopePoint {
	//integrates motion equations per node without taking into account pos
	//with other nodes...
	static integrate(point, gravity, dt, previousFrameDt) {
		point.velocity = p5.Vector.sub(point.pos, point.oldPos);

		point.oldPos = point.pos.copy(); // { ...point.pos };

		//drastically improves stability
		let timeCorrection = previousFrameDt != 0.0 ? dt / previousFrameDt : 0.0;

		// let accel = p5.Vector.add(gravity, { x: 0, y: point.mass });
		let accel = p5.Vector.add(gravity, createVector(0, point.mass));

		const velCoef = timeCorrection * point.damping;
		const accelCoef = Math.pow(dt, 2);

		point.pos.x += point.velocity.x * velCoef + accel.x * accelCoef;
		point.pos.y += point.velocity.y * velCoef + accel.y * accelCoef;
	}

	//apply constraints related to other nodes next to it
	//(keeps each node within distance)
	static constrain(point) {
		if (point.next) {
			const delta = p5.Vector.sub(point.next.pos, point.pos);
			const len = p5.Vector.mag(delta);
			const diff = len - point.distanceToNextPoint;
			const normal = p5.Vector.normalize(delta);

			if (!point.isFixed) {
				point.pos.x += normal.x * diff * 0.25;
				point.pos.y += normal.y * diff * 0.25;
			}

			if (!point.next.isFixed) {
				point.next.pos.x -= normal.x * diff * 0.25;
				point.next.pos.y -= normal.y * diff * 0.25;
			}
		}
		if (point.prev) {
			const delta = p5.Vector.sub(point.prev.pos, point.pos);
			const len = p5.Vector.mag(delta);
			const diff = len - point.distanceToNextPoint;
			const normal = p5.Vector.normalize(delta);

			if (!point.isFixed) {
				point.pos.x += normal.x * diff * 0.25;
				point.pos.y += normal.y * diff * 0.25;
			}

			if (!point.prev.isFixed) {
				point.prev.pos.x -= normal.x * diff * 0.25;
				point.prev.pos.y -= normal.y * diff * 0.25;
			}
		}
	}
	constructor(initialPos, distanceToNextPoint) {
		this.pos = initialPos;
		this.distanceToNextPoint = distanceToNextPoint;
		this.isFixed = false;
		this.oldPos = initialPos.copy(); // { ...initialPos };
		this.velocity = createVector(0, 0); // Vector2.zero();
		this.mass = 1.0;
		this.damping = 1.0;
		this.prev = null;
		this.next = null;
	}
}

class Rope {
	//generate an array of points suitable for a dynamic
	//rope contour
	static generate(start, end, resolution, mass, damping) {
		const delta = p5.Vector.sub(end, start);
		const len = p5.Vector.mag(delta);

		let points = [];
		const pointsLen = len / resolution;

		for (let i = 0; i < pointsLen; i++) {
			const percentage = i / (pointsLen - 1);

			const lerpX = lerp(start.x, end.x, percentage);
			const lerpY = lerp(start.y, end.y, percentage);

			points[i] = new RopePoint(createVector(lerpX, lerpY), resolution);
			points[i].mass = mass;
			points[i].damping = damping;
		}

		//Link nodes into a doubly linked list
		for (let i = 0; i < pointsLen; i++) {
			const prev = i != 0 ? points[i - 1] : null;
			const curr = points[i];
			const next = i != pointsLen - 1 ? points[i + 1] : null;

			curr.prev = prev;
			curr.next = next;
		}

		points[0].isFixed = points[points.length - 1].isFixed = true;

		return points;
	}

	constructor(points, solverIterations) {
		this._points = points;
		this.update = this.update.bind(this);
		this._prevDelta = 0;
		this._solverIterations = solverIterations;

		this.getPoint = this.getPoint.bind(this);
	}

	getPoint(index) {
		return this._points[index];
	}

	update(gravity, dt) {
		for (let i = 1; i < this._points.length - 1; i++) {
			let point = this._points[i];

			let accel = gravity.copy(); // { ...gravity };

			RopePoint.integrate(point, accel, dt, this._prevDelta);
		}

		for (let iteration = 0; iteration < this._solverIterations; iteration++)
			for (let i = 1; i < this._points.length - 1; i++) {
				let point = this._points[i];
				RopePoint.constrain(point);
			}

		this._prevDelta = dt;
	}
}

function init(value, ...args) {
	GameObjects.assignEntry(value, ...args);
}
