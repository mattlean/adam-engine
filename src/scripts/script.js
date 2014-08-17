var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var board = [];
var posX = 0;
var posY = 0;
var velX = 100;
var velY = 100;
var sizeX = 80;
var sizeY = 40;
var gravityY = 900;
var paused = true;

//document.onmousemove = getMouseXY;

function getMouseXY(e) {
	console.log(getRelPos(canvas, e.pageX, e.pageY));
}

//generate random jewel
function generateJewel() {
	return Math.floor(Math.random() * 2);
}

function GameTick(elapsed) {
	/* Input */
	InputMan.padUpdate();

	/* Logic */
	console.log(InputMan.padPressed);
	if(InputMan.padPressed === InputMan.PAD.CANCEL) {
		paused = !paused
		console.log(paused);
	};

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
		board.push([generateJewel(), generateJewel(), generateJewel(), generateJewel(), generateJewel(), generateJewel(), generateJewel(), generateJewel(), generateJewel(), generateJewel()]);
	}

	//ctx.fillRect(50, 25, 150, 100);
	console.log(board);

	InputMan.connect(document, canvas);
	GLMan.run(GameTick);
};