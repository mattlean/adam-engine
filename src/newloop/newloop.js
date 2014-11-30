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
			var currHead = this.bodyPos[0];
			var newHead = {
				x: currHead.x,
				y: currHead.y
			}

			switch(this.direction) {
				case DIRECTION.UP:
					--newHead.y;
					break;
				case DIRECTION.DOWN:
					++newHead.y
					break;
				case DIRECTION.LEFT:
					--newHead.x;
					break;
				case DIRECTION.RIGHT:
					++newHead.x;
					break;
			}

			if(newHead.x === food.x && newHead.y === food.y) {
				food.create();
			} else {
				this.bodyPos.pop();
			}

			this.bodyPos.unshift(newHead); //add the tail in front of the head
			
			//if the snake hits itself game over
			for(var i = 1; i < this.bodyPos.length; ++i) {
				if(this.bodyPos[i].x === newHead.x && this.bodyPos[i].y === newHead.y) {
					game_over();
				}
			}

			//if the snake hits a wall game over
			if(newHead.x === -1 || newHead.x === canvasWidth / cellSize || newHead.y === -1 || newHead.y === canvasHeight / cellSize) {
				game_over();
			}
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
 * UPDATING
 */
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

function game_over() {
	console.log('GAME OVER');
	game_start();
}

function update() {
	snake.move();
}

/*
 * RENDERING
 */
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

/*
 * GAME LOOP
 */
document.addEventListener('keydown', onkeydown);

function main_loop() {
	update();
	render();
	requestAnimationFrame(main_loop); //request next frame
}

game_start();
requestAnimationFrame(main_loop); //start the first frame
