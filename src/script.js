window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var game_loop;
	var cellSize = 40; //determines cell size. cell is always a square.
	var boardSize = 8; //determines board size. at the moment the board is always square.
	var board = [];
	var board = [
	[1, 2, 0, 1, 2, 2, 2, 0],
	[2, 0, 0, 2, 1, 2, 2, 0],
	[1, 0, 1, 0, 2, 2, 1, 2],
	[1, 2, 1, 1, 0, 0, 2, 1],
	[1, 2, 2, 1, 2, 2, 0, 0],
	[0, 0, 1, 2, 2, 2, 1, 0],
	[1, 2, 0, 0, 2, 2, 2, 0],
	[0, 1, 0, 0, 1, 1, 2, 2]
	];
	var score;

	function generateJewel() {
		return Math.floor(Math.random() * 3);
	}

	/* Start Game */
	function init() {
		/*for(var i = 0; i < boardSize; ++i) {
			var temp = [];
			for(var j = 0; j < boardSize; ++j) {
				temp.push(generateJewel());
			}
			board.push(temp);
		}*/
		console.log(board);
		score = 0;
		if(typeof game_loop !== 'undefined') clearInterval(game_loop);
		game_loop = setInterval(draw, 60);
	}

	init();

	function drawJewel(x, y, val) {
		if(val === 0) {
			ctx.fillStyle = '#ff0000';
		} else if(val === 1) {
			ctx.fillStyle = '#00ff00';
		} else if(val === 2){
			ctx.fillStyle = '#0000ff';
		} else if(val === 4) {
			ctx.fillStyle = '#fff';
		} else {
			ctx.fillStyle = '#000';
		}
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = '#000';
		ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}

	function clearMatchesXAxis(startX, startY, length) {
		console.log(startX, startY, length);
		for(var i = startX; i < startX + length; ++i) {
			board[startY][i] = 3;
		}
	}

	function tileSlideDown() {
		for(var x = 0; x < boardSize; ++x) {
			var emptyCells = [];
			for(var y = boardSize - 1; y > 0; --y) {
				//console.log(board[y][x]);
				if(board[y][x] === 3) {
					emptyCells.unshift({'x': x, 'y': y});
				} else if(emptyCells.length) {
					var deepestEmptyCell = emptyCells.pop();
					board[deepestEmptyCell.y][deepestEmptyCell.x] = board[y][x];
					board[y][x] = 3;
					emptyCells.unshift({'x': x, 'y': y});
				}
			}
			console.log('column' + x);
			console.log(emptyCells);
			emptyCells = [];
		}
	}

	function match() {
		var count = 1;
		var prevVal = -1;
		for(var j = 0; j < boardSize; ++j) {
			for(var i = 0; i < boardSize; ++i) {
				var currVal = board[j][i];
				if(currVal === prevVal) {
					++count;
				} else {
					if(count >= 3) {
						//console.log('x:' + i + ', ' + 'y:' + j + ', ' + 'count:' + count);
						clearMatchesXAxis(i - count, j, count);
					}
					count = 1;
				}
				prevVal = currVal;
			}
			if(count >= 3) {
				//console.log('x:' + i + ', ' + 'y:' + j + ', ' + 'count:' + count);
				clearMatchesXAxis(boardSize - count, j, count);
			}
			count = 1;
			prevVal = -1;
		}
	}

	function draw() {
		//draw the background to clear previous frame
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				drawJewel(x, y, board[y][x]);
			}
		}

		var score_text = 'Score: ' + score;
		ctx.fillStyle = '#000';
		ctx.fillText(score_text, canvasWidth - 155, 15);
	}

	match();
	tileSlideDown();

	/* Input */
	window.onmousedown = function(evt) {
		var key = evt.which;
		//console.log(key);
	}
};