var body = document.querySelector('body');
var canvasId = 'adam-engine';

// AdamEngine class
var AdamEngine = function(canvasId) {
	/*** GENERAL ***/
	/* GENERAL: PRIVATE PROPERTIES */
	var canvas = document.getElementById(canvasId);
	var canvasData = canvas.getBoundingClientRect();
	var ctx = canvas.getContext('2d');
	var focus = false; // true if canvas is in focus or not
	var loading = true; // true if engine is still loading assets
	


	/*** GAME OBJECTS ***/
	/* GAME OBJECTS: CLASSES */
	// GameObj class
	var GameObj = function(typeName) {
		// private properties
		var type = typeName;

		// public properties
		this.state = {};

		// private methods
		function getType() {
			return type;
		}

		// privileged methods
		this.getType = function() {
			return getType();
		};
	};

	// GameObj public methods
	GameObj.prototype.setup = function() {};

	GameObj.prototype.update = function() {};

	// WorldObj class
	function WorldObj() {
		GameObj.call(this, 'world-obj'); // inherit from GameObj

		// set default state
		this.state.worldObjType = null;
		this.state.pos = {x: 0, y: 0};
		this.state.size = {w: 0, h: 0};
		this.state.image = null;
		this.state.color = null;
		this.state.stroke = null;
		this.state.zIndex = 0;
	}

	// WorldObj public methods
	WorldObj.prototype = Object.create(GameObj.prototype);
	WorldObj.prototype.constructor = WorldObj;


	/* GAME OBJECTS: PRIVATE PROPERTIES */
	var worldObjs = {};
	var storeObjs = {};
	var renderPipe = []; // determines rendering order of world objs


	/* GAME OBJECTS: PRIVATE METHODS */
	function createWorldObj(worldObjName) {
		if(worldObjs[worldObjName]) {
			console.error('A world object with the name "' + worldObjName + '" already exists!');
		} else {
			worldObjs[worldObjName] = new WorldObj();
			return worldObjs[worldObjName];
		}
	}

	function deleteWorldObj(worldObjName) {
		delete worldObjs[worldObjName];
	}


	/* GAME OBJECTS: PRIVILEGED METHODS */
	this.createWorldObj = function(worldObjName) {
		return createWorldObj(worldObjName);
	}

	this.deleteWorldObj = function(worldObjName) {
		return deleteWorldObj(worldObjName);
	}


	/*** INPUT MANAGER ***/
	// InputManager class
	function InputManager() {
		// private properties
		var inputMap = {
			keys: {},
			mbs: {}
		};

		var inputState = {
			keys: {},
			mbs: {}
		};

		// private methods
		function getKeyState(keyName) {
			return inputState.keys[keyName];
		}

		function getMBState(mbName) {
			return inputState.mbs[mbName];
		}

		// privileged methods
		this.setup = function() {
			document.addEventListener('keydown', function(e) {
				if(focus) {
					e.preventDefault();
					var keyName = inputMap.keys[e.keyCode];
					if(keyName) {
						inputState.keys[keyName] = true;
						// console.log(keyName, inputState.keys[keyName]);
					}
				}
			}.bind(this));

			document.addEventListener('keyup', function(e) {
				if(focus) {
					var keyName = inputMap.keys[e.keyCode];
					if(keyName) {
						inputState.keys[keyName] = false;
						// console.log(keyName, inputState.keys[keyName]);
					}
				}
			}.bind(this));

			document.addEventListener('mousedown', function(e) {
				if(e.target === canvas) {
					focus = true;
				} else {
					focus = false;
				}

				var mbName = inputMap.mbs[e.button];
				if((mbName) && (e.target === canvas)) {
					inputState.mbs[mbName].isActive = true;
					inputState.mbs[mbName].pos.x = e.clientX - canvasData.left;
					inputState.mbs[mbName].pos.y = e.clientY - canvasData.top;
					// console.log(mbName, inputState.mbs[mbName]);
				}
			}.bind(this));

			document.addEventListener('mouseup', function(e) {
				var mbName = inputMap.mbs[e.button];
				if(mbName && (e.target === canvas)) {
					inputState.mbs[mbName].isActive = false;
					// console.log(mbName, inputState.mbs[mbName]);
				}
			}.bind(this));

			// TODO: add listener for mousemove
		};

		this.addKeyInput = function(keyCode, keyName) {
			inputMap.keys[keyCode] = keyName;
			inputState.keys[keyName] = false;
		};

		this.resetKeyState = function() {
			for(var i in inputState.keys) {
				inputState.keys[i] = false;
			}
		};

		this.addMBInput = function(button, mbName) {
			inputMap.mbs[button] = mbName;
			inputState.mbs[mbName] = {
				isActive: false,
				pos: {
					x: null,
					y: null
				}
			};
		};

		// TODO: add method to remove inputs

		this.getKeyState = function(keyName) {
			return getKeyState(keyName);
		};

		this.getMBState = function(mbName) {
			return getMBState(mbName);
		};
	}

	/* INPUT MANAGER: PUBLIC PROPERTIES */
	this.inputMan = new InputManager();



	/*** ASSET MANAGER ***/
	// AssetManager class
	function AssetManager() {
		// private properties
		var loadedAssets = 0;
		var totalAssets = 0;
		var atlases = [];

		// private methods
		function loadFinishCheck() {
			if(loadedAssets === totalAssets) {
				loading = false;
				console.log('Loading completed!');
			}
		}

		// privileged methods
		this.newAtlas = function(imageLoc, dataLoc) {
			var image = new Image();
			image.imageLoc = imageLoc;
			image.onload = function() {
				++loadedAssets;
				console.log('Loaded assets: ' + loadedAssets);

				loadFinishCheck();
			};

			var data = new XMLHttpRequest();
			data.responseType = 'json';
			data.open('GET', dataLoc, true);
			data.responseType = 'json';
			data.onload = function(response) {
				++loadedAssets;
				console.log('Loaded assets: ' + loadedAssets);

				loadFinishCheck();
			};

			// TODO: onerror retry load

			totalAssets = totalAssets + 2;

			var atlas = {image: image, data: data};
			atlases.push(atlas);
		};

		this.loadAssets = function() {
			for(var i in atlases) {
				atlases[i].image.src = atlases[i].image.imageLoc;
				atlases[i].data.send();
			}
		};
	}


	/* ASSET MANAGER: PUBLIC PROPERTIES */
	this.assetMan = new AssetManager();



	/*** GAME LOOP ***/
	/* GAME LOOP: PRIVATE METHODS */
	function setupWorldObjs() {
		renderPipe = []; // recreate renderPipe
		for(var worldObjName in worldObjs) {
			worldObjs[worldObjName].setup();
			renderPipe.push(worldObjs[worldObjName]);
		}

		renderPipe.sort(function(a, b) {
			if(a.state.zIndex > b.state.zIndex) {
				return 1;
			}
			if(a.state.zIndex < b.state.zIndex) {
				return -1;
			}
			return 0;
		});
	}

	function update() {
		for(var worldObjName in worldObjs) {
			worldObjs[worldObjName].update();
		}
	}

	function render() {
		ctx.clearRect(0, 0, canvasData.width, canvasData.height);

		// render all pos x & y of all world objs
		for(var i in renderPipe) {
			var worldObj = renderPipe[i];
			if(worldObj.getType() === 'world-obj') {
				if(worldObj.state.worldObjType === 'rect') {
					ctx.fillStyle = worldObj.state.color;
					ctx.fillRect(worldObj.state.pos.x, worldObj.state.pos.y, worldObj.state.size.w, worldObj.state.size.h);

					if(worldObj.state.stroke !== null) {
						ctx.strokeStyle = worldObj.state.stroke.color;
						ctx.strokeRect(worldObj.state.stroke.pos.x, worldObj.state.stroke.pos.y, worldObj.state.stroke.size.w, worldObj.state.stroke.size.h);
					}
				}
			}
		}
	}

	function gameLoop() {
		update();
		render();
		requestAnimationFrame(gameLoop);
	}


	/* GAME LOOP: PRIVILEGED METHODS */
	this.start = function() {
		setupWorldObjs(); // run setup for all world objs
		requestAnimationFrame(gameLoop); // start game loop
	};
};



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
