// a GameObjects constant is made with Dicionary class which have DictionaryEntries array as it's value. GameObject class was made for the base of any object in the game, It have reference whic will work if other object as the children assign them self as the children. The assignment proccess was to assign children UUID inside the parent references property. in this way parent can call the children using GameObjects<Dictionary> method for meassurement or anything todo with the game
class Dictionary {
	constructor() {
		/** @type {Array<DictionaryEntries>} */
		this.entries = [];
	}
	assignEntry(value, ...args) {
		this.entries.push(new DictionaryEntries(value, ...args));
	}
	/** @returns {DictionaryEntries} */
	getItemById(id = "") {
		return _.find(this.value, (e) => e.id == id);
	}
	/** @returns {DictionaryEntries} */
	getItemByClass(classes = "") {
		return _.find(this.entries, (e) => {
			return e.value.constructor.name == classes;
		});
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
			console.log("emiting", GameObjects.getItemByClass(args[0]?.recieverClass));

			if (args[0]?.recieverClass) {
				if (GameObjects.getItemByClass(args[0]?.recieverClass)) {
					GameObjects.getItemByClass(args[0]?.recieverClass).value.assignReferences(this.id);
				}
			}
		}
	}
}
class GameObject {
	constructor(args = {}) {
		this.position = createVector(args.x ?? 0, args.y ?? 0);
		this.dimension = createVector(args.width ?? 0, args.height ?? 0);
		this.recieveReferences = args.recieveReferences ?? false;
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
		super({ ...args, recieveReferences: true });
	}
}
class Player extends GameObject {
	constructor(...args) {
		super(...args);
	}
}
