var body = document.querySelector('body');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

body.appendChild(canvas);

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
function parseAtlasDefinition(atlasJSON) {
	var parsed = JSON.parse(atlasJSON);

	/*for(var key in parsed.frames) {
		var sprite = parsed.frames[key];
		// define center of sprite as offset
		var cx = -sprite.frame.w * 0.5;
		var cy = -sprite.frame.h * 0.5;

		// define the sprite for this sheet
		//this.defSprite(key, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
	}*/
}

function main() {
	function onClick(e) {
		var canvasOffset = canvas.getBoundingClientRect();
		console.log((e.clientX - canvasOffset.left) + ', ' + (e.clientY - canvasOffset.top));
	}

	var atlasJson = null;

	var image = new Image();
	image.src = 'img/atlas.png';
	image.onload = function() {
		// attempt dl of atlas JSON
		var xhrAtlasJson = new XMLHttpRequest();
		xhrAtlasJson.responseType = 'json';
		xhrAtlasJson.open('GET', '/img/atlas.json', true);
		xhrAtlasJson.responseType = 'json';
		xhrAtlasJson.onload = function() {
			// store atlas JSON
			atlasJson = this.response;

			ctx.drawImage(
				image,
				atlasJson.frames['BHQ2.png'].frame.x,
				atlasJson.frames['BHQ2.png'].frame.y,
				atlasJson.frames['BHQ2.png'].sourceSize.w,
				atlasJson.frames['BHQ2.png'].sourceSize.h,
				10, 10, 70, 70
			);

			ctx.drawImage(
				image,
				atlasJson.frames['FAM2.png'].frame.x,
				atlasJson.frames['FAM2.png'].frame.y,
				atlasJson.frames['FAM2.png'].sourceSize.w,
				atlasJson.frames['FAM2.png'].sourceSize.h,
				100, 100, 70, 70
			);

			console.log(canvas);
			console.log(onClick);
			canvas.addEventListener('click', onClick);
		};
		xhrAtlasJson.send();
	};
}

main();

var AdamEngine = function() {
	this.gameObjs = {};
}

AdamEngine.prototype.createGameObj = function(gameObjName) {
	this.gameObjs[gameObjName] = {
		state: {},
		setup: function() {},
		update: function() {}
	};

	return this.gameObjs[gameObjName];
};

AdamEngine.prototype.deleteGameObj = function(gameObjName) {
	delete this.gameObjs[gameObjName];
};

AdamEngine.prototype.update = function() {};

AdamEngine.prototype.render = function() {};

var AE = new AdamEngine();
var Grid = AE.createGameObj('Grid');
Grid.setup = function() {
	this.state.grid = [];
	this.state.grid.push([])
};

AE.update();



// initialize all game objects first
