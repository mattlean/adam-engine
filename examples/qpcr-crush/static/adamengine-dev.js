// AdamEngine class
var AdamEngine = function(canvasId) {
	/*** GENERAL ***/
	/* GENERAL: PRIVATE PROPERTIES */
	var canvas = document.getElementById(canvasId);
	var canvasData = canvas.getBoundingClientRect();
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	var audioCtx = new AudioContext();
	var focus = false; // true if canvas is in focus or not
	var loading = true; // true if engine is still loading assets


	/* GENERAL: PUBLIC PROPERTIES */
	this.ctx = canvas.getContext('2d');



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
		this.state.img = null;
		this.state.imgData = null;
		this.state.atlas = null;
		this.state.color = null;
		this.state.stroke = null;
		this.state.alpha = null;
		this.state.font = null;
		this.state.textAlign = null;
		this.state.text = null;
		this.state.zIndex = 0;
	}

	// WorldObj public methods
	WorldObj.prototype = Object.create(GameObj.prototype);
	WorldObj.prototype.constructor = WorldObj;


	/* GAME OBJECTS: PRIVATE PROPERTIES */
	var worldObjs = {};
	var storeObjs = {};


	/* GAME OBJECTS: PRIVATE METHODS */
	function createWorldObj(worldObjName) {
		if(worldObjs[worldObjName]) {
			console.error('A world object with the name "' + worldObjName + '" already exists!');
		} else {
			worldObjs[worldObjName] = new WorldObj();
			worldObjs[worldObjName].name = worldObjName;
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
			mbs: {},
			touch: null
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
					inputState.mbs[mbName].fullClick = false;
					inputState.mbs[mbName].pos.x = e.clientX - canvasData.left;
					inputState.mbs[mbName].pos.y = e.clientY - canvasData.top;
					// console.log(mbName, inputState.mbs[mbName]);
				}
			}.bind(this));

			document.addEventListener('mouseup', function(e) {
				var mbName = inputMap.mbs[e.button];
				if(mbName && (e.target === canvas)) {
					inputState.mbs[mbName].isActive = false;
					inputState.mbs[mbName].fullClick = true;
					// console.log(mbName, inputState.mbs[mbName]);
				}
			}.bind(this));

			document.addEventListener('touchstart', function(e) {
				if(inputState.touch && (e.target === canvas)) {
					inputState.touch.isActive = true;
					inputState.touch.fullPress = false;
					inputState.touch.pos.startX = e.targetTouches[0].pageX - canvasData.left;
					inputState.touch.pos.startY = e.targetTouches[0].pageY - canvasData.top;
					// console.log(inputState.touch.pos);
				}
			});

			document.addEventListener('touchend', function(e) {
				if(inputState.touch && (e.target === canvas)) {
					inputState.touch.isActive = false;
					inputState.touch.fullPress = true;
					inputState.touch.pos.endX = e.changedTouches[0].pageX - canvasData.left;
					inputState.touch.pos.endY = e.changedTouches[0].pageY - canvasData.top;
					// console.log(inputState.touch.pos);
				}

				AE.soundMan.playSound('select'); // temp iOS audio fix
			});

			document.addEventListener('touchmove', function(e) {
				if(e.target === canvas) {
					e.preventDefault();
				}
			});

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
				fullClick: false,
				pos: {
					x: null, y: null
				}
			};
		};

		this.addTouchInput = function() {
			inputState.touch = {
				isActive: false,
				fullPress: false,
				pos: {
					startX: null,
					startY: null,
					endX: null,
					endY: null
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

		this.getMBStates = function() {
			return inputState.mbs;
		};

		this.getTouchState = function() {
			return inputState.touch;
		};
	}

	/* INPUT MANAGER: PUBLIC PROPERTIES */
	this.inputMan = new InputManager();



	/*** SOUND MANAGER ***/
	// SoundManager class
	function SoundManager() {
		// private properties
		var buffers = {};

		// privileged methods
		this.getBuffers = function() {
			return buffers;
		};

		this.playSound = function(soundName) {
			var src = audioCtx.createBufferSource();
			src.buffer = buffers[soundName];

			var gainNode = audioCtx.createGain();
			gainNode.gain.value = 0.05;

			src.connect(gainNode);
			gainNode.connect(audioCtx.destination);

			src.start(0);
		};
	}


	/* SOUND MANAGER: PUBLIC PROPERTIES */
	this.soundMan = new SoundManager();



	/*** ASSET MANAGER ***/
	// AssetManager class
	function AssetManager() {
		// private properties
		var loadedAssets = 0;
		var totalAssets = 0;
		var imgs = {};
		var atlases = {};
		var sounds = {};

		// private methods
		function loadFinishCheck(cb) {
			++loadedAssets;
			console.log('Loaded assets: ' + loadedAssets);

			if(loadedAssets === totalAssets) {
				loading = false;
				console.log('Loading completed!');
				cb();
			}
		}

		// privileged methods
		this.newImg = function(imgName, imgLoc) {
			var img = new Image();
			img.imgLoc = imgLoc;

			++totalAssets;

			imgs[imgName] = img;
		};

		this.getImg = function(imgName) {
			return imgs[imgName];
		};

		this.newAtlas = function(atlasName, imgLoc, dataLoc) {
			var img = new Image();
			img.imgLoc = imgLoc;

			var xhr = new XMLHttpRequest();
			xhr.responseType = 'json';
			xhr.open('GET', dataLoc, true);

			// TODO: onerror retry load

			totalAssets = totalAssets + 2;

			var atlas = {img: img, xhr: xhr};
			atlases[atlasName] = atlas;
		};

		this.getAtlas = function(atlasName) {
			return atlases[atlasName];
		},

		this.newSound = function(soundName, soundLoc) {
			var buffers = AE.soundMan.getBuffers();
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'arraybuffer';
			xhr.open('GET', soundLoc, true);
			xhr.onload = function() {
				audioCtx.decodeAudioData(this.response, function(buffer) {
					buffers[soundName] = buffer;
				});
				loadFinishCheck(AE.setupWorldObjs);
			};

			++totalAssets;

			sounds[soundName] = xhr;
		},

		this.loadAssets = function(cb) {
			if(totalAssets > 0) {
				// start downloading imgs
				for(var imgName in imgs) {
					imgs[imgName].onload = loadFinishCheck(cb);
					imgs[imgName].src = imgs[imgName].imgLoc;
				}

				// start downloading atlases
				for(var atlasName in atlases) {
					atlases[atlasName].img.onload = loadFinishCheck(cb);
					atlases[atlasName].xhr.onload = function() {
						atlases[atlasName].data = this.response;
						loadFinishCheck(cb);
					};

					atlases[atlasName].img.src = atlases[atlasName].img.imgLoc;
					atlases[atlasName].xhr.send();
				}

				// start downloading sounds
				for(var soundName in sounds) {
					sounds[soundName].send();
				}
			} else {
				cb();
			}
		};
	}


	/* ASSET MANAGER: PUBLIC PROPERTIES */
	this.assetMan = new AssetManager();



	/*** GAME LOOP ***/
	/* GAME LOOP: PRIVATE PROPERTIES */
	var renderPipe = []; // determines rendering order of world objs


	/* GAME LOOP: PRIVATE METHODS */
	function update() {
		for(var worldObjName in worldObjs) {
			worldObjs[worldObjName].update();
		}

		var mbStates = AE.inputMan.getMBStates();
		for(var mbName in mbStates) {
			mbStates[mbName].fullClick = false;
		}

		var touchState = AE.inputMan.getTouchState();
		if(touchState) {
			touchState.fullPress = false;
		}
	}

	function render() {
		AE.ctx.clearRect(0, 0, canvasData.width, canvasData.height);

		// render all pos x & y of all world objs
		for(var i in renderPipe) {
			var worldObj = renderPipe[i];
			if(worldObj.getType() === 'world-obj') {
				if(worldObj.state.worldObjType === 'rect') {
					AE.ctx.fillStyle = worldObj.state.color;
					AE.ctx.fillRect(worldObj.state.pos.x, worldObj.state.pos.y, worldObj.state.size.w, worldObj.state.size.h);

					if(worldObj.state.stroke !== null) {
						AE.ctx.strokeStyle = worldObj.state.stroke.color;
						AE.ctx.strokeRect(worldObj.state.stroke.pos.x, worldObj.state.stroke.pos.y, worldObj.state.stroke.size.w, worldObj.state.stroke.size.h);
					}
				} else if(worldObj.state.worldObjType === 'img') {
					// if alpha exists, render worldobj with alpha val
					if(worldObj.state.alpha) {
						AE.ctx.save();
						AE.ctx.globalAlpha = worldObj.state.alpha;
					}

					if(worldObj.state.imgData === null) {
						// draw regular img
						AE.ctx.drawImage(worldObj.state.img, worldObj.state.pos.x, worldObj.state.pos.y, worldObj.state.size.w, worldObj.state.size.h);
					} else {
						// draw from atlas
						AE.ctx.drawImage(worldObj.state.img, worldObj.state.imgData.sx, worldObj.state.imgData.sy, worldObj.state.imgData.sw, worldObj.state.imgData.sh, worldObj.state.pos.x, worldObj.state.pos.y, worldObj.state.size.w, worldObj.state.size.h);
					}
					
					if(worldObj.state.stroke !== null) {
						AE.ctx.strokeStyle = worldObj.state.stroke.color;
						AE.ctx.strokeRect(worldObj.state.stroke.pos.x, worldObj.state.stroke.pos.y, worldObj.state.stroke.size.w, worldObj.state.stroke.size.h);
					}

					if(worldObj.state.alpha) {
						AE.ctx.restore();
					}
				} else if(worldObj.state.worldObjType === 'text') {
					AE.ctx.fillStyle = worldObj.state.color;
					AE.ctx.font = worldObj.state.font;
					if(worldObj.state.textAlign) {
						AE.ctx.textAlign = worldObj.state.textAlign;
					}
					AE.ctx.fillText(worldObj.state.text, worldObj.state.pos.x, worldObj.state.pos.y);
				} else if(worldObj.state.worldObjType === 'custom') {
					worldObj.render();
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
		this.assetMan.loadAssets(this.setupWorldObjs); // dl assets & setup world objs when dl is complete
	};

	this.setupWorldObjs = function() {
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

		requestAnimationFrame(gameLoop); // start game loop
	};

	this.updateRenderPipe = function() {
		renderPipe = []; // recreate renderPipe
		for(var worldObjName in worldObjs) {
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
	};
};