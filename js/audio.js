/**
 * @fileoverview Main audio logic of the game LeonaSmile.
 * @author robert.baruck@gmail.com (Robert Baruck)
 */


/** initialization ************************************************************/

/**
 * Web Audio audio context
 */
var audioCtx = new AudioContext();

/**
 * Web Audio compressor node
 */
var compressor = initCompressor();

/**
 * List containing every individual tone object (one for each note in {@link NOTES})
 */
var tones = initTones();


/** audio functions ***********************************************************/

/**
 * Creates and initializes Web Audio compressor node.
 * @return {Object} The initialized compressor node.
 */
function initCompressor() {
  // create compressor node
  var compressor = audioCtx.createDynamicsCompressor();
  // init compressor
  compressor.connect(audioCtx.destination);
  compressor.attack.setTargetAtTime(0, audioCtx.currentTime, 0);
  compressor.ratio.setTargetAtTime(20, audioCtx.currentTime, 0);
  compressor.threshold.setTargetAtTime(-25, audioCtx.currentTime, 0);

  return compressor;
}

/**
 * Creates and initializes a List containing every individual tone object.
 * @see tones
 * @return {List} The initialized tones list.
 */
function initTones() {
  var tones = [];

  // create a list containing every individual tone object
  for (var i = 0; i < NOTES.length; i++) {
    tones[i] = {};
    // name
    tones[i].name = NOTES[i].name;
    // gain node
    tones[i].gainNode = audioCtx.createGain();
    tones[i].gainNode.connect(compressor);
    tones[i].gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0);
    // pan node
    tones[i].panNode = audioCtx.createStereoPanner();
    tones[i].panNode.connect(tones[i].gainNode);
    // oscillator
    tones[i].oscillator = audioCtx.createOscillator();
    tones[i].oscillator.frequency.setTargetAtTime(NOTES[i].frequency, audioCtx.currentTime, 0);
    tones[i].oscillator.connect(tones[i].panNode);
    tones[i].oscillator.start();
  }

  return tones;
}

/**
 * Calculate stereo panning depending on position on x axis.
 * @param {number} posX Position on x axis
 * @param {number} width Canvas width
 * @return {number} The pan value (between -1 and 0).
 */
function computeStereoPan(posX, width) {
  // x right in the middle of canvas
  if (posX == width / 2) return 0;
  // x in left half of canvas
  if (posX < width / 2) return ((-1) * (1 - ((2 * posX) / width)));
  // x in right half of canvas
  return ((2 * posX / width) - 1);
}

/**
 * Calculate volume depending on position on y axis.
 * @param {number} posY Position on y axis
 * @param {number} height Canvas height
 * @return {number} The volume value (between 0 and 1).
 */
function computeVolume(posY, height) {
  return (1 - (posY / height));
}

/**
 * Play note by setting it's volume and pan. The volume is also set to reduce
 * it's value over time creating a fade out effect.
 * @param {number} index The index of the note in {@link tones}
 * @param {number} volume
 * @param {number} pan
 */
function play(index, volume, pan) {
  // set pan
  tones[index].panNode.pan.setTargetAtTime(pan, audioCtx.currentTime, 0);
  // set gain
  tones[index].gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.05);
  tones[index].gainNode.gain.setTargetAtTime(volume - (volume * 20 / 100), audioCtx.currentTime + 0.1, 0);
  tones[index].gainNode.gain.setTargetAtTime(0, audioCtx.currentTime + 0.5, 0.25);
}
