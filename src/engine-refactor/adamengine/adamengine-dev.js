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
	var atlasPng = null;
	var atlasJson = null;

	// attempt dl of atlas PNG
	var xhrAtlasPng = new XMLHttpRequest();
	xhrAtlasPng.open('GET', '/img/atlas.png', true);
	xhrAtlasPng.responseType = 'arraybuffer';
	xhrAtlasPng.onload = function() {
		// store atlas PNG
		atlasPng = this.response;
		console.log(atlasPng);

		// attempt dl of atlas JSON
		var xhrAtlasJson = new XMLHttpRequest();
		xhrAtlasJson.responseType = 'json';
		xhrAtlasJson.open('GET', '/img/atlas.json', true);
		xhrAtlasJson.responseType = 'json';
		xhrAtlasJson.onload = function() {
			// store atlas JSON
			atlasJson = this.response;
			console.log(atlasJson);
		}
		xhrAtlasJson.send();
	};
	xhrAtlasPng.send();
}

main();