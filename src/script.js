window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var game_loop;
	var cellSize = 40; //determines cell size. cell is always a square.
	var boardSize = 8; //determines board size. at the moment the board is always square.
	var board = [];
	/*var board = [
	[1, 2, 0, 1, 2, 2, 2, 0],
	[2, 0, 0, 2, 1, 2, 2, 0],
	[1, 0, 1, 0, 2, 2, 1, 2],
	[1, 2, 1, 1, 0, 0, 2, 1],
	[1, 2, 2, 1, 2, 2, 0, 0],
	[0, 0, 1, 2, 2, 2, 1, 0],
	[1, 2, 0, 0, 2, 2, 2, 0],
	[0, 1, 0, 0, 1, 1, 2, 2]
	];*/
	/*var board = [
	[1, 2, 2, 0, 0, 2, 0, 2],
	[1, 1, 2, 2, 0, 2, 0, 2],
	[0, 2, 1, 2, 2, 0, 2, 0],
	[1, 2, 2, 0, 0, 1, 0, 1],
	[2, 1, 2, 2, 1, 0, 2, 0],
	[1, 2, 0, 1, 2, 0, 1, 2],
	[1, 2, 2, 1, 2, 2, 1, 1],
	[0, 1, 1, 0, 1, 1, 2, 2]
	];*/
	var verifyBoard = [];
	var selectedCells = [];
	var cellsToAnimate = [];

	/* Constants */
	const SPEED = 1; //speed in which the jewels move
	const BLANK = -1;
	const FAM = 0;
	const GOLD = 1;
	const ORANGE = 2;
	const RED = 3;
	const QUASAR = 4;
	const BHQ = 5;
	const SPECIAL = 6;
	const BGCOLOR = '#2463aa';

	function generateJewel() {
		return Math.floor(Math.random() * 6);
	}

	function copyBoard(boardSource) {
		boardCopy = [];
		for(var i = 0; i < boardSource.length; ++i) {
			boardCopy[i] = boardSource[i].slice();
		}
		return boardCopy;
	}

	/* Start Game */
	function init() {
		//initialize board with randomly generated jewels
		for(var y = 0; y < boardSize; ++y) {
			var temp = [];
			for(var x = 0; x < boardSize; ++x) {
				temp.push(generateJewel());
			}
			board.push(temp);
		}

		console.log(board);
		score = 0;
		if(typeof game_loop !== 'undefined') clearInterval(game_loop);
		game_loop = setInterval(draw, 60);
	}

	function match(inputBoard) {
		var count = 1;
		var prevVal = -1;
		var matchFound = 0;

		//initialize boardClearMarked which tells game which tiles should be deleted
		var boardClearMarked = [];
		for(var y = 0; y < boardSize; ++y) {
			var temp = [];
			for(var x = 0; x < boardSize; ++x) {
				temp.push(0);
			}
			boardClearMarked.push(temp);
		}

		//check matches in each row on x-axis
		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				var currVal = inputBoard[y][x];
				if((currVal === prevVal) && (currVal != BLANK)) {
					++count;
				} else {
					if(count >= 3) {
						//console.log('x:' + x + ', ' + 'y:' + x + ', ' + 'count:' + count);
						matchFound = 1;
						boardClearMarked = clearMatchesXAxis(x - count, y, count, boardClearMarked);
					}
					count = 1;
				}
				prevVal = currVal;
			}
			if(count >= 3) {
				//console.log('x:' + i + ', ' + 'y:' + x + ', ' + 'count:' + count);
				matchFound = 1;
				boardClearMarked = clearMatchesXAxis(boardSize - count, y, count, boardClearMarked);
			}
			count = 1;
			prevVal = -1;
		}

		//check matches in each column on y-axis
		for(var x = 0; x < boardSize; ++x) {
			for(var y = 0; y < boardSize; ++y) {
				var currVal = inputBoard[y][x];
				if((currVal === prevVal) && (currVal != BLANK)) {
					++count;
				} else {
					if(count >= 3) {
						matchFound = 1;
						boardClearMarked = clearMatchesYAxis(x, y - count, count, boardClearMarked);
					}
					count = 1;
				}
				prevVal = currVal;
			}
			if(count >= 3) {
				matchFound = 1;
				boardClearMarked = clearMatchesYAxis(x, boardSize - count, count, boardClearMarked);
			}
			count = 1;
			prevVal = -1;
		}

		//delete matched tilesets from board
		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				if(boardClearMarked[y][x] === 1) {
					inputBoard[y][x] = BLANK;
				}
			}
		}

		return matchFound;
	}

	function clearMatchesXAxis(startX, startY, length, boardClearMarked) {
		for(var i = startX; i < startX + length; ++i) {
			boardClearMarked[startY][i] = 1;
		}
		return boardClearMarked;
	}

	function clearMatchesYAxis(startX, startY, length, boardClearMarked) {
		for(var i = startY; i < startY + length; ++i) {
			boardClearMarked[i][startX] = 1;
		}
		return boardClearMarked;
	}

	function matchCycle() {
		var matchFound = -1;
		while(matchFound = match(board)){
			jewelSlideDown();
			fillGaps();
		}
	}

	function jewelSlideDown() {
		for(var x = 0; x < boardSize; ++x) {
			var emptyCells = [];
			for(var y = boardSize - 1; y >= 0; --y) {
				if(board[y][x] === BLANK) {
					emptyCells.unshift({'x': x, 'y': y});
				} else if(emptyCells.length) {
					var deepestEmptyCell = emptyCells.pop();
					board[deepestEmptyCell.y][deepestEmptyCell.x] = board[y][x];
					board[y][x] = BLANK;
					emptyCells.unshift({'x': x, 'y': y});
				}
			}
			emptyCells = [];
		}
	}

	function fillGaps() {
		for(var y = 0; y < board.length; ++y) {
			for(var x = 0; x < board.length; ++x) {
				if(board[y][x] === BLANK) {
					board[y][x] = generateJewel();
				}
			}
		}
	}

	function drawJewel(x, y, val, highlight) {
		if(val === FAM) {
			ctx.fillStyle = '#00ff00';
		} else if(val === GOLD) {
			ctx.fillStyle = '#ffff00';
		} else if(val === ORANGE){
			ctx.fillStyle = '#ffa500';
		} else if(val === RED) {
			ctx.fillStyle = '#ff0000';
		} else if(val === QUASAR) {
			ctx.fillStyle = '#ff00ff';
		} else if(val === BHQ) {
			ctx.fillStyle = '#2e0854';
		} else if(val === BLANK) {
			ctx.fillStyle = '#000';
		} else {
			ctx.fillStyle = '#fff';
		}
		ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		if(highlight) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#0000ff';
		} else {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#fff';
		}
		ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}

	function draw() {
		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				drawJewel(x, y, board[y][x], false);
			}
		}

		if(selectedCells.length != 0) {
			drawJewel(selectedCells[0].x, selectedCells[0].y, board[selectedCells[0].y][selectedCells[0].x], true);
		}

		var score_text = 'Score: ' + score;
		ctx.fillStyle = '#000';
		ctx.fillText(score_text, canvasWidth - 155, 15);
	}

	function swapJewels(direction) {
		var temp = verifyBoard[selectedCells[0].y][selectedCells[0].x];
		verifyBoard[selectedCells[0].y][selectedCells[0].x] = verifyBoard[selectedCells[1].y][selectedCells[1].x];
		verifyBoard[selectedCells[1].y][selectedCells[1].x] = temp;
		if(match(verifyBoard)) {
			board = copyBoard(verifyBoard);
		} else {
			verifyBoard = copyBoard(board);
		}
	}

	/* Input */
	function cellClick(evt) {
		var key = evt.which;

		if(key === 1) {
			var x = evt.pageX - canvas.offsetLeft;
			var y = evt.pageY - canvas.offsetTop;
			var mouseCoord = { 'x': x, 'y': y };

			if((mouseCoord.x >= 0) && (mouseCoord.x <= 320) && (mouseCoord.y >= 0) && (mouseCoord.y <= 320)) {
				var clickedCell = {};

				if((mouseCoord.x / 40) <= 1) {
					clickedCell.x = 0;
				} else if((mouseCoord.x / 40) <= 2) {
					clickedCell.x = 1;
				} else if((mouseCoord.x / 40) <= 3) {
					clickedCell.x = 2;
				} else if((mouseCoord.x / 40) <= 4) {
					clickedCell.x = 3;
				} else if((mouseCoord.x / 40) <= 5) {
					clickedCell.x = 4;
				} else if((mouseCoord.x / 40) <= 6) {
					clickedCell.x = 5;
				} else if((mouseCoord.x / 40) <= 7) {
					clickedCell.x = 6;
				} else if((mouseCoord.x / 40) <= 8) {
					clickedCell.x = 7;
				}

				if((mouseCoord.y / 40) <= 1) {
					clickedCell.y = 0;
				} else if((mouseCoord.y / 40) <= 2) {
					clickedCell.y = 1;
				} else if((mouseCoord.y / 40) <= 3) {
					clickedCell.y = 2;
				} else if((mouseCoord.y / 40) <= 4) {
					clickedCell.y = 3;
				} else if((mouseCoord.y / 40) <= 5) {
					clickedCell.y = 4;
				} else if((mouseCoord.y / 40) <= 6) {
					clickedCell.y = 5;
				} else if((mouseCoord.y / 40) <= 7) {
					clickedCell.y = 6;
				} else if((mouseCoord.y / 40) <= 8) {
					clickedCell.y = 7;
				}

				if(selectedCells.length === 0) {
					selectedCells.push(clickedCell);
				} else if(selectedCells.length === 1) {
					selectedCells.push(clickedCell);
					var firstCell = selectedCells[0];
					var secondCell = selectedCells[1];
					drawJewel(secondCell.x, secondCell.y, board[secondCell.y][secondCell.x], true);
					if(secondCell.y === firstCell.y) {
						if(secondCell.x + 1 === firstCell.x) {
							swapJewels();
						} else if(secondCell.x - 1 === firstCell.x) {
							swapJewels();
						}
					} else if(secondCell.x === firstCell.x) {
						if(secondCell.y + 1 === firstCell.y) {
							swapJewels();
						} else if(secondCell.y - 1 === firstCell.y) {
							swapJewels();
						}
					}
					selectedCells = [];
				}
			}
		}
	}

	window.onmousedown = function(evt) {
		cellClick(evt);
	}

	/* "main()" */
	init();
	matchCycle();
	verifyBoard = copyBoard(board);
};