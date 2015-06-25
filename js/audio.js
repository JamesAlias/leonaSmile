/*
 * init audio
 */
var audioCtx = new AudioContext(),
		compressor = audioCtx.createDynamicsCompressor(),
		tones = [];

compressor.connect(audioCtx.destination);
compressor.attack.setTargetAtTime(0, audioCtx.currentTime, 0);
compressor.ratio.setTargetAtTime(20, audioCtx.currentTime, 0);
compressor.threshold.setTargetAtTime(-25, audioCtx.currentTime, 0);

// init individual tones
for (var i = 0; i < notes.length; i++) {
	tones[i] = {};

	tones[i].name = notes[i].name;

	tones[i].gainNode = audioCtx.createGain();
	tones[i].gainNode.connect(compressor);
	tones[i].gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0);

	tones[i].panNode = audioCtx.createStereoPanner();
	tones[i].panNode.connect(tones[i].gainNode);

	tones[i].oscillator = audioCtx.createOscillator();
	tones[i].oscillator.frequency.value = notes[i].frequency;
	tones[i].oscillator.connect(tones[i].panNode);
	tones[i].oscillator.start();
}


/*
 * audio functions
 */

function computeStereoPan (posX, width) {
	if (posX == width / 2) return 0;
	if (posX < width / 2) return (-1 * (1 - ((2 * posX) / width)));
	return ((2 * posX / width) - 1);
}

function computeVolume (posY, height) {
	return (1-(posY / height));
}

function play (index, volume, pan) {
	// set pan
	tones[index].panNode.pan.setTargetAtTime(pan, audioCtx.currentTime, 0);
	// set gain
	tones[index].gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.05);
	tones[index].gainNode.gain.setTargetAtTime(volume - (volume * 20 / 100), audioCtx.currentTime + 0.1, 0);
	tones[index].gainNode.gain.setTargetAtTime(0, audioCtx.currentTime + 0.5, 0.25);
}
