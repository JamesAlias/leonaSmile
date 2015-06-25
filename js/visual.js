/*
 * init visuals
 */
// init canvas
var canvas = document.getElementById('canvas'),
    canvasCtx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;

// init assets
var noteDrops = [],
		dropsToDraw = [];

// test stuff
// fill this dynamcliy later on, this is just for testing purposes
for (var i = 0; i < notes.length; i++) {
	noteDrops[i] = {};

	noteDrops[i].pos = {};
	noteDrops[i].pos.x = notes[i].dropPos[0] * canvas.width / 100;
	noteDrops[i].pos.y = notes[i].dropPos[1] * canvas.height / 100;
	noteDrops[i].radius = 1;
	noteDrops[i].alpha = 1;
	noteDrops[i].color = colors[0];
};


/*
 * visual functions
 */

function createDrop (x, y, radius, color, alpha, list) {
	var drop = {};

	drop.pos = {};
	drop.pos.x = x;
	drop.pos.y = y;
	drop.radius = radius;
	drop.alpha = alpha;
	drop.color = color;

	list.push(drop);
}

function drawDrop (x, y, radius, color, alpha) {
	canvasCtx.beginPath();
	canvasCtx.arc(x, y, radius, 0, Math.PI * 2, true);
	canvasCtx.closePath();
	canvasCtx.fillStyle = 'rgba(' + color + ', ' + alpha + ')';
	canvasCtx.fill();
}

function draw () {
	// clear canvas
	canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

	// draw drops
	for (var i = 0; i < dropsToDraw.length; i++) {
		// draw drop
		drawDrop(dropsToDraw[i].pos.x, dropsToDraw[i].pos.y, dropsToDraw[i].radius, dropsToDraw[i].color, dropsToDraw[i].alpha);
		// increase radius
		dropsToDraw[i].radius += 1.5;
		// update alpha
		dropsToDraw[i].alpha -= 1/60;
		// remove from list if alpha <= 0
		if (dropsToDraw[i].alpha <= 0) {
			dropsToDraw.shift();
			i--;
		}
	};

	// start animation
	window.requestAnimationFrame(draw);
}
