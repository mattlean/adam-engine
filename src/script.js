/*
 * DYE MATCH GAME
 * Version: 0.0.2
 * Developed by Matthew Lean
 * www.mattlean.com
 * 2014
 */
window.onload = function() {
 	var isIE = false;
 	var ua = window.navigator.userAgent;
 	var msie = ua.indexOf("MSIE ");
 	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
 		isIE = true;

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
		'FAM': 'images/FAM2.png',
		'GOLD': 'images/GOLD2.png',
		'ORANGE': 'images/ORANGE2.png',
		'RED': 'images/RED2.png',
		'QUASAR': 'images/QUASAR2.png',
		'BHQ': 'images/BHQ2.png',
		'timer': 'images/tube.png',
		'bg': 'images/bg.png'
	};
	var selSfx;
	var swapSfx;
	var scoreSfx;
	var illegalSfx;
	var countdownSfx;
	var goSfx;
	var sfxsLoaded = 0;
	var RNGFact = 0;
	var highscore = 3000;
	var graphval = 0;

	/* Constants */
	const FRAMERATE = 1000 / 60;
	const NUMIMGS = 8; //number of images
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
	const BGCOLOR2 = 'rgba(0, 0, 0, 0.25)';
	const BTNCOLOR = '#ef3e33';
	const FONTCOLOR = '#fff';
	const STARTTIME = 3600; //3600 = 60 seconds
	const MAXGRAPHFILL = 290;
	const GAMETITLE = 'qPCR Crush™ Game';
	const NUMFACTS = 24;

	if(isIE) {
		var NUMSFXS = 0; 
	} else {
		var NUMSFXS = 6; //number of sound effects
	}

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
		ctx.font = txtFont;
		ctx.fillStyle = txtColor;
		ctx.fillText(txt, posX + (btnWidth / 2), posY + (btnHeight / 2) + txtOffset);
	}

	function paintBG() {
		ctx.drawImage(imgs['bg'], -70, 0);
	}

	/* Sound */
	function Sound(source) {
		if(!isIE) {
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

				++sfxsLoaded;
			}

			getSound.send();
		}
	}

	Sound.prototype.play = function(volLevel) {
		if(!isIE) {
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
		countdownSfx = new Sound('sounds/countdown.wav');
		goSfx = new Sound('sounds/go.wav');
	}

	function draw_loading() {
		if((imgsLoaded === NUMIMGS) && (sfxsLoaded === NUMSFXS)) {
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
		paintBG();
		ctx.fillStyle = FONTCOLOR;

		ctx.textAlign = 'center';
		ctx.font = '2em Helvetica';
		var txtTitle = GAMETITLE;
		ctx.fillText(txtTitle, canvasWidth / 2, (canvasHeight / 2) - 20);

		drawBtn((canvasWidth / 2) - 100, (canvasHeight / 2) + 20, 200, 45, BTNCOLOR, 'START GAME', '1.5em Helvetica', '#fff', 8);
	}

	/* Begins a new game */
	function init_game() {
		//replace default touch controls
		canvas.addEventListener('touchstart', touchHandler, false);
		canvas.addEventListener('touchend', touchHandler, false);
		canvas.addEventListener('touchleave', touchExitHandler, false);
		canvas.addEventListener('touchcancel', touchExitHandler, false);

		board = [];
		selectedCells = [];

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
		time = 240; //3 seconds
		//time = 1;
		//console.log(board);
		if(typeof game_loop !== 'undefined') clearInterval(game_loop);
		RNGFact = Math.floor(Math.random() * NUMFACTS);
		game_loop = setInterval(draw_ready, FRAMERATE);
		clickCtrl = -1;
		/*clickCtrl = 1;
		game_loop = setInterval(draw_game, FRAMERATE);*/
	}
	
	function draw_ready() {
		if(time <= 0) {
			clearInterval(game_loop);
			time = STARTTIME;
			//time = 1;
			game_loop = setInterval(draw_game, FRAMERATE);
			clickCtrl = 1;
		}

		//draw the background to clear previous frame
		paintBG();
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, 320, 320);

		ctx.globalAlpha = 0.5;
		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				drawJewel(x, y, board[y][x], false, true);
			}
		}

		if(selectedCells.length !== 0) {
			drawJewel(selectedCells[0].x, selectedCells[0].y, board[selectedCells[0].y][selectedCells[0].x], true, true);
		}

		/* Draw score */
		ctx.fillStyle = FONTCOLOR;
		ctx.textAlign = 'start';
		ctx.font = '1.2em Helvetica';
		var txtScore = 'Score:';
		ctx.fillText(txtScore, 325, 20);

		var txtScoreVal = score;
		ctx.fillText(txtScoreVal, 386, 20);

		paint_graph(620, 50);
		
		/* Draw Time */
		ctx.textAlign = 'start';
		ctx.font = '1.2em Helvetica';
		var txtTime = 'Time:';
		ctx.fillText(txtTime, 325, 160);
		ctx.fillStyle = '#8cc63e';
		ctx.fillRect(384, 196, 21, 115);
		ctx.drawImage(imgs['timer'], 375, 170, 39, 147);

		ctx.globalAlpha = 1;
		ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
		ctx.fillRect(30, 30, 420, 260);

		var txtCount;
		var seconds = Math.ceil(time / 60);
		if(seconds > 3) {
			ctx.fillStyle = '#ff0000';
			txtCount = '3';
			if(time === 240) countdownSfx.play();
		} else if(seconds > 2) {
			ctx.fillStyle = '#ffd700';
			txtCount = '2';
			if(time === 180) countdownSfx.play();
		} else if(seconds > 1) {
			ctx.fillStyle = '#8cc63e';
			txtCount = '1';
			if(time === 120) countdownSfx.play();
		} else {
			ctx.fillStyle = '#00ff00';
			txtCount = 'GO!';
			if(time === 60) goSfx.play();
		}
		ctx.font = 'bold 1.25em Helvetica';
		ctx.textAlign = 'center';
		var txtReady = 'Get ready!';
		ctx.fillText(txtReady, 240, 90);
		ctx.font = 'bold 3em Helvetica';
		ctx.fillText(txtCount, 240, 140);

		ctx.fillStyle = '#FFA500';
		ctx.font = '1.5em Helvetica';
		var txtFactTitle = 'Did you know?';
		ctx.fillText(txtFactTitle, 240, 190);
		ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
		ctx.fillRect(30, 205, 420, 85);
		ctx.fillStyle = '#fff';
		ctx.font = '0.9em Helvetica';
		generateFact();
		time -= 1;
	}

	function generateFact() {
		var txtFact;
		/* Fact Size Limitations:
		 * 50 character limit per line
		 * max lines 3 */
		switch(RNGFact) {
		 	case 0:
		 	txtFact = 'BHQ® dyes were launched back in 2000 and has since';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'become the quencher of choice for dual-labeled probes.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 1:
		 	txtFact = 'BHQ®-0, BHQ-1, BHQ-2, and BHQ-3 dyes quench across';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'the visible spectrum.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 2:
		 	txtFact = 'BHQ® dyes are true dark quenchers that are ideal';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'for multiplexing.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 3:
		 	txtFact = 'BHQ®-2 dye is recommended to pair with Quasar® 670';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'and Quasar 705 due to static quenching.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 4:
		 	txtFact = 'CAL Fluor® dyes are affordable alternatives to';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'VIC, TET, HEX, JOE, Texas Red®, TAMRA, and ROX.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 5:
		 	txtFact = 'Quasar® dyes are affordable alternatives to';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'Cy™ 3, Cy 5, and Cy 5.5 dyes.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 6:
		 	txtFact = 'You can design your qPCR probes and primers';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'for free using RealTimeDesign™ software.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 7:
		 	txtFact = 'A 20 base oligo made with only A,T,C, and G';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'has over trillion possible combinations.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 8:
		 	txtFact = 'BHQ® dyes absorb visible light and shift';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'the emission spectra far enough to be out of';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'the visible range to be released as heat.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	case 9:
		 	txtFact = 'Fluorescence was first described way back in 1852';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = ' by British Scientist Sir George Gabriel Stokes.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 10:
		 	txtFact = 'Many common substances we use exhibit fluorescence';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'properties including vitamin B2, tonic water,';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'and many laundry detergents.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	case 11:
		 	txtFact = 'Synthetic DNA is essentially chemically identical';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'to natural DNA and yet they are produced by two';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'entirely different methods.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	case 12:
		 	txtFact = 'Taq polymerase was discovered in a bacteria';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'originally isolated in 1966 from a hot spring';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'in Yellowstone National Park.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	case 13:
		 	txtFact = 'Back in the 1980s, the synthesis of a single';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'oligo could cost thousands of dollars!';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 14:
		 	txtFact = 'BHQplus® probes can be used to detect SNPs';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'and AT-rich regions.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 15:
		 	txtFact = 'Biosearch Technologies has been part of the';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'oligo synthesis industry since 1980.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 16:
		 	txtFact = 'On select instruments, you can multiplex up';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'to 5 assays using BHQ® probes.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 17:
		 	txtFact = 'For longer probe sequences (i.e. >30 bases)';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'you can position the BHQ® dye internally';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'for improved quenching.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	case 18:
		 	txtFact = 'In 1989, Taq polymerase was awarded the';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'first "Molecule of the Year" award by the';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'journal Science.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	case 19:
		 	txtFact = 'Kary Mullis received the Nobel Prize in 1993';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'for his research on the development of PCR.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 20:
		 	txtFact = 'Save some time! Biosearch\'s ValuMix™ qPCR assay';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'combines custom primers and probes in a single tube.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 21:
		 	txtFact = 'BHQplus® probes allow the design of shorter oligos';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'while maintaining the optimal Tm for qPCR.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 22:
		 	txtFact = 'Taq polymerase can replicate a 1000 base pair';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'strand of DNA in under 10 seconds.';
		 	ctx.fillText(txtFact2, 240, 250);
		 	break;
		 	case 23:
		 	txtFact = 'CAL Fluor® dyes eliminate the multiple isomers';
		 	ctx.fillText(txtFact, 240, 230);
		 	txtFact2 = 'and low synthesis yields associated with typical';
		 	ctx.fillText(txtFact2, 240, 250);
		 	txtFact3 = 'xanthene dyes.';
		 	ctx.fillText(txtFact3, 240, 270);
		 	break;
		 	default:
		 	txtFact = 'DEBUG MSG';
		 	ctx.fillText(txtFact, 240, 230);
		 }
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
			ctx.fillStyle = 'rgba(0, 0, 0, 0)';
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

	function paint_graph(offsetX, offsetY) {
		ctx.beginPath();
		ctx.moveTo(328, 30);
		ctx.lineTo(328, 130);
		ctx.lineWidth = 2;
		ctx.strokeStyle = FONTCOLOR;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(328, 130);
		ctx.lineTo(475, 130);
		ctx.lineWidth = 2;
		ctx.strokeStyle = FONTCOLOR;
		ctx.stroke();

		ctx.save();
		ctx.scale(0.45, 0.45);
		ctx.beginPath();
		ctx.moveTo(129.5, 205.5);
		ctx.bezierCurveTo(127.2 + offsetX, 205.5 + offsetY, 125.8 + offsetX, 205.5 + offsetY, 125.5 + offsetX, 205.5 + offsetY);
		ctx.bezierCurveTo(124.1 + offsetX, 205.4 + offsetY, 123.0 + offsetX, 204.3 + offsetY, 123.0 + offsetX, 202.9 + offsetY);
		ctx.bezierCurveTo(123.0 + offsetX, 201.6 + offsetY, 124.1 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
		ctx.bezierCurveTo(125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
		ctx.bezierCurveTo(126.2 + offsetX, 200.5 + offsetY, 196.0 + offsetX, 201.1 + offsetY, 211.9 + offsetX, 191.9 + offsetY);
		ctx.bezierCurveTo(225.8 + offsetX, 183.9 + offsetY, 231.6 + offsetX, 156.9 + offsetY, 237.2 + offsetX, 130.8 + offsetY);
		ctx.bezierCurveTo(243.0 + offsetX, 104.0 + offsetY, 248.4 + offsetX, 78.7 + offsetY, 262.3 + offsetX, 68.6 + offsetY);
		ctx.bezierCurveTo(269.7 + offsetX, 63.2 + offsetY, 281.6 + offsetX, 59.2 + offsetY, 294.9 + offsetX, 57.6 + offsetY);
		ctx.bezierCurveTo(340.0 + offsetX, 52.2 + offsetY, 409.9 + offsetX, 52.9 + offsetY, 410.6 + offsetX, 52.9 + offsetY);
		ctx.bezierCurveTo(412.0 + offsetX, 52.9 + offsetY, 413.1 + offsetX, 54.0 + offsetY, 413.1 + offsetX, 55.4 + offsetY);
		ctx.bezierCurveTo(413.0 + offsetX, 56.8 + offsetY, 411.9 + offsetX, 57.9 + offsetY, 410.6 + offsetX, 57.9 + offsetY);
		ctx.bezierCurveTo(410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY);
		ctx.bezierCurveTo(409.8 + offsetX, 57.9 + offsetY, 340.3 + offsetX, 57.2 + offsetY, 295.5 + offsetX, 62.6 + offsetY);
		ctx.bezierCurveTo(283.2 + offsetX, 64.0 + offsetY, 271.9 + offsetX, 67.8 + offsetY, 265.2 + offsetX, 72.7 + offsetY);
		ctx.bezierCurveTo(252.9 + offsetX, 81.7 + offsetY, 247.4 + offsetX, 107.2 + offsetY, 242.1 + offsetX, 131.9 + offsetY);
		ctx.bezierCurveTo(236.3 + offsetX, 159.0 + offsetY, 230.2 + offsetX, 187.1 + offsetY, 214.4 + offsetX, 196.2 + offsetY);
		ctx.bezierCurveTo(199.5 + offsetX, 204.8 + offsetY, 144.9 + offsetX, 205.5 + offsetY, 129.5 + offsetX, 205.5 + offsetY);
		ctx.closePath();
		ctx.clip();
		var scorepercent = score / highscore;
		if (scorepercent <= 1) {
			graphval = scorepercent * MAXGRAPHFILL;
			ctx.fillStyle = '#ee3e33';
		} else {
			graphval = MAXGRAPHFILL;
			ctx.fillStyle = '#00ff00';
		}
		
		ctx.fillRect(744, 70, graphval, 200); //max is 290
		ctx.restore();
	}

	function paint_graph2(offsetX, offsetY) {
		ctx.beginPath();
		ctx.moveTo(170, 80);
		ctx.lineTo(170, 180);
		ctx.lineWidth = 2;
		ctx.strokeStyle = FONTCOLOR;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(170, 180);
		ctx.lineTo(317, 180);
		ctx.lineWidth = 2;
		ctx.strokeStyle = FONTCOLOR;
		ctx.stroke();

		ctx.save();
		ctx.scale(0.45, 0.45);
		ctx.beginPath();
		ctx.moveTo(129.5, 205.5);
		ctx.bezierCurveTo(127.2 + offsetX, 205.5 + offsetY, 125.8 + offsetX, 205.5 + offsetY, 125.5 + offsetX, 205.5 + offsetY);
		ctx.bezierCurveTo(124.1 + offsetX, 205.4 + offsetY, 123.0 + offsetX, 204.3 + offsetY, 123.0 + offsetX, 202.9 + offsetY);
		ctx.bezierCurveTo(123.0 + offsetX, 201.6 + offsetY, 124.1 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
		ctx.bezierCurveTo(125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
		ctx.bezierCurveTo(126.2 + offsetX, 200.5 + offsetY, 196.0 + offsetX, 201.1 + offsetY, 211.9 + offsetX, 191.9 + offsetY);
		ctx.bezierCurveTo(225.8 + offsetX, 183.9 + offsetY, 231.6 + offsetX, 156.9 + offsetY, 237.2 + offsetX, 130.8 + offsetY);
		ctx.bezierCurveTo(243.0 + offsetX, 104.0 + offsetY, 248.4 + offsetX, 78.7 + offsetY, 262.3 + offsetX, 68.6 + offsetY);
		ctx.bezierCurveTo(269.7 + offsetX, 63.2 + offsetY, 281.6 + offsetX, 59.2 + offsetY, 294.9 + offsetX, 57.6 + offsetY);
		ctx.bezierCurveTo(340.0 + offsetX, 52.2 + offsetY, 409.9 + offsetX, 52.9 + offsetY, 410.6 + offsetX, 52.9 + offsetY);
		ctx.bezierCurveTo(412.0 + offsetX, 52.9 + offsetY, 413.1 + offsetX, 54.0 + offsetY, 413.1 + offsetX, 55.4 + offsetY);
		ctx.bezierCurveTo(413.0 + offsetX, 56.8 + offsetY, 411.9 + offsetX, 57.9 + offsetY, 410.6 + offsetX, 57.9 + offsetY);
		ctx.bezierCurveTo(410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY);
		ctx.bezierCurveTo(409.8 + offsetX, 57.9 + offsetY, 340.3 + offsetX, 57.2 + offsetY, 295.5 + offsetX, 62.6 + offsetY);
		ctx.bezierCurveTo(283.2 + offsetX, 64.0 + offsetY, 271.9 + offsetX, 67.8 + offsetY, 265.2 + offsetX, 72.7 + offsetY);
		ctx.bezierCurveTo(252.9 + offsetX, 81.7 + offsetY, 247.4 + offsetX, 107.2 + offsetY, 242.1 + offsetX, 131.9 + offsetY);
		ctx.bezierCurveTo(236.3 + offsetX, 159.0 + offsetY, 230.2 + offsetX, 187.1 + offsetY, 214.4 + offsetX, 196.2 + offsetY);
		ctx.bezierCurveTo(199.5 + offsetX, 204.8 + offsetY, 144.9 + offsetX, 205.5 + offsetY, 129.5 + offsetX, 205.5 + offsetY);
		ctx.closePath();
		//ctx.fillStyle = '#333';
 		//ctx.fill();
 		ctx.clip();
 		var scorepercent = score / highscore;
 		if (scorepercent <= 1) {
 			graphval = scorepercent * MAXGRAPHFILL;
 			ctx.fillStyle = '#ee3e33';
 		} else {
 			graphval = MAXGRAPHFILL;
 			ctx.fillStyle = '#00ff00';
 		}

		ctx.fillRect(120 + offsetX, 20 + offsetY, graphval, 200); //max is 290
		ctx.restore();
	}

	/*function paint_graph2(offsetX, offsetY) {
		ctx.beginPath();
		ctx.moveTo(170, 80);
		ctx.lineTo(170, 180);
		ctx.lineWidth = 2;
		ctx.strokeStyle = FONTCOLOR;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(170, 180);
		ctx.lineTo(317, 180);
		ctx.lineWidth = 2;
		ctx.strokeStyle = FONTCOLOR;
		ctx.stroke();

		ctx.save();
		ctx.scale(0.45, 0.45);
		ctx.beginPath();
		ctx.moveTo(129.5, 205.5);
		ctx.bezierCurveTo(127.2 + offsetX, 205.5 + offsetY, 125.8 + offsetX, 205.5 + offsetY, 125.5 + offsetX, 205.5 + offsetY);
		ctx.bezierCurveTo(124.1 + offsetX, 205.4 + offsetY, 123.0 + offsetX, 204.3 + offsetY, 123.0 + offsetX, 202.9 + offsetY);
		ctx.bezierCurveTo(123.0 + offsetX, 201.6 + offsetY, 124.1 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
		ctx.bezierCurveTo(125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY, 125.5 + offsetX, 200.5 + offsetY);
		ctx.bezierCurveTo(126.2 + offsetX, 200.5 + offsetY, 196.0 + offsetX, 201.1 + offsetY, 211.9 + offsetX, 191.9 + offsetY);
		ctx.bezierCurveTo(225.8 + offsetX, 183.9 + offsetY, 231.6 + offsetX, 156.9 + offsetY, 237.2 + offsetX, 130.8 + offsetY);
		ctx.bezierCurveTo(243.0 + offsetX, 104.0 + offsetY, 248.4 + offsetX, 78.7 + offsetY, 262.3 + offsetX, 68.6 + offsetY);
		ctx.bezierCurveTo(269.7 + offsetX, 63.2 + offsetY, 281.6 + offsetX, 59.2 + offsetY, 294.9 + offsetX, 57.6 + offsetY);
		ctx.bezierCurveTo(340.0 + offsetX, 52.2 + offsetY, 409.9 + offsetX, 52.9 + offsetY, 410.6 + offsetX, 52.9 + offsetY);
		ctx.bezierCurveTo(412.0 + offsetX, 52.9 + offsetY, 413.1 + offsetX, 54.0 + offsetY, 413.1 + offsetX, 55.4 + offsetY);
		ctx.bezierCurveTo(413.0 + offsetX, 56.8 + offsetY, 411.9 + offsetX, 57.9 + offsetY, 410.6 + offsetX, 57.9 + offsetY);
		ctx.bezierCurveTo(410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY, 410.5 + offsetX, 57.9 + offsetY);
		ctx.bezierCurveTo(409.8 + offsetX, 57.9 + offsetY, 340.3 + offsetX, 57.2 + offsetY, 295.5 + offsetX, 62.6 + offsetY);
		ctx.bezierCurveTo(283.2 + offsetX, 64.0 + offsetY, 271.9 + offsetX, 67.8 + offsetY, 265.2 + offsetX, 72.7 + offsetY);
		ctx.bezierCurveTo(252.9 + offsetX, 81.7 + offsetY, 247.4 + offsetX, 107.2 + offsetY, 242.1 + offsetX, 131.9 + offsetY);
		ctx.bezierCurveTo(236.3 + offsetX, 159.0 + offsetY, 230.2 + offsetX, 187.1 + offsetY, 214.4 + offsetX, 196.2 + offsetY);
		ctx.bezierCurveTo(199.5 + offsetX, 204.8 + offsetY, 144.9 + offsetX, 205.5 + offsetY, 129.5 + offsetX, 205.5 + offsetY);
		ctx.closePath();
		ctx.clip();
		var scorepercent = score / highscore;
		if (scorepercent <= 1) {
			graphval = scorepercent * MAXGRAPHFILL;
			ctx.fillStyle = '#ee3e33';
		} else {
			graphval = MAXGRAPHFILL;
			ctx.fillStyle = '#00ff00';
		}
		
		ctx.fillRect(744, 70, graphval, 200); //max is 290
		ctx.restore();
	}*/

	function paint_sidebar() {
		/* Draw score */
		ctx.fillStyle = FONTCOLOR;
		ctx.textAlign = 'start';
		ctx.font = '1.2em Helvetica';
		var txtScore = 'Score:';
		ctx.fillText(txtScore, 325, 20);

		var txtScoreVal = score;
		ctx.fillText(txtScoreVal, 386, 20);

		paint_graph(620, 50);
		
		/* Draw Time */
		ctx.textAlign = 'start';
		ctx.font = '1.2em Helvetica';
		var txtTime = 'Time:';
		ctx.fillText(txtTime, 325, 160);

		var seconds = Math.ceil(time / 60);
		var tubeSegment = 115 / 60;
		var tubeStartLevel = 196 + ((60 * tubeSegment) - (seconds * tubeSegment));
		var tubeEndLevel = 115 - ((60 * tubeSegment) - (seconds * tubeSegment));
		if(seconds > 30) {
			ctx.fillStyle = '#8cc63e';
		} else if(seconds >= 10) {
			ctx.fillStyle = '#ffd700';
		} else {
			ctx.fillStyle = '#ff0000';
		}
		ctx.fillRect(384, tubeStartLevel, 21, tubeEndLevel);
		ctx.drawImage(imgs['timer'], 375, 170, 39, 147);
	}

	function draw_game() {
		if(time <= 0) {
			clearInterval(game_loop);
			canvas.removeEventListener('touchstart', touchHandler, false);
			canvas.removeEventListener('touchend', touchHandler, false);
			canvas.removeEventListener('touchleave', touchExitHandler, false);
			canvas.removeEventListener('touchcancel', touchExitHandler, false);
			clickCtrl = 2;
			game_loop = setInterval(draw_timeup, FRAMERATE);
		}

		//draw the background to clear previous frame
		paintBG();
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, 320, 320);

		for(var y = 0; y < boardSize; ++y) {
			for(var x = 0; x < boardSize; ++x) {
				drawJewel(x, y, board[y][x], false, true);
			}
		}

		if(selectedCells.length !== 0) {
			drawJewel(selectedCells[0].x, selectedCells[0].y, board[selectedCells[0].y][selectedCells[0].x], true, true);
		}

		paint_sidebar();
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
		paintBG();
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, 320, 320);

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

		paint_sidebar();
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
			paintBG();
			ctx.fillStyle = BGCOLOR2;
			ctx.fillRect(0, 0, 320, 320);

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

			paint_sidebar();
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
		paintBG();
		ctx.fillStyle = BGCOLOR2;
		ctx.fillRect(0, 0, 320, 320);

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

		paint_sidebar();
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
			paintBG();
			ctx.fillStyle = BGCOLOR2;
			ctx.fillRect(0, 0, 320, 320);

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

			paint_sidebar();
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

		ctx.font = '1.5em Helvetica';
		var txtTimeUp = 'GAME OVER';
		ctx.fillText(txtTimeUp, canvasWidth / 2, (canvasHeight / 2) - 100);

		var txtFinal = 'Final score:' + score;
		ctx.fillText(txtFinal, canvasWidth / 2, (canvasHeight / 2) + 50);

		drawBtn((canvasWidth / 2) + 20, (canvasHeight / 2) + 75, 150, 35, BTNCOLOR, 'PLAY AGAIN', '1.2em Helvetica', '#fff', 5);
		drawBtn((canvasWidth / 2) - 170, (canvasHeight / 2) + 75, 170, 35, BTNCOLOR, 'SUBMIT SCORE', '1.2em Helvetica', '#fff', 5);

		paint_graph2(270, 170);

		$('.formScore').html(score);
	}

	/* Mouse Click */
	function cellClick(evt, clickCtrl) {
		var key = evt.which;
		var x = evt.pageX - canvas.offsetLeft;
		var y = evt.pageY - canvas.offsetTop;
		var mouseCoord = { 'x': x, 'y': y };

		if(key === 1 && evt.target.id === 'canvas') { //only respond to left-clicks in canvas
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
				if((mouseCoord.x >= (canvasWidth / 2) - 170) && (mouseCoord.x <= (canvasWidth / 2)) && (mouseCoord.y >= (canvasHeight / 2) + 75) && (mouseCoord.y <= (canvasHeight / 2) + 75 + 35)) {
					//if SUBMIT SCORE is clicked
					$('#submitScoreForm').modal('show');
					selSfx.play();
				} else if((mouseCoord.x >= (canvasWidth / 2) + 20) && (mouseCoord.x <= (canvasWidth / 2) + 20 + 150) && (mouseCoord.y >= (canvasHeight / 2) + 75) && (mouseCoord.y <= (canvasHeight / 2) + 75 + 35)) {
					//if PLAY AGAIN is clicked
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

	/* Touch */
	function cellTouch(evt) {
		if(clickCtrl === 1) {
			var x = evt.changedTouches[0].pageX - canvas.offsetLeft;
			var y = evt.changedTouches[0].pageY - canvas.offsetTop;
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
					//console.log('start: ', clickedCell);
					selectedCells.push(clickedCell);
					selSfx.play();
				} else if(selectedCells.length === 1) {
					//console.log('end: ', clickedCell);
					if((clickedCell.x === selectedCells[0].x) && (clickedCell.y === selectedCells[0].y)) {
						return
					}
					if(clickedCell.x > selectedCells[0].x) {
						clickedCell.x = selectedCells[0].x + 1;
					} else if (clickedCell.x < selectedCells[0].x) {
						clickedCell.x = selectedCells[0].x - 1;
					}
					if(clickedCell.y > selectedCells[0].y) {
						clickedCell.y = selectedCells[0].y + 1;
					} else if (clickedCell.y < selectedCells[0].y) {
						clickedCell.y = selectedCells[0].y - 1;
					}
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
		}
	}

	function touchHandler(evt) {
		//console.log(evt.changedTouches[0].pageX, evt.changedTouches[0].pageY);
		cellTouch(evt);
	}

	function touchExitHandler(evt) {
		//console.log('exit');
		selectedCells = [];
	}

	/* "main()" */
	start();
};