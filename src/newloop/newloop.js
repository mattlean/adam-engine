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
		direction: DIRECTION.RIGHT,
		move: function() {
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
		},
		draw: function() {
			for(var i = 0; i < snake.bodyPos.length; ++i) {
				var cell = snake.bodyPos[i];
				draw_cell(cell.x, cell.y);
			}
		}
	},
	food = {
		x: null,
		y: null,
		create: function() {
			this.x = Math.round(Math.random() * (canvasWidth - cellSize) / cellSize);
			this.y = Math.round(Math.random() * (canvasHeight - cellSize) / cellSize);
		},
		draw: function() {
			draw_cell(this.x, this.y);
		}
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

function game_start() {
	snake.bodyPos = []; //clear previous snake bodyPos from previous game
	snake.direction = DIRECTION.RIGHT;

	for(var i = snake.startLength - 1; i >= 0; --i) {
		snake.bodyPos.push({x: i, y: 0});
	}

	food.create();
}

function update() {
	snake.move();

	//if the snake hits a wall start a new game
	var head = snake.bodyPos[0];
	if(head.x === -1 || head.x === canvasWidth/cellSize || head.y === -1 || head.y === canvasHeight/cellSize) {
		game_start();
	}
}

function draw_cell(x, y) {
	ctx.fillStyle = '#00ff00';
	ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	ctx.strokeStyle = '#fff';
	ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function render() {
	//draw the background to clear previous frame 
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.strokeStyle = '#000'
	ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

	snake.draw();
	food.draw();
}

function main_loop() {
	update();
	render();
	requestAnimationFrame(main_loop); //request next frame
}

game_start();
requestAnimationFrame(main_loop); //start the first frame
