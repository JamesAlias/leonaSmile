/*
 * init canvas
 */
var canvas = document.getElementById('canvas'),
    cancasCtx = canvas.getContext('2d')
    drops = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

for (var i = 0; i < notes.length; i++) {
	drops[i] = {};

	drops[i].Pos = {};
	drops[i].Pos.x = notes[i].dropPos[0];
	drops[i].Pos.y = notes[i].dropPos[1];
};
