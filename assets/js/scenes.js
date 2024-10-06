let totalPlayer = 2;
function GameScene() {
	this.setup = () => {
		for (let index = 0; index < min(5, totalPlayer); index++) {
			GameObjects.assignEntry(new Player(0, 0, 40), { type: "player" });
		}
		gameRopes = GameObjects.assignEntry(new RopeManager());
		_.forEach(GameObjects.getAllItemByType("player"), (e) => {
			gameRopes.value.assignPlayerRef(e.id);
		});
		gameRopes.value.generate();
		frameRate(60);
	};
	this.draw = () => {
		camera.on();
		background(0);
		centerCamera();
		Utilities.renderGrid(camera.position);
		gameRopes.value.update();
		camera.on();
		gameRopes.value.render();
		camera.off();
		push();
		GameObjects.getAllItemByType("player").forEach((e) => {
			e.value.update();
			e.value.update2();
			e.value.draw();
			e.value.draw2();
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
		GUIslider.value.val = 2;
		GameGUI.setFont(GameFonts.index(1).value);
		GameGUI.setStrokeWeight(3);
		GameGUI.setTrackWidth(0);
		GameGUI.setRounding(0);
		this.sliderID = GUIslider.id;
		GUIbutton.value.onPress = () => {
			totalPlayer = GameGUIs.getItemById(this.sliderID).val;
			sceneManager.showNextScene();
		};
		// GUIbutton.value.visible = false;
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
		if (GameGUIs.first().value.isPressed) {
			print(GameGUIs.first().value.label + " is pressed.");
		}
	};
}
