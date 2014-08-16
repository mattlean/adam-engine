var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var board = [];
var posX = 0;
var posY = 0;
var velX = 100;
var velY = 100;
var sizeX = 80;
var sizeY = 40;

if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}

//generate random jewel
function jewelRNG() {
	return Math.floor(Math.random() * 2);
}

var GLMan = new function() {
	this.prevTime = 0;
	this.currTick = null;
	this.prevElapsed = 0;
	this.prevElapsed2 = 0;

	/* Starts the game loop. Once started the loop never stops. */
	this.run = function(tick) {
		var prevTick = this.currTick;
		this.currTick = tick;
		if(this.prevTime === 0) {
			var bindThis = this; //what's the difference between bindThis.tick and this.tick?
			requestAnimationFrame(function() { bindThis.tick(); });
			this.prevTime = 0;
		}
	}

	this.stop = function() {
		this.run(null);
	}

	this.tick = function() {
		if(this.currTick !== null) {
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); });
		} else {
			this.prevTime = 0;
			return;
		}

		var currTime = Date.now();
		var elapsed = currTime - this.prevTime;
		if(elapsed > 0) {
			if(this.prevTime !== 0) {
				if(elapsed > 1000) elapsed = 1000; //Cap max elapsed time to 1s to avoid death spiral
				//Hackish FPS smoothing
				var smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2) / 3;
				this.currTick(0.001 * smoothElapsed);
				this.prevElapsed2 = this.prevElapsed;
				this.prevElapsed = elapsed;
			}
			this.prevTime = currTime;
		}
	}
}

function GameTick(elapsed) {
	/* Logic */

	/* Movement physics */
	posX += velX * elapsed;
	posY += velY * elapsed;

	/* Collision detection and response */
	if ( (posX <= 0 && velX < 0) || (posX >= canvas.width-sizeX && velX > 0) )
		velX = -velX;
	if ( (posY <= 0 && velY < 0) || (posY >= canvas.height-sizeY && velY > 0) )
		velY = -velY;

	/* Rendering */
    // Clear the screen
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Render objects
    ctx.strokeRect(posX, posY, sizeX, sizeY);
    ctx.fillStyle = "red";
    ctx.fillText("Hello World!", posX + 10, posY + 25);
}

window.onload = function() {
	for(var i = 0; i < 10; ++i) {
		board.push([jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG(), jewelRNG()]);
	}

	//ctx.fillRect(50, 25, 150, 100);
	console.log(board);

	GLMan.run(GameTick);
};