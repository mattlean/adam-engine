var body = document.querySelector('body');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

body.appendChild(canvas);

var assets = [
	'/img/robowalk/robowalk00.png',
	'/img/robowalk/robowalk01.png',
	'/img/robowalk/robowalk02.png',
	'/img/robowalk/robowalk03.png',
	'/img/robowalk/robowalk04.png',
	'/img/robowalk/robowalk05.png',
	'/img/robowalk/robowalk06.png',
	'/img/robowalk/robowalk07.png',
	'/img/robowalk/robowalk08.png',
	'/img/robowalk/robowalk09.png',
	'/img/robowalk/robowalk10.png',
	'/img/robowalk/robowalk11.png',
	'/img/robowalk/robowalk12.png',
	'/img/robowalk/robowalk13.png',
	'/img/robowalk/robowalk14.png',
	'/img/robowalk/robowalk15.png',
	'/img/robowalk/robowalk16.png',
	'/img/robowalk/robowalk17.png',
	'/img/robowalk/robowalk18.png'
];
var frames = [];
var currFrame = 0;

for(var i=0; i < assets.length; ++i) {
	var newImg = new Image();
	newImg.onload = function() {
		console.log('image loaded');
	};
	newImg.src = assets[i];
	frames[i] = newImg;
}

var animate = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(frames[currFrame], 100, 100);
	currFrame = (currFrame + 1) % frames.length;
	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);