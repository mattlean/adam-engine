var body = document.querySelector('body');
var canvasId = 'adam-engine';
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
var AdamEngine = function(canvasId) {
	/*** GENERAL ***/
	/* GENERAL: PRIVATE PROPERTIES */
	var canvas = document.getElementById(canvasId);
	var canvasData = canvas.getBoundingClientRect();
	var ctx = canvas.getContext('2d');
	


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
				var keyName = inputMap.keys[e.keyCode];
				if(keyName) {
					inputState.keys[keyName] = true;
					console.log(keyName, inputState.keys[keyName]);
				}
			}.bind(this));

			document.addEventListener('keyup', function(e) {
				var keyName = inputMap.keys[e.keyCode];
				if(keyName) {
					inputState.keys[keyName] = false;
					console.log(keyName, inputState.keys[keyName]);
				}
			}.bind(this));

			document.addEventListener('mousedown', function(e) {
				var mbName = inputMap.mbs[e.button];
				if(mbName && (e.target === canvas)) {
					inputState.mbs[mbName].isActive = true;
					inputState.mbs[mbName].pos.x = e.clientX - canvasData.left;
					inputState.mbs[mbName].pos.y = e.clientY - canvasData.top;
					console.log(mbName, inputState.mbs[mbName]);
				}
			}.bind(this));

			document.addEventListener('mouseup', function(e) {
				var mbName = inputMap.mbs[e.button];
				if(mbName && (e.target === canvas)) {
					inputState.mbs[mbName].isActive = false;
					console.log(mbName, inputState.mbs[mbName]);
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

	this.inputMan = new InputManager();



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
		ctx.clearRect(0, 0, canvasData.width, canvasData.height);

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


var AE = new AdamEngine(canvasId);
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
};

test2.update = function() {
	this.state.pos.y += 2;
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
};

AE.start();
