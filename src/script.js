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
	var score = 0;
	var time = 0;
	var tubeTime = 100;
	var clickCtrl = 0; //controls state of click availability
	var imgs = {}; //dictionary of images
	var imgsLoaded = 0;
	var imgPaths = {
		'FAM': 'images/FAM.png',
		'GOLD': 'images/GOLD.png',
		'ORANGE': 'images/ORANGE.png',
		'RED': 'images/RED.png',
		'QUASAR': 'images/QUASAR.png',
		'BHQ': 'images/BHQ.png',
		'timer': 'images/tube.png'
	};

	/* Constants */
	const FRAMERATE = 1000 / 60;
	const NUMIMGS = 7;
	const SPEED = 1; //speed in which the jewels move
	const BLANK = -1;
	const FAM = 0;
	const GOLD = 1;
	const ORANGE = 2;
	const RED = 3;
	const QUASAR = 4;
	const BHQ = 5;
	const SPECIAL = 6;
	const BGCOLOR1 = '#2463aa';
	const BGCOLOR2 = '#000';
	const FONTCOLOR = '#fff';
	const STARTTIME = 3600; //60 seconds

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

	function drawBtn(posX, posY, btnWidth, btnHeight, btnColor, txt, txtFont, txtColor, txtOffset) {
		ctx.fillStyle = btnColor;
		ctx.fillRect(posX, posY, btnWidth, btnHeight);
		ctx.textAlign = 'center';
		ctx.font = '1.5em Helvetica';
		ctx.fillStyle = txtColor;
		ctx.fillText(txt, posX + (btnWidth / 2), posY + (btnHeight / 2) + txtOffset);
	}

	/* Start Game */
	function start() {
		game_loop = setInterval(draw_loading, FRAMERATE);

		for(var key in imgPaths) {
			var newImg = new Image();
			newImg.onload = function() {
				++imgsLoaded;
			};
			newImg.src = imgPaths[key];
			imgs[key] = newImg;
		}
	}

	function draw_loading() {
		if(imgsLoaded === NUMIMGS) {
			clearInterval(game_loop);
			game_loop = setInterval(draw_start, FRAMERATE);
			clickCtrl = 0;
		}

		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR1;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = FONTCOLOR;

		ctx.textAlign = 'center';
		ctx.font = '1em Helvetica';
		var txtLoading = 'Loading...';
		ctx.fillText(txtLoading, canvasWidth / 2, (canvasHeight / 2));
	}

	function draw_start() {
		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR1;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = FONTCOLOR;

		ctx.textAlign = 'center';
		ctx.font = '2em Helvetica';
		var txtTitle = 'DYE MATCH GAME TITLE';
		ctx.fillText(txtTitle, canvasWidth / 2, (canvasHeight / 2) - 20);

		drawBtn((canvasWidth / 2) - 100, (canvasHeight / 2) + 20, 200, 45, '#a6a6a6', 'START GAME', '1.5em Helvetica', '#fff', 8);
	}

	function init_game() {
		board = [];

		//initialize board with randomly generated jewels
		for(var y = 0; y < boardSize; ++y) {
			var temp = [];
			for(var x = 0; x < boardSize; ++x) {
				temp.push(generateJewel());
			}
			board.push(temp);
		}

		matchCycle(board, false);
		verifyBoard = copyBoard(board);
		score = 0;
		time = STARTTIME;
		//console.log(board);
		if(typeof game_loop !== 'undefined') clearInterval(game_loop);
		game_loop = setInterval(draw_game, FRAMERATE);
		clickCtrl = 1;
	}

	function match(inputBoard, trackScore) {
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
				if((currVal === prevVal) && (currVal !== BLANK)) {
					++count;
				} else {
					if(count >= 3) {
						//console.log('x:' + x + ', ' + 'y:' + x + ', ' + 'count:' + count);
						matchFound = 1;
						boardClearMarked = clearMatchesXAxis(x - count, y, count, boardClearMarked);
						if(trackScore) {
							addScore(count);
						}
					}
					count = 1;
				}
				prevVal = currVal;
			}
			if(count >= 3) {
				//console.log('x:' + i + ', ' + 'y:' + x + ', ' + 'count:' + count);
				matchFound = 1;
				boardClearMarked = clearMatchesXAxis(boardSize - count, y, count, boardClearMarked);
				if(trackScore) {
					addScore(count);
				}
			}
			count = 1;
			prevVal = -1;
		}

		//check matches in each column on y-axis
		for(var x = 0; x < boardSize; ++x) {
			for(var y = 0; y < boardSize; ++y) {
				var currVal = inputBoard[y][x];
				if((currVal === prevVal) && (currVal !== BLANK)) {
					++count;
				} else {
					if(count >= 3) {
						matchFound = 1;
						boardClearMarked = clearMatchesYAxis(x, y - count, count, boardClearMarked);
						if(trackScore) {
							addScore(count);
						}
					}
					count = 1;
				}
				prevVal = currVal;
			}
			if(count >= 3) {
				matchFound = 1;
				boardClearMarked = clearMatchesYAxis(x, boardSize - count, count, boardClearMarked);
				if(trackScore) {
					addScore(count);
				}
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

	function matchCycle(inputBoard, trackScore) {
		var matchFound = -1;
		while(matchFound = match(inputBoard, trackScore)){
			jewelSlideDown(inputBoard);
			fillGaps(inputBoard);
		}
	}

	function jewelSlideDown(inputBoard) {
		for(var x = 0; x < boardSize; ++x) {
			var emptyCells = [];
			for(var y = boardSize - 1; y >= 0; --y) {
				if(inputBoard[y][x] === BLANK) {
					emptyCells.unshift({'x': x, 'y': y});
				} else if(emptyCells.length) {
					var deepestEmptyCell = emptyCells.pop();
					inputBoard[deepestEmptyCell.y][deepestEmptyCell.x] = inputBoard[y][x];
					inputBoard[y][x] = BLANK;
					emptyCells.unshift({'x': x, 'y': y});
				}
			}
			emptyCells = [];
		}
	}

	function fillGaps(inputBoard) {
		for(var y = 0; y < board.length; ++y) {
			for(var x = 0; x < board.length; ++x) {
				if(inputBoard[y][x] === BLANK) {
					inputBoard[y][x] = generateJewel();
				}
			}
		}
	}

	function drawJewel(x, y, val, highlight) {
		var img;
		if(val === FAM) {
			img = imgs['FAM'];
		} else if(val === GOLD) {
			img = imgs['GOLD'];
		} else if(val === ORANGE){
			img = imgs['ORANGE'];
		} else if(val === RED) {
			img = imgs['RED'];
		} else if(val === QUASAR) {
			img = imgs['QUASAR'];
		} else if(val === BHQ) {
			img = imgs['BHQ'];
		} else if(val === BLANK) {
			ctx.fillStyle = '#000';
		} else {
			ctx.fillStyle = '#fff';
		}
		//ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
		ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize);
		if(highlight) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#ff00ff';
			ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
		}
	}

	function draw_game() {
		if(time <= 0) {
			clearInterval(game_loop);
			clickCtrl = 2;
			game_loop = setInterval(draw_timeup, FRAMERATE);
		}

		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = BGCOLOR1;
		ctx.fillRect(cellSize * board.length, 0, 200, canvasHeight);

		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				drawJewel(x, y, board[y][x], false);
			}
		}

		if(selectedCells.length !== 0) {
			drawJewel(selectedCells[0].x, selectedCells[0].y, board[selectedCells[0].y][selectedCells[0].x], true);
		}

		ctx.fillStyle = FONTCOLOR;
		ctx.textAlign = 'start';
		var txtScore = 'Score:';
		ctx.fillText(txtScore, 325, 20);

		ctx.textAlign = 'center';
		ctx.font = '2em Helvetica';
		var txtScoreVal = score;
		ctx.fillText(txtScoreVal, 400, 60);
		
		ctx.textAlign = 'start';
		ctx.font = '1.2em Helvetica';
		var txtTime = 'Time:';
		ctx.fillText(txtTime, 325, 110);

		var seconds = Math.ceil(time / 60);
		var tubeSegment = 147 / 60;
		var tubeStartLevel = 153 + ((60 * tubeSegment) - (seconds * tubeSegment));
		var tubeEndLevel = 147 - ((60 * tubeSegment) - (seconds * tubeSegment));
		if(seconds > 30) {
			ctx.fillStyle = '#8cc63e';
		} else if(seconds >= 10) {
			ctx.fillStyle = '#ffd700';
		} else {
			ctx.fillStyle = '#ff0000';
		}
		ctx.fillRect(386, tubeStartLevel, 28, tubeEndLevel);
		ctx.drawImage(imgs['timer'], 375, 120, 50, 187);
		time -= 1;
	}

	function swapJewels(direction) {
		var temp = verifyBoard[selectedCells[0].y][selectedCells[0].x];
		verifyBoard[selectedCells[0].y][selectedCells[0].x] = verifyBoard[selectedCells[1].y][selectedCells[1].x];
		verifyBoard[selectedCells[1].y][selectedCells[1].x] = temp;
		if(match(verifyBoard, true)) {
			board = copyBoard(verifyBoard, true);
			jewelSlideDown(board);
			fillGaps(board);
			matchCycle(board, true);
			verifyBoard = copyBoard(board);
		} else {
			verifyBoard = copyBoard(board);
		}
	}

	function addScore(count) {
		score += count * 10;
	}

	function draw_timeup() {
		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR1;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = FONTCOLOR;

		ctx.textAlign = 'center';

		ctx.font = '2em Helvetica';
		var txtTimeUp = 'TIME\'S UP!';
		ctx.fillText(txtTimeUp, canvasWidth / 2, (canvasHeight / 2) - 80);

		ctx.font = '1.5em Helvetica';
		var txtFinal = 'Your final score:';
		ctx.fillText(txtFinal, canvasWidth / 2, (canvasHeight / 2) - 45);

		ctx.font = '3.5em Helvetica';
		ctx.fillText(score, canvasWidth / 2, canvasHeight / 2 + 10);

		drawBtn((canvasWidth / 2) - 100, (canvasHeight / 2) + 35, 200, 45, '#a6a6a6', 'PLAY AGAIN', '1.5em Helvetica', '#fff', 8);
	}

	/* Input */
	function cellClick(evt, clickCtrl) {
		var key = evt.which;
		var x = evt.pageX - canvas.offsetLeft;
		var y = evt.pageY - canvas.offsetTop;
		var mouseCoord = { 'x': x, 'y': y };

		if(key === 1) { //only respond to left-clicks
			if(clickCtrl === 0) {
				if((mouseCoord.x >= (canvasWidth / 2) - 100) && (mouseCoord.x <= (canvasWidth / 2) - 100 + 200) && (mouseCoord.y >= (canvasHeight / 2) + 20) && (mouseCoord.y <= (canvasHeight / 2) + 20 + 45)) {
					init_game();
				}
			} else if(clickCtrl === 1) {
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
			} else if(clickCtrl === 2) {
				if((mouseCoord.x >= (canvasWidth / 2) - 100) && (mouseCoord.x <= (canvasWidth / 2) - 100 + 200) && (mouseCoord.y >= (canvasHeight / 2) + 40) && (mouseCoord.y <= (canvasHeight / 2) + 40 + 45)) {
					init_game();
				}
			}
		}
	}

	window.onmousedown = function(evt) {
		cellClick(evt, clickCtrl);
	}

	/* "main()" */
	start();
};