console.log('Hello world!');

/*
 * CONSTANTS AND VARIABLES
 */
const DIRECTION = {
		LEFT:37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40
	},
	cellSize = 10;

var canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d'),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height,
	snake = {
		startLength: 5,
		bodyPos: [],
		direction: DIRECTION.RIGHT
	};

/*
 * INPUTS
 */
document.addEventListener('keydown', onkeydown);

function onkeydown(evt) {
	var key = evt.which;
	if(key === DIRECTION.UP && snake.direction !== DIRECTION.DOWN){
		snake.direction = DIRECTION.UP;
	} else if(key === DIRECTION.DOWN && snake.direction !== DIRECTION.UP){
		snake.direction = DIRECTION.DOWN;
	} else if(key === DIRECTION.LEFT && snake.direction !== DIRECTION.RIGHT){
		snake.direction = DIRECTION.LEFT;
	} else if(key === DIRECTION.RIGHT && snake.direction !== DIRECTION.LEFT) {
		snake.direction = DIRECTION.RIGHT;
	}	
}

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
	var head = snake.bodyPos[0];
	switch(snake.direction) {
		case DIRECTION.UP:
			tail.x = head.x;
			tail.y = head.y - 1;
			break;
		case DIRECTION.DOWN:
			tail.x = head.x;
			tail.y = head.y + 1;
			break;
		case DIRECTION.LEFT:
			tail.x = head.x - 1;
			tail.y = head.y;
			break;
		case DIRECTION.RIGHT:
			tail.x = head.x + 1;
			tail.y = head.y;
			break;
	}
	
	snake.bodyPos.unshift(tail);

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