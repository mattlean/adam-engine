window.onload = function() {
	var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	var snake_array;

	function create_snake() {
		var length = 5;
		snake_array = [];
		for(var i = length-1; i >= 0; --i) {
			snake_array.push({x: i, y:0});
		}
	}

	create_snake();

	function draw() {
		for(var i = 0; i < snake_array.length; ++i) {
			var c = snake_array[i];
			ctx.fillStyle = '#00ff00';
			ctx.fillRect(c.x*10, c.y*10, 10, 10);
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(c.x * 10, c.y * 10, 10, 10);
		}
	}

	draw();
};