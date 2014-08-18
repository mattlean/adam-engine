window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var cellSize = 10; //determines cell size. cell is always a square.
	var direction;
	var game_loop;
	var food;

	var snake_array;

	function create_snake() {
		var length = 5;
		snake_array = [];
		//builds snake_array from the head (right-most snake cell when the game starts)
		//to tail (left-most snake cell when the game starts)
		for(var i = length-1; i >= 0; --i) {
			snake_array.push({x: i, y:0});
		}
	}

	function create_food() {
		food = {
			x: Math.round(Math.random() * (canvasWidth - cellSize)/cellSize),
			y: Math.round(Math.random() * (canvasHeight - cellSize)/cellSize)
		};
	}

	/* Start Game */
	function init() {
		direction = 'right'; //default direction is right
		create_snake();
		create_food();
		if(typeof game_loop !== 'undefined') clearInterval(game_loop);
		game_loop = setInterval(draw, 60);
	}

	init();

	function draw_cell(x, y) {
		ctx.fillStyle = '#00ff00';
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = '#fff';
		ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}

	function draw() {
		//draw the background to clear previous frame
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		//move the snake
		//get snake head's current x and y pos
		var newX = snake_array[0].x;
		var newY = snake_array[0].y;
		//manages direction of snake
		if(direction === 'right') {
			++newX;
		} else if(direction === 'left') {
			--newX;
		} else if(direction === 'up') {
			--newY;
		} else if(direction === 'down') {
			++newY;
		}

		//if the snake hits a wall restart the game
		if(newX === -1 || newX === canvasWidth/cellSize || newY === -1 || newY === canvasHeight/cellSize) {
			init();
			return;
		}

		if(newX === food.x && newY === food.y) {
			var tail = {x: newX, y: newY};
			create_food();
		} else {
			var tail = snake_array.pop(); //pop the tail of the snake
			tail.x = newX;
			tail.y = newY;
		}

		snake_array.unshift(tail); //add the new head of the snake in front of the curr head
		
		//draw the snake
		for(var i = 0; i < snake_array.length; ++i) {
			var snakeCell = snake_array[i];
			draw_cell(snakeCell.x, snakeCell.y);
		}

		draw_cell(food.x, food.y);
	}

	/* Input */
	window.onkeydown = function(evt) {
		var key = evt.which;
		if((key === 37) && (direction !== 'right')) {
			direction = 'left';
		} else if((key === 39) && (direction !== 'left')) {
			direction = 'right';
		} else if((key === 38) && (direction !== 'down')) {
			direction = 'up';
		} else if((key === 40) && (direction !== 'up')) {
			direction = 'down';
		}
	};
};