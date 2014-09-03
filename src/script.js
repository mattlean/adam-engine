/*
 * DYE MATCH GAME
 * Version: 0.0.1
 * Developed by Matthew Lean
 * www.mattlean.com
 * 2014
 */

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
	/*var board = [
	[1, 5, 3, 4, 5, 2, 1, 1],
	[0, 3, 2, 5, 1, 2, 4, 4],
	[4, 1, 4, 0, 4, 1, 1, 5],
	[2, 2, 3, 1, 5, 5, 3, 4],
	[0, 4, 3, 0 ,4, 5, 4, 0],
	[5, 4, 1, 3, 1, 1, 0, 5],
	[5, 0, 3, 1, 0 ,1, 3, 1],
	[4, 3, 3, 1, 1, 3, 4, 3]
	];*/
	/*var board = [
	[1, 5, 3, 4, 5, 2, 1, 1],
	[0, 3, 2, 5, 1, 2, 4, 4],
	[4, 1, 4, 0, 4, 1, 1, 5],
	[2, 2, 3, 1, 5, 5, 3, 4],
	[0, 4, 3, 0 ,4, 5, 4, 0],
	[5, 4, 1, -1, 3, 1, 0, 5],
	[5, 0, 3, -1, 0 ,1, 3, 1],
	[4, 3, 3, -1, 1, 3, 4, 3]
	];*/
	/*var board = [
	[1, 5, 3, -1, 5, 2, 1, 1],
	[0, 3, 2, -1, 1, 2, 4, 4],
	[4, 1, 4, -1, 4, 1, 1, 5],
	[2, 2, 3, -1, 5, 5, 3, 4],
	[0, 4, 3, 0 ,4, 5, 4, 0],
	[5, 4, 1, 3, 1, 1, 0, 5],
	[5, 0, 3, 1, 0 ,1, 3, 1],
	[4, 3, 3, 1, 1, 3, 4, 3]
	];*/
	/*var board = [
	[1, 5, 3, 1, 5, 2, 1, 1],
	[0, 3, 2, -1, 1, 2, 4, 4],
	[4, 1, 4, -1, 4, 1, 1, 5],
	[2, 2, 3, -1, 5, 5, 3, 4],
	[0, 4, 3, 1 ,4, 5, 4, 0],
	[5, 4, 1, 0, 1, 1, 0, 5],
	[5, 0, 3, -1, 0 ,1, 3, 1],
	[4, 3, 3, 1, 1, 3, 4, 3]
	];*/
	var verifyBoard = [];
	var selectedCells = [];
	var cellsToAnimate = [];
	var opacity = 1;
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
	var selSfx;
	var swapSfx;
	var scoreSfx;
	var illegalSfx;

	/* Constants */
	const FRAMERATE = 1000 / 60;
	const NUMIMGS = 7;
	const SPEED = 5; //speed in which the jewels move
	const BLANK = -1;
	const FAM = 0;
	const GOLD = 1;
	const ORANGE = 2;
	const RED = 3;
	const QUASAR = 4;
	const BHQ = 5;
	const SPECIAL = 6;
	const DEBUG = 7;
	const BGCOLOR1 = '#2463aa';
	const BGCOLOR2 = '#a3a3a3';
	const FONTCOLOR = '#fff';
	const STARTTIME = 3600; //3600 = 60 seconds

	var slideTime = cellSize / SPEED;

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

	/* Sound */
	function Sound(source) {
		if(!window.audioContext) {
			audioCtx = new AudioContext;
		}

		var that = this;
		that.source = source;
		that.buffer = null;
		that.isLoaded = false;

		var getSound = new XMLHttpRequest();
		getSound.open('GET', that.source, true);
		getSound.responseType = 'arraybuffer';
		getSound.onload = function() {
			audioCtx.decodeAudioData(getSound.response, function(buffer) {
				that.buffer = buffer;
				that.isLoaded = true;
			});
		}

		getSound.send();
	}

	Sound.prototype.play = function(volLevel) {
		if(this.isLoaded === true) {
			var playSound = audioCtx.createBufferSource();
			playSound.buffer = this.buffer;

			var volume = audioCtx.createGain();
			playSound.connect(volume);
			if(volLevel) {
				volume.gain.value = volLevel;
			} else {
				volume.gain.value = 0.1;
			}
			volume.connect(audioCtx.destination);

			playSound.start(0);
		}
	}

	/* Start Game */
	function start() {
		game_loop = setInterval(draw_loading, FRAMERATE);

		//load images
		for(var key in imgPaths) {
			var newImg = new Image();
			newImg.onload = function() {
				++imgsLoaded;
			};
			newImg.src = imgPaths[key];
			imgs[key] = newImg;
		}

		//load sounds
		selSfx = new Sound('sounds/select.wav');
		swapSfx = new Sound('sounds/swap.wav');
		scoreSfx = new Sound('sounds/score.wav');
		illegalSfx = new Sound('sounds/illegalmove.wav');
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

	/* Begins a new game */
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

	function match(inputBoard, trackScore, clearMatches) {
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

		if(clearMatches) {
			//delete matched tilesets from board
			for(var y = 0; y < boardSize; ++y) {
				for(var x = 0; x < boardSize; ++x) {
					if(boardClearMarked[y][x] === 1) {
						inputBoard[y][x] = BLANK;
					}
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
		while(matchFound = match(inputBoard, trackScore, true)){
			jewelSlideDown(inputBoard);
			fillGaps(inputBoard);
		}
	}

	//slide down jewels with no animation during initial board setup
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

	function drawJewel(x, y, val, highlight, convert) {
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
			ctx.fillStyle = BGCOLOR2;
		} else {
			ctx.fillStyle = '#00ff00';
		}

		if(convert) {
			x *= cellSize;
			y *= cellSize;
		}

		if((val === BLANK) || (val === DEBUG)) ctx.fillRect(x, y, cellSize, cellSize);
		else {
			ctx.shadowColor = '#333';
			ctx.shadowBlur = 3;
			ctx.shadowOffsetY = 2;
			ctx.drawImage(img, x, y, cellSize, cellSize);
		}

		if(highlight) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#ff00ff';
			ctx.strokeRect(x, y, cellSize, cellSize);
		}

		ctx.shadowColor = 'rgba(0,0,0,0)';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetY = 0;
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
				drawJewel(x, y, board[y][x], false, true);
			}
		}

		if(selectedCells.length !== 0) {
			drawJewel(selectedCells[0].x, selectedCells[0].y, board[selectedCells[0].y][selectedCells[0].x], true, true);
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
		if(match(verifyBoard, false, false)) {
			clearInterval(game_loop);
			cellsToAnimate = selectedCells.slice();
			cellsToAnimate[0].prevX = selectedCells[0].x * cellSize;
			cellsToAnimate[0].prevY = selectedCells[0].y * cellSize;
			cellsToAnimate[1].prevX = selectedCells[1].x * cellSize;
			cellsToAnimate[1].prevY = selectedCells[1].y * cellSize;

			//draw swapping animation
			clickCtrl = -1; //disable clicking during animation
			swapSfx.play();
			game_loop = setInterval(function() {
				draw_swap(cellsToAnimate, direction);
			}, FRAMERATE);
		} else {
			illegalSfx.play();
			verifyBoard = copyBoard(board);
		}
	}

	function draw_swap(cellsToAnimate, direction) {
		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = BGCOLOR1;
		ctx.fillRect(cellSize * board.length, 0, 200, canvasHeight);

		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				//draw entire board except swapped jewels
				if(!(((cellsToAnimate[0].x === x) && (cellsToAnimate[0].y === y)) || ((cellsToAnimate[1].x === x) && (cellsToAnimate[1].y === y)))) {
					drawJewel(x, y, board[y][x], false, true);
				} else if((cellsToAnimate[0].x === x) && (cellsToAnimate[0].y === y)) {
					drawJewel(x, y, BLANK, false, true);
				} else if((cellsToAnimate[1].x === x) && (cellsToAnimate[1].y === y)) {
					drawJewel(x, y, BLANK, false, true);
				}
			}
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

		if(direction === 'left') {
			cellsToAnimate[0].prevX -= SPEED;
			cellsToAnimate[1].prevX += SPEED;
		} else if(direction === 'right') {
			cellsToAnimate[0].prevX += SPEED;
			cellsToAnimate[1].prevX -= SPEED;
		} else if(direction === 'up') {
			cellsToAnimate[0].prevY -= SPEED;
			cellsToAnimate[1].prevY += SPEED;
		} else if(direction === 'down') {
			cellsToAnimate[0].prevY += SPEED;
			cellsToAnimate[1].prevY -= SPEED;
		}

		//draw the actual swap animation
		if(
			((direction === 'right') && (cellsToAnimate[0].prevX <= (cellsToAnimate[1].x * cellSize))) ||
			((direction === 'left') && (cellsToAnimate[0].prevX >= (cellsToAnimate[1].x * cellSize))) ||
			((direction === 'up') && (cellsToAnimate[0].prevY >= (cellsToAnimate[1].y * cellSize))) ||
			((direction === 'down') && (cellsToAnimate[0].prevY <= (cellsToAnimate[1].y * cellSize)))
			) {
			drawJewel(cellsToAnimate[0].prevX, cellsToAnimate[0].prevY, board[cellsToAnimate[0].y][cellsToAnimate[0].x], false, false);
		drawJewel(cellsToAnimate[1].prevX, cellsToAnimate[1].prevY, board[cellsToAnimate[1].y][cellsToAnimate[1].x], false, false);
	} else {
		completeSwap();
	}
}

function completeSwap() {
	clearInterval(game_loop);
	board = copyBoard(verifyBoard);
	match(board, true, true);
	cellsToAnimate = [];
	destroyJewels();
}

function destroyJewels() {
	game_loop = setInterval(draw_destroy, FRAMERATE);
}

function draw_destroy() {
	if(opacity >= 0) {
			var opacityCheck = false; //set to true once opacity is decremented for iteration

			//draw the background to clear previous frame
			ctx.fillStyle = BGCOLOR2;
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillStyle = BGCOLOR1;
			ctx.fillRect(cellSize * board.length, 0, 200, canvasHeight);

			for(var y = 0; y < boardSize; ++y) {
				for(var x = 0; x < boardSize; ++x) {
					if(board[y][x] === BLANK) {
						if(!opacityCheck) {
							if(opacity >= 0) {
								opacity -= 0.1;
								opacityCheck = true;
							}
						}

						ctx.globalAlpha = opacity;
						drawJewel(x, y, verifyBoard[y][x], false, true);
						ctx.globalAlpha = 1;
					} else {
						drawJewel(x, y, verifyBoard[y][x], false, true);
					}
				}
			}

			opacityCheck = false;

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
		} else {
			completeDestroy();
		}
	}

	function completeDestroy() {
		clearInterval(game_loop);
		//jewelSlideDown(board);
		//fillGaps(board);
		verifyBoard = copyBoard(board);
		//game_loop = setInterval(draw_game, FRAMERATE);
		clickCtrl = 1; //re-enable clicking
		opacity = 1;
		//matchCycle(board, true);

		slideJewels();
	}

	function slideJewels() {
		clickCtrl = -1; //disable clicking during animation
		var cellsToSlide = jewelSlideDown2();

		if(cellsToSlide.length > 0) {
			game_loop = setInterval(function() {
				draw_slide(cellsToSlide);
			}, FRAMERATE);
		} else {
			var matchFound = -1;
			matchFound = match(board, true, true);
			if(matchFound === 1) {
				destroyJewels();
			} else {
				clickCtrl = 1;
				fillCells();
			}
		}
	}

	function jewelSlideDown2() {
		var cellsToSlide = [];

		for(var x = 0; x < boardSize; ++x) {
			var gapFound = false;
			for(var y = boardSize - 1; y >= 0; --y) {
				if(verifyBoard[y][x] === BLANK) {
					gapFound = true;
				} else if(gapFound) {
					cellsToSlide.push({'x': x, 'y': y, 'prevX': x * cellSize, 'prevY': y * cellSize});
				}
			}
		}

		for(var i = 0; i < cellsToSlide.length; ++i) {
			verifyBoard[cellsToSlide[i].y + 1][cellsToSlide[i].x] = verifyBoard[cellsToSlide[i].y][cellsToSlide[i].x];
			verifyBoard[cellsToSlide[i].y][cellsToSlide[i].x] = BLANK;
		}

		return cellsToSlide;
	}

	function draw_slide(cellsToSlide) {
		//draw the background to clear previous frame
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = BGCOLOR1;
		ctx.fillRect(cellSize * board.length, 0, 200, canvasHeight);

		//iterate through board
		for(var x = 0; x < boardSize; ++x) {
			rowLoop: for(var y = 0; y < boardSize; ++y) {
				//iterate through cellsToSlide
				for(var i = 0; i < cellsToSlide.length; ++i) {
					if((cellsToSlide[i].x === x) && (cellsToSlide[i].y === y)) {
						continue rowLoop;
					}
				}

				drawJewel(x, y, board[y][x], false, true);
			}
		}

		for(var i = 0; i < cellsToSlide.length; ++i) {
			cellsToSlide[i].prevY += SPEED;
			drawJewel(cellsToSlide[i].prevX, cellsToSlide[i].prevY, board[cellsToSlide[i].y][cellsToSlide[i].x], false, false);
		}

		slideTime -= 1;

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

		if(slideTime <= 0) {
			completeSlide();
		}
	}

	function completeSlide() {
		clearInterval(game_loop);
		board = copyBoard(verifyBoard);
		slideTime = cellSize / SPEED;
		clickCtrl = 1; //re-enable clicking
		slideJewels();
	}

	function fillCells() {
		clickCtrl = -1;
		fillGaps(verifyBoard);
		opacity = 0;
		game_loop = setInterval(draw_fill, FRAMERATE);
	}

	function draw_fill() {
		if(opacity <= 1) {
			var opacityCheck = false; //set to true once opacity is incremented for iteration

			//draw the background to clear previous frame
			ctx.fillStyle = BGCOLOR2;
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillStyle = BGCOLOR1;
			ctx.fillRect(cellSize * board.length, 0, 200, canvasHeight);

			for(var y = 0; y < boardSize; ++y) {
				for(var x = 0; x < boardSize; ++x) {
					if(board[y][x] === BLANK) {
						if(!opacityCheck) {
							if(opacity <= 1) {
								opacity += 0.2;
								opacityCheck = true;
							}
						}

						ctx.globalAlpha = opacity;
						drawJewel(x, y, verifyBoard[y][x], false, true);
						ctx.globalAlpha = 1;
					} else {
						drawJewel(x, y, verifyBoard[y][x], false, true);
					}
				}
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
		} else {
			completeFill();
		}
	}

	function completeFill() {
		clearInterval(game_loop);
		board = copyBoard(verifyBoard);
		opacity = 1;
		var matchFound = -1;
		matchFound = match(board, true, true);
		if(matchFound === 1) {
			destroyJewels();
		} else {
			clickCtrl = 1;
			game_loop = setInterval(draw_game, FRAMERATE);
		}
	}

	function addScore(count) {
		score += count * 10;
		scoreSfx.play();
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
					selSfx.play();
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
						selSfx.play();
					} else if(selectedCells.length === 1) {
						selectedCells.push(clickedCell);
						var firstCell = selectedCells[0];
						var secondCell = selectedCells[1];
						drawJewel(secondCell.x, secondCell.y, board[secondCell.y][secondCell.x], true, true);
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
						} else {
							illegalSfx.play();
						}
						selectedCells = [];
					}
				}
			} else if(clickCtrl === 2) {
				if((mouseCoord.x >= (canvasWidth / 2) - 100) && (mouseCoord.x <= (canvasWidth / 2) - 100 + 200) && (mouseCoord.y >= (canvasHeight / 2) + 40) && (mouseCoord.y <= (canvasHeight / 2) + 40 + 45)) {
					selSfx.play();
					init_game();
				}
			}/* else {
				console.log('Click disabled');
			}*/
		}
	}

	window.onmousedown = function(evt) {
		cellClick(evt, clickCtrl);
	}

	/* "main()" */
	start();
};