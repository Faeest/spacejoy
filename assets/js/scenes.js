let totalPlayer = 1;
let worldEnvirontment;
function GameScene() {
	this.setup = () => {
		for (let index = 0; index < min(5, totalPlayer); index++) {
			let startingpoint = createVector(1, 0).setHeading((360 / min(5, totalPlayer)) * index);
			GameObjects.assignEntry(new Player(startingpoint.x, startingpoint.y, 40), { type: "player" });
		}
		gameRopes = GameObjects.assignEntry(new RopeManager(), { type: "rope" });
		if (totalPlayer > 1) {
			_.forEach(GameObjects.getAllItemByType("player"), (e) => {
				gameRopes.value.assignPlayerRef(e.id);
			});
			gameRopes.value.generate();
		}

		worldEnvirontment = new Mud(100, 0, 50);
		GameObjects.assignEntry(worldEnvirontment, { type: "environtment" });
		frameRate(60);
	};
	this.draw = () => {
		background(0);
		centerCamera();
		Utilities.renderGrid(camera.position);
		camera.on();

		worldEnvirontment.draw();
		push();
		gameRopes.value.update();
		gameRopes.value.render();
		pop();
		push();
		GameObjects.getAllItemByType("player").forEach((e) => {
			e.value.update();
			e.value.draw();
		});
		GameObjects.getAllItemByType("player").forEach((e) => {
			e.value?.update2?.();
			e.value?.draw2?.();
		});
		pop();
	};
}
function MenuScene() {
	this.bg = "#090A0B";
	this.totalPlayer = 2;
	this.setup = () => {
		GameGUI = createGui();
		GameGUI.customStyle = {
			fillBg: color("#f8f9fa"),
			fillBgHover: color("#dee2e6"),
			fillBgActive: color("#CED4DA"),
			strokeBg: color(this.bg),
			strokeBgActive: color(this.bg),
			strokeBgHover: color(this.bg),
		};
		let GUIbutton = GameGUIs.assignEntry(createButton("Start", width * 0.5 - 200 * 0.5, height * 0.75, 200, 42));
		let GUIslider = GameGUIs.assignEntry(createSlider("Players", width * 0.5 - 300 * 0.5, height * 0.5, 300, 32, 1, 5));
		GUIbutton.value.setStyle({ ...GameGUI.customStyle, textSize: 24 });
		GUIslider.value.setStyle(GameGUI.customStyle);
		GUIslider.value.val = totalPlayer;
		GameGUI.setFont(GameFonts.index(1).value);
		GameGUI.setStrokeWeight(3);
		GameGUI.setTrackWidth(0);
		GameGUI.setRounding(0);
		this.sliderID = GUIslider.id;
		GUIbutton.value.onPress = () => {
			totalPlayer = GameGUIs.getItemById(this.sliderID).val;
			sceneManager.showNextScene();
			GUIbutton.value.visible = false;
			GUIslider.value.visible = false;
		};
	};
	this.draw = () => {
		background(this.bg);
		Utilities.renderGrid(camera.position);
		fill(255);
		push();
		fill("#f8f9fa");
		strokeWeight(10);
		stroke(this.bg);
		textAlign(CENTER).textSize(80).textFont(GameFonts.first().value);
		text("SPACEJOY", width * 0.5, height * 0.352);
		textSize(30).textFont(GameFonts.index(1).value);
		text("PLAYERS", width * 0.5, height * 0.475);
		textSize(50).textFont(GameFonts.first().value);
		GameGUIs.getItemById(this.sliderID).val = _.round(GameGUIs.getItemById(this.sliderID).val);
		text(GameGUIs.getItemById(this.sliderID).val, width * 0.5, height * 0.65);
		pop();
		drawGui();
	};
}
