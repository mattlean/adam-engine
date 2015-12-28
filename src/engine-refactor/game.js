(function(){
	var AE = new AdamEngine(canvasId);

	AE.assetMan.newAtlas('/img/atlas.png', '/img/atlas.json');
	AE.assetMan.loadAssets();

	AE.inputMan.addKeyInput(37, 'LEFT');
	AE.inputMan.addKeyInput(38, 'UP');
	AE.inputMan.addKeyInput(39, 'RIGHT');
	AE.inputMan.addKeyInput(40, 'DOWN');
	AE.inputMan.addMBInput(0, 'LEFTCLICK');
	AE.inputMan.setup();

	var test = AE.createWorldObj('test');
	test.setup = function() {
		this.state.pos = {
			x: 10,
			y: 10
		};

		this.state.size = {
			w: 10,
			h: 10
		};

		this.state.worldObjType = 'rect';
		this.state.color = '#0000FF';
	};

	test.update = function() {
		this.state.pos.x += 1;
		this.state.pos.y += 1;
	};

	var test2 = AE.createWorldObj('test2');
	test2.setup = function() {
		this.state.pos = {
			x: 5,
			y: 5
		};

		this.state.size = {
			w: 20,
			h: 20
		};

		this.state.worldObjType = 'rect';
		this.state.color = '#FF0000';
		this.state.zIndex = 200;
	};

	test2.update = function() {
		this.state.pos.y += 2;
	}

	var zone = AE.createWorldObj('zone');
	zone.setup = function() {
		this.state.pos = {
			x: 50,
			y: 50
		};

		this.state.size = {
			w: 30,
			h: 30
		};

		this.state.worldObjType = 'rect';
		this.state.color = '#000';
		this.state.zIndex = 9001;
	}

	var player = AE.createWorldObj('player');
	player.setup = function() {
		this.state.pos = {
			x: 10,
			y: 10
		};

		this.state.size = {
			w: 10,
			h: 10
		};

		this.state.worldObjType = 'rect';
		this.state.color = '#00FF00';
		this.state.stroke = {
			pos: this.state.pos,
			size: this.state.size,
			color: '#FFF'
		};
		this.state.zone = zone;
		this.state.zIndex = 200;
	};

	var zone2 = AE.createWorldObj('zone2');
	zone2.setup = function() {
		this.state.pos = {
			x: 100,
			y: 50
		};

		this.state.size = {
			w: 40,
			h: 40
		};

		this.state.worldObjType = 'rect';
		this.state.color = '#000';
		this.state.zIndex = 100;
	};

	player.update = function() {
		if(AE.inputMan.getKeyState('LEFT')) {
			this.state.pos.x -= 1;
		} else if(AE.inputMan.getKeyState('RIGHT')) {
			this.state.pos.x += 1;
		}

		if(AE.inputMan.getKeyState('UP')) {
			this.state.pos.y -= 1;
		} else if(AE.inputMan.getKeyState('DOWN')) {
			this.state.pos.y += 1;
		}

		if(AE.inputMan.getMBState('LEFTCLICK').isActive) {
			console.log('teehee~');
		}

		if(
			(this.state.pos.x < (this.state.zone.state.pos.x + this.state.zone.state.size.w)) &&
			((this.state.pos.x + this.state.size.w) > this.state.zone.state.pos.x) &&
			(this.state.pos.y < (this.state.zone.state.pos.y + this.state.zone.state.size.h)) &&
			((this.state.pos.y + this.state.size.h) > this.state.zone.state.pos.y)
		) {
			console.log('player collision with zone');
		}
	};

	AE.start();
}());
