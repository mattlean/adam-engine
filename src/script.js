window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var game_loop;
	var cellSize = 40; //determines cell size. cell is always a square.
	var boardSize = 8; //determines board size. at the moment the board is always square.
	var board = [];
	var score;

	function generateJewel() {
		return Math.floor(Math.random() * 3);
	}

	/* Start Game */
	function init() {
		for(var i = 0; i < boardSize; ++i) {
			var temp = [];
			for(var j = 0; j < boardSize; ++j) {
				temp.push(generateJewel());
			}
			board.push(temp);
		}
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
		} else {
			ctx.fillStyle = '#0000ff';
		}
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = '#000';
		ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}

	function match(board) {
		var count = 0;
		var prevVal = -1;
		for(var j = 0; j < boardSize; ++j) {
			for(var i = 0; i < boardSize; ++i) {
				var currVal = board[j][i];
				//console.log(currVal);
				if(currVal === prevVal) {
					++count;
					//console.log(count);
				} else {
					if(count >= 2) {
						console.log('x:' + i + ', ' + 'y:' + j + ', ' + 'count:' + count);
					}
					count = 0;
					//console.log(count);
				}
				prevVal = currVal;
			}
			if(count >= 2) {
				console.log('x:' + i + ', ' + 'y:' + j + ', ' + 'count:' + count);
			}
			count = 0;
		}
	}

	function draw() {
		//draw the background to clear previous frame
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		for(var i = 0; i < boardSize; ++i) {
			for(var j = 0; j < boardSize; ++j) {
				drawJewel(i, j, board[j][i]);
			}
		}

		var score_text = 'Score: ' + score;
		ctx.fillStyle = '#000';
		ctx.fillText(score_text, canvasWidth - 155, 15);
	}

	match(board);

	/* Input */
	window.onmousedown = function(evt) {
		var key = evt.which;
		console.log(key);
	}
};