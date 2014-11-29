console.log('Hello world!');

/*
 * GAME CONSTANTS AND VARIABLES
 */
var canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d'),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height,
	cellSize = 10,
	snake = {
		startLength: 5,
		bodyPos: []
	};

function game_init() {
	for(var i = snake.startLength - 1; i >= 0; --i) {
		snake.bodyPos.push({x: i, y: 0});
	}
	console.log(snake.bodyPos);
}

function game_loop(){
	update();
	render();
	requestAnimationFrame(game_loop); //request next frame
}

function update() {
}

function render(){
	//draw the background to clear previous frame 
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.strokeStyle = '#000'
	ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

	//move snake
	var tail = snake.bodyPos.pop();
	tail.x = snake.bodyPos[0].x + 1;
	snake.bodyPos.unshift(tail);
	//console.log(snake.bodyPos);

	//draw the snake
	for(var i = 0; i < snake.bodyPos.length; ++i){
		var cell = snake.bodyPos[i];
		ctx.fillStyle = '#00ff00';
		ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = '#fff';
		ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
	}
}

game_init();
requestAnimationFrame(game_loop); //start the first frame