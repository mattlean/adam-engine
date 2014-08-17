var GLMan = new function() {
	this.prevTime = 0;
	this.currTick = null;
	this.prevElapsed = 0;
	this.prevElapsed2 = 0;

	/* Starts the game loop. Once started the loop never stops. */
	this.run = function(tick) {
		var prevTick = this.currTick;
		this.currTick = tick;
		if(this.prevTime === 0) {
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); });
		}
	}

	this.stop = function() {
		this.run(null);
	}

	this.tick = function() {
		if(this.currTick !== null) {
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); });
		} else {
			this.prevTime = 0;
			return;
		}

		var currTime = Date.now();
		var elapsed = currTime - this.prevTime;
		if(elapsed > 0) {
			if(this.prevTime !== 0) {
				if(elapsed > 1000) elapsed = 1000; //Cap max elapsed time to 1s to avoid death spiral
				//Hackish FPS smoothing
				var smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2) / 3;
				this.currTick(0.001 * smoothElapsed);
				this.prevElapsed2 = this.prevElapsed;
				this.prevElapsed = elapsed;
			}
			this.prevTime = currTime;
		}
	}
}