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
const GameObjects = new Dictionary();
function init(value, ...args) {
	GameObjects.assignEntry(value, ...args);
}
class DictionaryEntries {
	constructor(value, ...args) {
		/** @type {String} */
		this.id = crypto.randomUUID();
		/** @type {GameObject | null} */
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
		this.easing = 0.5;
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

		this.position.x += floor((this.targetPosition.x - this.position.x) * this.easing);
		this.position.y += floor((this.targetPosition.y - this.position.y) * this.easing);
	}
}
class Player extends GameObject {
	constructor(...args) {
		super({ ...args, width: 25 });
		this.velocity = createVector();
		this.acceleration = createVector();
		this.speed = 200;
	}
	proccess() {
		if (!this.immovable) {
			let action = createVector();
			if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
				action.x -= this.speed;
			}
			if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
				action.x += this.speed;
			}
			if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
				action.y -= this.speed;
			}
			if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
				action.y += this.speed;
			}
			action.normalize().mult(this.speed);
			this.acceleration.add(action);
			this.velocity.add(this.acceleration);

			this.position.add(p5.Vector.mult(this.velocity, deltaTime * 0.001));

			if (this.velocity.mag() < this.speed) {
				this.velocity.set(0, 0);
			} else {
				this.velocity.mult(0.8);
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
