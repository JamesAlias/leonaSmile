/**
 * @fileoverview Main game logic of the game LeonaSmile.
 * @author robert.baruck@gmail.com (Robert Baruck)
 */


/** constants *****************************************************************/

/**
 * Standard volume
 * @const
 */
var STD_VOLUME = 0.85;

/**
 * Standard pan
 * @const
 */
var STD_PAN = 0;

/**
 * Standard radius
 * @const
 */
var STD_RADIUS = 1;

/**
 * Standard alpha
 * @const
 */
var STD_ALPHA = 1;

/**
 * Map of keyCodes ==> noteIndex
 * @const
 */
var keyMap = initKeyMap();


/** initialization ************************************************************/

/**
 * List of notes that will be used by {@link updatePlayingNotes} to play notes.
 * The values will correspond to the noteIndex of {@link notes}.
 */
var notesToPlay = [];


/** input events **************************************************************/

/**
 * Play note and create drop on mousedown event.
 * @param {Object} event Input event
 */
canvas.onmousedown = function(event) {
  var noteIndex = Math.floor(Math.random() * tones.length),
      pan = computeStereoPan(event.pageX, canvas.width),
      volume = computeVolume(event.pageY, canvas.height);

  // play note
  play(noteIndex, volume, pan);
  // create drop
  createDrop(
    event.pageX,
    event.pageY,
    STD_RADIUS,
    COLORS[Math.floor(Math.random() * COLORS.length)],
    STD_ALPHA,
    dropsToDraw);
};

/**
 * Add note depending on keyCode of key pressed to {@link notesToPlay} on
 * keydown event.
 * @param {Object} event Input event
 */
document.onkeydown = function(event) {
  keyCode = event.which;

  // if pressed key is "space"
  if (keyCode == 32) {
    // randomize color and note
    var randomNoteIndex = Math.floor(Math.random() * tones.length),
        randomColorIndex = Math.floor(Math.random() * COLORS.length),
        posX = canvas.width / 2,
        posY = canvas.height / 2,
        radius = 1,
        alpha = 1;

    // play note
    play(randomNoteIndex, STD_VOLUME, STD_PAN);
    // create drop
    createDrop(posX, posY, radius, COLORS[randomColorIndex], alpha, dropsToDraw);
  } else {
    // pushes noteIndex of pressed key into notesToPlay list
    var noteIndex = keyMap.get(keyCode);
    // if valid key and key not pressed prior to this event
    if ((noteIndex !== undefined) && (notesToPlay.indexOf(noteIndex) == -1)) {
      notesToPlay.push(noteIndex);
    }
  }
};

/**
 * Remove note from {@link notesToPlay} on keyup event.
 * @param {Object} event Input event
 */
document.onkeyup = function(event) {
  notesToPlay.splice(notesToPlay.indexOf(keyMap.get(event.which)));
};


/** game functions **********************************************************/

/**
 * Initialize {@link keyMap}
 * @return {Map}
 */
function initKeyMap() {
  var keyMap = new Map();
  // set [key, value] to [keyCode, noteIndex]
  for (var noteIndex = NOTES.length - 1; noteIndex >= 0; noteIndex--) {
    keyMap.set(NOTES[noteIndex].keyCode, noteIndex);
  }
  return keyMap;
}

/**
 * Play all notes in {@link notesToPlay}.
 */
function updatePlayingNotes() {
  for (var i = notesToPlay.length - 1; i >= 0; i--) {
    var noteIndex = notesToPlay[i],
        posX = NOTES[noteIndex].dropPos[0] * canvas.width / 100,
        posY = NOTES[noteIndex].dropPos[1] * canvas.height / 100,
        colorIndex = Math.floor(Math.random() * COLORS.length);

    // play note
    play(noteIndex, STD_VOLUME, STD_PAN);
    // draw
    createDrop(posX, posY, STD_RADIUS, COLORS[colorIndex], STD_ALPHA, dropsToDraw);
  }
}

/*
 * This is the game loop and will be called about 60 times per second
 * utilizing the {@link window.requestAnimationFrame} functionality.
 */
function gameloop() {
  updatePlayingNotes();
  updateVisuals();

  window.requestAnimationFrame(gameloop);
}


/** game **********************************************************************/

// start game
gameloop();
