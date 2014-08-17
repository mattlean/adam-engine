InputMan = new function() {
	this.reset = function() {
		this.currPressedKeys = {};
		this.prevPressedKey = null;
		this.mouseDown = false;
		this.mouseClick = false;
		this.dx = 0;
		this.dy = 0;
		this.padState = 0;
		this.padPressed = -1;
		this.padReleased = 0;
	}

	this.reset();
	this.prevMouseX = 0;
	this.prevMouseY = 0;

	this.handleKeyDown = function(e) {
		this.currPressedKeys[e.keyCode] = true;
		this.prevPressedKey = e.keycode;
		console.log('it happened');
	}

	this.handleKeyUp = function(e) {
		this.currPressedKeys[e.keyCode] = false;
	}

	this.KEY = {'ESC': 27};

	this.handleMouseDown = function(e) {
		this.mouseDown = true;
		var newPos = getRelPos(canvas, e.pageX, e.pageY);
		this.prevMouseX = newPos.x;
		this.prevMouseY = newPos.y;
	}

	this.handleMouseMove = function(e) {
		var newPos = getRelPos(canvas, e.pageX, e.pageY);
		this.dx = newPos.x - this.prevMouseX;
		this.dy = newPos.y - this.prevMouseY;
		this.prevMouseX = newPos.x;
		this.prevMouseY = newPos.y;
	}

	this.connect = function(document, canvas) {
		var bindThis = this;
		document.addEventListener('keydown', function(e) {
			bindThis.handleKeyDown.call(bindThis, event);
		}, false);
		document.addEventListener('keyup', function(e) {
			bindThis.handleKeyUp.call(bindThis, event);
		}, false);
		canvas.addEventListener('mousedown', function(e) {
			bindThis.handleMouseDown.call(bindThis, event);
		}, false);
		/*canvas.addEventListener('click', function(e) {
			bindThis.handleMouseClick.call(bindThis, event);
		}, false);
		document.addEventListener('mouseup', function(e) {
			bindThis.handleMouseUp.call(bindThis, event);
		}, false);*/
		document.addEventListener('mousemove', function(e) {
			bindThis.handleMouseMove.call(bindThis, event);
		}, false);
	}

	this.PAD = { 'UP': 1, 'DOWN': 2, 'LEFT': 4, 'RIGHT': 8, 'OK': 16, 'CANCEL': 32 };

	this.padUpdate = function() {
		var state = 0;
		if (this.currPressedKeys[this.KEY.ARROW_UP])  	 state = state | this.PAD.UP;
		if (this.currPressedKeys[this.KEY.ARROW_DOWN])  state = state | this.PAD.DOWN;
		if (this.currPressedKeys[this.KEY.ARROW_LEFT])  state = state | this.PAD.LEFT;
		if (this.currPressedKeys[this.KEY.ARROW_RIGHT]) state = state | this.PAD.RIGHT;
		if (this.currPressedKeys[this.KEY.SPACEBAR]) 	state = state | this.PAD.OK;
		if (this.currPressedKeys[this.KEY.ENTER]) 		state = state | this.PAD.OK;
		if (this.mouseDown || this.mouseClick) 		        state = state | this.PAD.OK;
		if (this.currPressedKeys[this.KEY.ESCAPE]) 	state = state | this.PAD.CANCEL;
		
		this.padPressed = state & (~this.padState);
		this.padReleased = (~state) & this.padState;
		this.padState = state;
		this.mouseClick = false;
	}
}