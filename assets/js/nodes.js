class Dictionary {
	constructor() {
		/** @type {Array<DictionaryEntries>} */
		this.entries = [];
	}
	assignEntry(value, ...args) {
		let res = new DictionaryEntries(value, ...args);
		this.entries.push(res);
		return res;
	}
	/** @returns {GameObject} */
	getItemById(id = "") {
		return _.find(this.entries, (e) => {
			return e.id == id;
		})?.value;
	}
	/** @returns {GameObject} */
	getItemByType(type = "") {
		return _.find(this.entries, (e) => {
			return e.type == type;
		})?.value;
	}
	/** @returns {GameObject} */
	getItemByClass(classes = "") {
		return _.find(this.entries, (e) => {
			return e.value.constructor.name == classes;
		})?.value;
	}
	/** @returns {DictionaryEntries[]} */
	getAllItemById(id = "") {
		return _.filter(this.entries, (e) => {
			return e.id == id;
		});
	}
	/** @returns {DictionaryEntries[]} */
	getAllItemByType(type = "") {
		return _.filter(this.entries, (e) => {
			return e.type == type;
		});
	}
	/** @returns {DictionaryEntries[]} */
	getAllItemByClass(classes = "") {
		return _.filter(this.entries, (e) => {
			return e.value.constructor.name == classes;
		});
	}
	/** @returns {DictionaryEntries[]} */
	getAllCollidable() {
		return _.filter(this.entries, (e) => {
			return e.value.collidable;
		});
	}
	proccessAll() {
		for (let entries of this.entries) {
			entries?.proccess?.();
		}
	}
	index(idx = 0) {
		return this.entries[idx];
	}
	first() {
		return this.entries[0];
	}
	last() {
		return this.entries[this.entries.length - 1];
	}
}
class Input {
	constructor() {
		this.settings = {
			key: [
				["a", "d", "w", "s"], // wasd
				["arrowLeft", "arrowRight", "arrowUp", "arrowDown"], // arrow
			],
			taken: {
				key: [],
				controller: [],
			},
		};
	}
	calculateControllerInput(controllerInput, deadZoneThreshold = GlobalDeadZoneThreshold) {
		// Check for finite numbers and apply the dead zone
		let adjustedInput = {
			x: Math.abs(controllerInput.x) < deadZoneThreshold ? 0 : controllerInput.x,
			y: Math.abs(controllerInput.y) < deadZoneThreshold ? 0 : controllerInput.y,
		};

		return createVector(adjustedInput.x, adjustedInput.y);
	}
	movement(options = { searchControl: false, controller: false, id: 0 }) {
		if (options.searchControl) return;
		let action = createVector();
		if (options.controller) {
			if (contros[options.id]) {
				action.add(this.calculateControllerInput(contros[options.id].leftStick));
			}
		} else {
			if (this.settings.key[options.id]) {
				if (keyboard.pressing(this.settings.key[options.id][0])) {
					action.x -= 1;
				}
				if (keyboard.pressing(this.settings.key[options.id][1])) {
					action.x += 1;
				}
				if (keyboard.pressing(this.settings.key[options.id][2])) {
					action.y -= 1;
				}
				if (keyboard.pressing(this.settings.key[options.id][3])) {
					action.y += 1;
				}
			}
		}
		return action;
	}
	assign() {
		let res = { searchControl: true, controller: false, id: 0 };
		contros.forEach((controller, controllerId) => {
			if (!res.searchControl || _.includes(this.settings.taken.controller, controllerId)) return;
			["a", "b", "x", "y"].forEach((key) => {
				if (controller.pressing(key) && res.searchControl) {
					res.controller = true;
					res.id = controllerId;
					this.settings.taken.controller.push(controllerId);
					res.searchControl = false;
					return;
				}
			});
		});
		this.settings.key.forEach((keys, keyId) => {
			if (!res.searchControl || _.includes(this.settings.taken.key, keyId)) return;
			keys.forEach((key) => {
				if (keyboard.pressing(key) && res.searchControl) {
					res.controller = false;
					res.id = keyId;
					this.settings.taken.key.push(keyId);
					res.searchControl = false;
					return;
				}
			});
		});
		if (res.searchControl) return false;

		return res;
	}
}
class DictionaryEntries {
	constructor(value, ...args) {
		/** @type {String} */
		this.id = crypto.randomUUID();
		this.type = args[0]?.type || "object";
		/** @type {GameObject | null} */
		this.value = value ?? null;
		if (this.value) {
			this.value.id = this.id;
		}
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
p5.prototype.registerMethod("beforeSetup", function nodeInit() {
	this.Player = class Player extends Sprite {
		constructor(x, y, w, h, collider, ...args) {
			super(x, y, w, h, collider);
			this.movementSpeed = args[0]?.movementSpeed || 100;
			this.friction = args[0]?.friction || 10;
			this.mass = args[0]?.mass || 100;
			this.autoDraw = false;
			this.autoUpdate = false;
			this.input = {
				searchControl: true,
				controller: args?.[0]?.controller ?? false,
				id: args?.[0]?.controlID ?? 0,
			};
			this.rope = {
				ref: [],
				dist: 100,
			};
		}
		update2() {
			if (this.input.searchControl) {
				this.input = GameInputs.assign() || this.input;
			}
			gameRopes.value.getConnectedRope(this.id).forEach((ee) => {
				let objId = ee;
				let obj = GameObjects.getItemById(objId);
				let distance = p5.Vector.dist(this.position, obj.position);
				let maxDist = 100;
				if (distance > maxDist) {
					// Calculate the pull force
					let forceDirection = p5.Vector.sub(this.position, obj.position).normalize();
					// Proportional pull
					let forceMagnitude = ceil(distance - maxDist * 0.95);
					let force = p5.Vector.mult(forceDirection, forceMagnitude);
					let impulseScalar = -1;
					// Apply the pull force to this player and the obj
					this.velocity.add(p5.Vector.mult(force, impulseScalar / this.mass));
					// obj.velocity.sub(p5.Vector.mult(force, impulseScalar / obj.mass));
				}
			});
			camera.on();
			push();
			stroke(0);
			let vel = GameInputs.movement(this.input);
			if (vel) {
				let { x, y } = vel.normalize().mult(this.movementSpeed);
				this.applyForceScaled(x, y);
			}
			this.velocity.mult(1 - easeOutExpo(deltaTime * 0.001));
		}
		draw2() {
			if (!PRODUCTION) {
				stroke("#669bbc");
				strokeWeight(4);
				line(this.x, this.y, this.x + this.velocity.x * 5, this.y + this.velocity.y * 5);
			}
			pop();
		}
	};
	this.RopePoint = class {
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
	};
	this.Rope = class {
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

		constructor(points, solverIterations, anchors) {
			this._anchors = anchors;
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
				let accel = gravity.copy();
				RopePoint.integrate(point, accel, dt, this._prevDelta);
			}
			for (let iteration = 0; iteration < this._solverIterations; iteration++)
				for (let i = 1; i < this._points.length - 1; i++) {
					let point = this._points[i];
					RopePoint.constrain(point);
				}
			this._prevDelta = dt;
		}
	};
	this.RopeManager = class {
		constructor(options = { mode: "closed" || "single" }) {
			/** @type {Array<Rope>} */
			this.ropes = [];
			/** @type {String} */
			this.playerRef = [];
			this.mode = options.mode ?? "closed";
			this.args = {
				start: createVector(0, 0),
				end: createVector(0, 100),
				resolution: 8,
				mass: 0.88,
				damping: 0.95,
				gravity: createVector(0, 0),
				solverIterations: 100,
				ropeColour: color("#adb5bd"),
				ropeSize: 4,
			};
		}
		assignPlayerRef(ref = "") {
			this.playerRef.push(ref);
			return ref;
		}
		generate() {
			Array(this.playerRef.length)
				.fill(0)
				.forEach((e, x) => {
					let points = Rope.generate(this.args.start, this.args.end, this.args.resolution, this.args.mass, this.args.damping);
					this.ropes.push(new Rope(points, this.args.solverIterations, [this.playerRef[x], this.playerRef[(x + 1) % this.playerRef.length]]));
				});
		}
		update() {
			this.ropes.forEach((e) => {
				if (e._anchors.length == 2) {
					let pointfirst = e.getPoint(0);
					pointfirst.pos.set(GameObjects.getItemById(e._anchors[0]).position);
					let pointlast = e.getPoint(e._points.length - 1);
					pointlast.pos.set(GameObjects.getItemById(e._anchors[1]).position);
				}
				e.update(createVector(0, 0), deltaTime * 0.001);
			});
		}
		getConnectedRope(id = "") {
			let res = [];
			for (const rope of this.ropes) {
				const index = rope._anchors.indexOf(id);
				if (index !== -1) {
					// Push the first anchor that's not the given id
					const connectedAnchor = rope._anchors[index === 0 ? 1 : 0] || rope._anchors[0]; // Safeguard for when id is the only anchor
					res.push(connectedAnchor);
				}
			}
			return res;
		}

		render() {
			this.ropes.forEach((e) => {
				let points = e._points;
				let colour = this.args.ropeColour;
				let lw = this.args.ropeSize;
				for (let i = 0; i < points.length; i++) {
					const p = points[i];
					const prev = i > 0 ? points[i - 1] : null;
					if (prev) {
						stroke(colour);
						strokeWeight(lw);
						line(prev.pos.x, prev.pos.y, p.pos.x, p.pos.y);
					}
				}
			});
		}
	};
});

function init(value, ...args) {
	GameObjects.assignEntry(value, ...args);
}
