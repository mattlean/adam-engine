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
	var clickCtrl = 1;
	var speed = 1;
	var prevX;
	var prevY;
	var prevX2;
	var prevY2;
	var score;

	function generateJewel() {
		return Math.floor(Math.random() * 3);
	}

	function copyBoard(boardCopy, boardSource) {
		boardCopy = [];
		for(var y = 0; y < boardSource.length; ++y) {
			var temp = [];
			for(var x = 0; x < boardSource.length; ++x) {
				temp.push(boardSource[y][x]);
			}
			boardCopy.push(temp);
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

		//console.log(board);
		score = 0;
		if(typeof game_loop !== 'undefined') clearInterval(game_loop);
		game_loop = setInterval(draw, 60);
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
				if((currVal === prevVal) && (currVal != 3)) {
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

		//check matches in each row on y-axis
		for(var x = 0; x < boardSize; ++x) {
			for(var y = 0; y < boardSize; ++y) {
				var currVal = inputBoard[y][x];
				if((currVal === prevVal) && (currVal != 3)) {
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
					inputBoard[y][x] = 3;
				}
			}
		}

		return matchFound;
	}

	function jewelSlideDown() {
		for(var x = 0; x < boardSize; ++x) {
			var emptyCells = [];
			for(var y = boardSize - 1; y >= 0; --y) {
				if(board[y][x] === 3) {
					emptyCells.unshift({'x': x, 'y': y});
				} else if(emptyCells.length) {
					var deepestEmptyCell = emptyCells.pop();
					board[deepestEmptyCell.y][deepestEmptyCell.x] = board[y][x];
					board[y][x] = 3;
					emptyCells.unshift({'x': x, 'y': y});
				}
			}
			emptyCells = [];
		}
	}

	function drawJewel(x, y, val, highlight) {
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
		if(highlight) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#ff69b4';
		} else {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#fff';
		}
		ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}

	function fillGaps() {
		for(var y = 0; y < board.length; ++y) {
			for(var x = 0; x < board.length; ++x) {
				if(board[y][x] === 3) {
					board[y][x] = generateJewel();
				}
			}
		}
	}

	function draw() {
		//draw the background to clear previous frame
		ctx.fillStyle = '#fff';
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

	function matchCycle() {
		var matchFound = -1;
		while(matchFound = match(board)){
			jewelSlideDown();
			fillGaps();
		}
	}

	function animateJewel(x, y, val, direction) {
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
		ctx.fillRect(x, y, cellSize, cellSize);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#fff';
		ctx.strokeRect(x, y, cellSize, cellSize);
	}

	function drawSwap(cellsToAnimate, direction) {
		//draw the background to clear previous frame
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		//console.log(cellsToAnimate);
		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				if(!(((cellsToAnimate[0].x === x) && (cellsToAnimate[0].y === y)) || ((cellsToAnimate[1].x === x) && (cellsToAnimate[1].y === y)))) {
					drawJewel(x, y, board[y][x], false);
				} else if((cellsToAnimate[0].x === x) && (cellsToAnimate[0].y === y)) {
					drawJewel(x, y, 4, false);
				} else if((cellsToAnimate[1].x === x) && (cellsToAnimate[1].y === y)) {
					drawJewel(x, y, 4, false);
				}
			}

			if(direction === 'left') {
				prevX -= speed;
				prevX2 += speed;
			} else if(direction === 'right') {
				prevX += speed;
				prevX2 -= speed;
			} else if(direction === 'up') {
				prevY -= speed;
				prevY2 += speed;
			} else if(direction === 'down') {
				prevY += speed;
				prevY2 -= speed;
			}


			console.log(prevX);
			console.log(cellsToAnimate[1].x * cellSize);
			if(prevX <= (cellsToAnimate[1].x * cellSize)) {
				animateJewel(prevX, prevY, board[cellsToAnimate[0].y][cellsToAnimate[0].x]);
				animateJewel(prevX2, prevY2, board[cellsToAnimate[1].y][cellsToAnimate[1].x]);
			} else {
				completeSwap();
			}
		}
	}

	function swapJewels(direction) {
		var temp = verifyBoard[selectedCells[0].y][selectedCells[0].x];
		verifyBoard[selectedCells[0].y][selectedCells[0].x] = verifyBoard[selectedCells[1].y][selectedCells[1].x];
		verifyBoard[selectedCells[1].y][selectedCells[1].x] = temp;
		if(match(verifyBoard)) {
			clearInterval(game_loop);
			cellsToAnimate = selectedCells.slice();
			//console.log(cellsToAnimate);
			prevX = selectedCells[0].x * cellSize;
			prevY = selectedCells[0].y * cellSize;
			prevX2 = selectedCells[1].x * cellSize;
			prevY2 = selectedCells[1].y * cellSize;
			game_loop = setInterval(function() {
				drawSwap(cellsToAnimate, direction);
			}, 60);
		} else {
			verifyBoard = copyBoard(verifyBoard, board);
		}
	}

	function completeSwap() {
		board = copyBoard(board, verifyBoard);
		jewelSlideDown();
		fillGaps();
		matchCycle();
		verifyBoard = copyBoard(verifyBoard, board);
		clearInterval(game_loop);
		game_loop = setInterval(draw, 60);
	}

	/* Input */
	function cellClick(evt, clickCtrl) {
		if(clickCtrl) {
			console.log('clicked');
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
								swapJewels('left');
							} else if(secondCell.x - 1 === firstCell.x) {
								swapJewels('right');
							}
						} else if(secondCell.x === firstCell.x) {
							if(secondCell.y + 1 === firstCell.y) {
								swapJewels('up');
							} else if(secondCell.y - 1 === firstCell.y) {
								swapJewels('down');
							}
						}
						selectedCells = [];
					}
				}
			}
		}
	}

	window.onmousedown = function(evt) {
		cellClick(evt, clickCtrl);
	}

	init();
	matchCycle();
	verifyBoard = copyBoard(verifyBoard, board);
};