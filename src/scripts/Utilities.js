if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 30 );
		};
	} )();
}

function getRelPos(target, x, y) {
	var x = x - target.offsetLeft;
	var y = y - target.offsetTop;
	return { 'x': x, 'y': y };
}