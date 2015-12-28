var body = document.querySelector('body');
var canvas = document.getElementById('adam-engine');
//var ctx = canvas.getContext('2d');

/* Animation test */
// var assets = [
// 	'/img/robowalk/robowalk00.png',
// 	'/img/robowalk/robowalk01.png',
// 	'/img/robowalk/robowalk02.png',
// 	'/img/robowalk/robowalk03.png',
// 	'/img/robowalk/robowalk04.png',
// 	'/img/robowalk/robowalk05.png',
// 	'/img/robowalk/robowalk06.png',
// 	'/img/robowalk/robowalk07.png',
// 	'/img/robowalk/robowalk08.png',
// 	'/img/robowalk/robowalk09.png',
// 	'/img/robowalk/robowalk10.png',
// 	'/img/robowalk/robowalk11.png',
// 	'/img/robowalk/robowalk12.png',
// 	'/img/robowalk/robowalk13.png',
// 	'/img/robowalk/robowalk14.png',
// 	'/img/robowalk/robowalk15.png',
// 	'/img/robowalk/robowalk16.png',
// 	'/img/robowalk/robowalk17.png',
// 	'/img/robowalk/robowalk18.png'
// ];
// var frames = [];
// var currFrame = 0;

// for(var i=0; i < assets.length; ++i) {
// 	var newImg = new Image();
// 	newImg.onload = function() {
// 		console.log('image loaded');
// 	};
// 	newImg.src = assets[i];
// 	frames[i] = newImg;
// }

// var animate = function() {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	ctx.drawImage(frames[currFrame], 100, 100);
// 	currFrame = (currFrame + 1) % frames.length;
// 	requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);

/* Atlas test */
// function parseAtlasDefinition(atlasJSON) {
// 	var parsed = JSON.parse(atlasJSON);

// 	/*for(var key in parsed.frames) {
// 		var sprite = parsed.frames[key];
// 		// define center of sprite as offset
// 		var cx = -sprite.frame.w * 0.5;
// 		var cy = -sprite.frame.h * 0.5;

// 		// define the sprite for this sheet
// 		//this.defSprite(key, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
// 	}*/
// }

// function main() {
// 	function onClick(e) {
// 		var canvasOffset = canvas.getBoundingClientRect();
// 		console.log((e.clientX - canvasOffset.left) + ', ' + (e.clientY - canvasOffset.top));
// 	}

// 	var atlasJson = null;

// 	var image = new Image();
// 	image.src = 'img/atlas.png';
// 	image.onload = function() {
// 		// attempt dl of atlas JSON
// 		var xhrAtlasJson = new XMLHttpRequest();
// 		xhrAtlasJson.responseType = 'json';
// 		xhrAtlasJson.open('GET', '/img/atlas.json', true);
// 		xhrAtlasJson.responseType = 'json';
// 		xhrAtlasJson.onload = function() {
// 			// store atlas JSON
// 			atlasJson = this.response;

// 			ctx.drawImage(
// 				image,
// 				atlasJson.frames['BHQ2.png'].frame.x,
// 				atlasJson.frames['BHQ2.png'].frame.y,
// 				atlasJson.frames['BHQ2.png'].sourceSize.w,
// 				atlasJson.frames['BHQ2.png'].sourceSize.h,
// 				10, 10, 70, 70
// 			);

// 			ctx.drawImage(
// 				image,
// 				atlasJson.frames['FAM2.png'].frame.x,
// 				atlasJson.frames['FAM2.png'].frame.y,
// 				atlasJson.frames['FAM2.png'].sourceSize.w,
// 				atlasJson.frames['FAM2.png'].sourceSize.h,
// 				100, 100, 70, 70
// 			);

// 			// console.log(canvas);
// 			// console.log(onClick);
// 			canvas.addEventListener('click', onClick);
// 		};
// 		xhrAtlasJson.send();
// 	};
// }

// main();

// AdamEngine class
var AdamEngine2 = function(canvas) {
	/*** GENERAL ***/
	/* GENERAL: PRIVATE PROPERTIES */
	var ctx = canvas.getContext('2d');
	var canvas = canvas.getBoundingClientRect();
	canvas.ele = canvas;
	


	/*** GAME OBJECTS ***/
	/* GAME OBJECTS: CLASSES */
	// GameObj class
	var GameObj = function(typeName) {
		/* private properties */
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
	GameObj.prototype.setup = function() {
		console.error('Game object setup() undefined');
	};

	GameObj.prototype.update = function() {
		console.error('Game object update() undefined');
	};

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
	}

	// WorldObj public methods
	WorldObj.prototype = Object.create(GameObj.prototype);
	WorldObj.prototype.constructor = WorldObj;


	/* GAME OBJECTS: PRIVATE PROPERTIES */
	var worldObjs = {};
	var storeObjs = {};


	/* GAME OBJECTS: PRIVATE METHODS */
	function createWorldObj(worldObjName) {
		worldObjs[worldObjName] = new WorldObj();
		return worldObjs[worldObjName];
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



	/*** GAME LOOP ***/
	/* GAME LOOP: PRIVATE METHODS */
	function setupWorldObjs() {
		for(var worldObjName in worldObjs) {
			worldObjs[worldObjName].setup();
		}
	}

	function update() {
		for(var worldObjName in worldObjs) {
			worldObjs[worldObjName].update();
		}
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// render all pos x & y of all world objs
		for(var worldObjName in worldObjs) {
			var worldObj = worldObjs[worldObjName];
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

/* AdamEngine public methods */
AdamEngine2.prototype.setup = function() {};

AdamEngine2.prototype.update = function() {};

var AE = new AdamEngine2(canvas);

var test = AE.createWorldObj('test');
test.setup = function() {
	console.log('test setup');

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
};

test.update = function() {
	console.log('test update');

	this.state.pos.x += 1;
	this.state.pos.y += 1;
}

var test2 = AE.createWorldObj('test2');
test2.setup = function() {
	console.log('test2 setup');

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
	this.state.stroke = {
		pos: this.state.pos,
		size: this.state.size,
		color: '#FFF'
	};
};

test2.update = function() {
	console.log('test2 update');

	this.state.pos.y += 2;
}

AE.start();

// var AdamEngine = {
// 	canvas: null,
// 	worldObjs: {},
// 	storeObjs: {},

// 	/* Classes */
// 	gameObj: {
// 		type: null,
// 		state: {},
// 		setup: function() {},
// 		update: function() {}
// 	},

// 	setup: function(canvas) {
// 		this.canvas = canvas.getBoundingClientRect();
// 		this.canvas.ele = canvas;

// 		// world objs inherit from game obj
// 		this.worldObj = Object.create(this.gameObj);
// 		this.worldObj.type = 'worldObj';
// 		this.worldObj.state = {
// 			worldObjType: null,
// 			pos: {x: 0, y: 0},
// 			size: {w: 0, h: 0},
// 			image: null,
// 			color: null,
// 			stroke: null
// 		};

// 		// store objs inherit from game obj
// 		this.storeObj = Object.create(this.gameObj);
// 		this.storeObj.type = 'storeObj';
// 	},

// 	InputManager: {
// 		inputMap: {
// 			keys: {},
// 			mbs: {}
// 		},

// 		inputState: {
// 			keys: {},
// 			mbs: {}
// 		},

// 		setup: function() {
// 			document.addEventListener('keydown', function(e) {
// 				var inputKeyName = this.inputMap.keys[e.keyCode];
// 				if(inputKeyName) {
// 					this.inputState.keys[inputKeyName] = true;
// 					// console.log(inputKeyName, this.inputState.keys[inputKeyName]);
// 				}
// 			}.bind(this));

// 			document.addEventListener('keyup', function(e) {
// 				var inputKeyName = this.inputMap.keys[e.keyCode];
// 				if(inputKeyName) {
// 					this.inputState.keys[inputKeyName] = false;
// 					// console.log(inputKeyName, this.inputState.keys[inputKeyName]);
// 				}
// 			}.bind(this));	

// 			document.addEventListener('mousedown', function(e) {
// 				var inputMBName = this.inputMap.mbs[e.button];
// 				if(inputMBName && (e.target === AdamEngine.canvas.ele)) {
// 					this.inputState.mbs[inputMBName].isActive = true;
// 					this.inputState.mbs[inputMBName].pos.x = e.clientX - AdamEngine.canvas.left;
// 					this.inputState.mbs[inputMBName].pos.y = e.clientY - AdamEngine.canvas.top;
// 					// console.log(inputMBName, this.inputState.mbs[inputMBName]);
// 				}
// 			}.bind(this));

// 			document.addEventListener('mouseup', function(e) {
// 				var inputMBName = this.inputMap.mbs[e.button];
// 				if(inputMBName) {
// 					this.inputState.mbs[inputMBName].isActive = false;
// 					// console.log(inputMBName, this.inputState.mbs[inputMBName]);
// 				}
// 			}.bind(this));

// 			// TODO: add listener for mousemove
// 		},

// 		addKeyInput: function(keyCode, inputKeyName) {
// 			this.inputMap.keys[keyCode] = inputKeyName;
// 			this.inputState.keys[inputKeyName] = false;
// 		},

// 		removeKeyInput: function(inputKeyName) {},

// 		resetKeyState: function() {
// 			for(var i in this.inputState) {
// 				this.inputState[i] = false;
// 			}
// 		},

// 		addMBInput: function(button, inputMBName) {
// 			this.inputMap.mbs[button] = inputMBName;
// 			this.inputState.mbs[inputMBName] = {
// 				isActive: false,
// 				pos: {
// 					x: null,
// 					y: null
// 				}
// 			};
// 		},

// 		removeMBInput: function(inputMBName) {},
// 	},

// 	/* Game Object Creators/Destroyers */
// 	createWorldObj: function(worldObjName) {
// 		this.worldObjs[worldObjName] = Object.create(this.worldObj);
// 		return this.worldObjs[worldObjName];
// 	},

// 	deleteWorldObj: function(worldObjName) {
// 		delete this.worldObjs[worldObjName];
// 	},

// 	createStoreObj: function(storeObjName) {
// 		this.storeObjs[storeObjName] = Object.create(this.storeObj);
// 		return this.storeObjs[storeObjName];
// 	},

// 	deleteStoreObj: function(storeObjName) {
// 		this.storeObjs[storeObjName] = Object.create(this.storeObj);
// 		return this.storeObjs[storeObjName];
// 	},

// 	/* Game Loop */
// 	start: function() {
// 		// run setup for all game objs
// 		for(var storeObjName in this.storeObjs) {
// 			this.storeObjs[storeObjName].setup();
// 		}

// 		for(var worldObjName in this.worldObjs) {
// 			this.worldObjs[worldObjName].setup();
// 		}

// 		requestAnimationFrame(this.gameLoop.bind(this));
// 	},

// 	update: function(cb) {
// 		for(var worldObjName in this.worldObjs) {
// 			this.worldObjs[worldObjName].update();
// 		}
// 	},

// 	render: function() {
// 		ctx.clearRect(0, 0, canvas.width, canvas.height);

// 		// render all pos x & y of all world objs
// 		for(var worldObjName in this.worldObjs) {
// 			var worldObj = this.worldObjs[worldObjName];
// 			if(worldObj.type === 'worldObj') {
// 				if(worldObj.state.worldObjType === 'rect') {
// 					ctx.fillStyle = worldObj.state.color;
// 					ctx.fillRect(worldObj.state.pos.x, worldObj.state.pos.y, worldObj.state.size.w, worldObj.state.size.h);

// 					if(worldObj.state.stroke !== null) {
// 						ctx.strokeStyle = worldObj.state.stroke.color;
// 						ctx.strokeRect(worldObj.state.stroke.pos.x, worldObj.state.stroke.pos.y, worldObj.state.stroke.size.w, worldObj.state.stroke.size.h);
// 					}
// 				}
// 			}
// 		}		
// 	},

// 	gameLoop: function() {
// 		this.update();
// 		this.render();
// 		requestAnimationFrame(this.gameLoop.bind(this));
// 	}
// }

// AdamEngine.InputManager.addKeyInput(37, 'LEFT');
// AdamEngine.InputManager.addKeyInput(38, 'UP');
// AdamEngine.InputManager.addKeyInput(39, 'RIGHT');
// AdamEngine.InputManager.addKeyInput(40, 'DOWN');
// AdamEngine.InputManager.addMBInput(0, 'LEFTCLICK');
// AdamEngine.InputManager.setup();
// AdamEngine.setup(canvas);

// var player = AdamEngine.createWorldObj('player');

// player.setup = function() {
	// this.state.pos = {
	// 	x: 10,
	// 	y: 10
	// };

	// this.state.size = {
	// 	w: 10,
	// 	h: 10
	// };

	// this.state.worldObjType = 'rect';
	// this.state.color = '#00FF00';
	// this.state.stroke = {
	// 	pos: this.state.pos,
	// 	size: this.state.size,
	// 	color: '#FFF'
	// };
// };

// player.update = function() {
// 	if(AdamEngine.InputManager.inputState.keys.LEFT) {
// 		this.state.pos.x -= 1;
// 	} else if(AdamEngine.InputManager.inputState.keys.RIGHT) {
// 		this.state.pos.x += 1;
// 	}

// 	if(AdamEngine.InputManager.inputState.keys.UP) {
// 		this.state.pos.y -= 1;
// 	} else if(AdamEngine.InputManager.inputState.keys.DOWN) {
// 		this.state.pos.y += 1;
// 	}

// 	if(AdamEngine.InputManager.inputState.mbs.LEFTCLICK.isActive) {
// 		console.log('teehee~', '(x: ' + AdamEngine.InputManager.inputState.mbs.LEFTCLICK.pos.x + ', y: ' + AdamEngine.InputManager.inputState.mbs.LEFTCLICK.pos.y + ')');
// 	}
// };

// AdamEngine.start();
