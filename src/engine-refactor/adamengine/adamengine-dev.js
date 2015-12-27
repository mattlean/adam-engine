var body = document.querySelector('body');
var canvas = document.getElementById('adam-engine');
var ctx = canvas.getContext('2d');

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

var AdamEngine = {
	canvas: null,
	worldObjs: {},
	storeObjs: {},

	/* Classes */
	gameObj: {
		type: null,
		state: {},
		setup: function() {},
		update: function() {}
	},

	// Initialize the game engine so everything can start working
	setup: function(canvas) {
		canvas = canvas;

		// world objs inherit from game obj
		this.worldObj = Object.create(this.gameObj);
		this.worldObj.type = 'worldObj';
		this.worldObj.state = {
			worldObjType: null,
			pos: {x: 0, y: 0},
			size: {w: 0, h: 0},
			image: null,
			color: null,
			stroke: null
		};
		this.worldObj.render= function() {};

		// store objs inherit from game obj
		this.storeObj = Object.create(this.gameObj);
		this.storeObj.type = 'storeObj';
	},

	InputManager: {
		inputMap: {},

		inputState: {},

		setup: function() {
			document.addEventListener('keydown', function(e) {
				if(this.inputMap[e.keyCode] !== undefined) {
					this.inputState[this.inputMap[e.keyCode]] = true;
					console.log(this.inputMap[e.keyCode], this.inputState[this.inputMap[e.keyCode]]);
				}
			}.bind(this));

			document.addEventListener('keyup', function(e) {
				if(this.inputMap[e.keyCode] !== undefined) {
					this.inputState[this.inputMap[e.keyCode]] = false;
					console.log(this.inputMap[e.keyCode], this.inputState[this.inputMap[e.keyCode]]);
				}
			}.bind(this));			
		},

		addInput: function(keyCode, name) {
			this.inputMap[keyCode] = name;
			this.inputState[name] = false;
		},

		removeInput: function(keyCode, name) {
			delete this.inputMap[keyCode];
		},

		resetState: function() {
			for(var i in this.inputState) {
				this.inputState[i] = false;
			}
		}
	},

	/* Game Object Creators/Destroyers */
	createWorldObj: function(worldObjName) {
		this.worldObjs[worldObjName] = Object.create(this.worldObj);
		return this.worldObjs[worldObjName];
	},

	deleteWorldObj: function(worldObjName) {
		delete this.worldObjs[worldObjName];
	},

	createStoreObj: function(storeObjName) {
		this.storeObjs[storeObjName] = Object.create(this.storeObj);
		return this.storeObjs[storeObjName];
	},

	deleteStoreObj: function(storeObjName) {
		this.storeObjs[storeObjName] = Object.create(this.storeObj);
		return this.storeObjs[storeObjName];
	},

	/* Game Loop */
	start: function() {
		// run setup for all game objs
		for(var storeObjName in this.storeObjs) {
			this.storeObjs[storeObjName].setup();
		}

		for(var worldObjName in this.worldObjs) {
			this.worldObjs[worldObjName].setup();
		}

		requestAnimationFrame(this.gameLoop.bind(this));
	},

	update: function(cb) {
		for(var worldObjName in this.worldObjs) {
			this.worldObjs[worldObjName].update();
		}
	},

	render: function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// render all pos x & y of all world objs
		for(var worldObjName in this.worldObjs) {
			var worldObj = this.worldObjs[worldObjName];
			if(worldObj.type === 'worldObj') {
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
	},

	gameLoop: function() {
		this.update();
		this.render();
		requestAnimationFrame(this.gameLoop.bind(this));
	}
}

AdamEngine.InputManager.addInput(37, 'LEFT');
AdamEngine.InputManager.addInput(38, 'UP');
AdamEngine.InputManager.addInput(39, 'RIGHT');
AdamEngine.InputManager.addInput(40, 'DOWN');
AdamEngine.InputManager.setup();
AdamEngine.setup(canvas);

var player = AdamEngine.createWorldObj('player');

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
	// this.state.pos.x += 1;
	// this.state.pos.y += 1;

	if(AdamEngine.InputManager.inputState.LEFT) {
		this.state.pos.x -= 1;
	} else if(AdamEngine.InputManager.inputState.RIGHT) {
		this.state.pos.x += 1;
	}

	if(AdamEngine.InputManager.inputState.UP) {
		this.state.pos.y -= 1;
	} else if(AdamEngine.InputManager.inputState.DOWN) {
		this.state.pos.y += 1;
	}
};

AdamEngine.start();
