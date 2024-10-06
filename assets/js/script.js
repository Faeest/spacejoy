const PRODUCTION = 0;
const GlobalDeadZoneThreshold = 0.01;
// const PRODUCTION = 1;
window._p5play_gtagged = false;

/** @type {Dictionary} */
const GameGUIs = new Dictionary();

/** @type {Dictionary} */
const GameObjects = new Dictionary();

const GameInputs = new Input();
let gamecanvas;
let gameRopes;
/** @type {Dictionary} */
const GameFonts = new Dictionary();

function preload() {
	GameFonts.assignEntry(loadFont("./assets/font/minecrafter.reg.ttf"));
	GameFonts.assignEntry(loadFont("./assets/font/minecraft.ttf"));
}
function setup() {
	p5play.renderStats = true;
	camera.x = 0;
	camera.y = 0;
	GameObjects.assignEntry(new Canvas(600, 600));
	world.gravity = { x: 0, y: 0 };
	sceneManager = new SceneManager();
	sceneManager.addScene(MenuScene);
	sceneManager.addScene(GameScene);

	sceneManager.showNextScene();
}
function draw() {
	// background(0, 0.3);
	sceneManager.draw();
	// Utilities.renderFPS();
	// Utilities.renderDelta();
	Utilities.debug([...GameObjects.getAllItemByType("player")]);
}
function centerCamera() {
	let centered = getMedianPlayerPosition();
	let cameraAddition = [_.round((centered.x - camera.x) * easeOutExpo2(deltaTime * 0.001)), _.round((centered.y - camera.y) * easeOutExpo2(deltaTime * 0.001))];
	camera.x += cameraAddition[0];
	camera.y += cameraAddition[1];
}
function getMedianPlayerPosition() {
	const players = GameObjects.getAllItemByType("player");

	if (players.length === 0) {
		return createVector(0, 0);
	}

	// Collect x and y positions separately
	const xaxis = players.map((player) => player.value.position.x);
	const yaxis = players.map((player) => player.value.position.y);

	// Calculate the median positions
	const medianX = _.mean(xaxis);
	const medianY = _.mean(yaxis);

	return createVector(medianX, medianY);
}
