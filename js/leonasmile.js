/*
 * init canvas
 */
var canvas = document.getElementById('canvas'),
    cancasCtx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


/*
 * init audio
 */
var audioCtx = new AudioContext(),
		compressor = audioCtx.createDynamicsCompressor(),
		tones = [];

compressor.connect(audioCtx.destination);
compressor.attack.value = 0;

// init tones
for (var i = 0; i < notes.length; i++) {
	tones[i] = {};
	tones[i].name = notes[i].name;
	tones[i].gainNode = audioCtx.createGain();
	tones[i].gainNode.connect(compressor);
	tones[i].gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0);
	tones[i].oscillator = audioCtx.createOscillator();
	tones[i].oscillator.frequency.value = notes[i].frequency;
	tones[i].oscillator.connect(tones[i].gainNode);
	tones[i].isPlaying = false;
};

var count = 0;

/*
 * functions
 */
canvas.onmousedown = function (event) {
  var x = event.pageX,
      y = event.pageY;

  var index = Math.floor(Math.random()*tones.length);

  play(index);
}

function play(i) {
	if (!tones[i].isPlaying) {
		tones[i].oscillator.start();
		tones[i].isPlaying = true;
	}
	tones[i].gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, 0);
	tones[i].gainNode.gain.setTargetAtTime(0.7, audioCtx.currentTime + 0.1, 0);
	tones[i].gainNode.gain.setTargetAtTime(0, audioCtx.currentTime + 0.5, 0.5);
}


