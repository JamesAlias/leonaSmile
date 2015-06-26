/*
 * mouse events
 */
canvas.onmousedown = function (event) {
	var pan = computeStereoPan(event.pageX, canvas.width),
  		noteIndex = Math.floor(Math.random() * tones.length),
  		volume = computeVolume(event.pageY, canvas.height);

  // debug
  // console.log(tones[noteIndex].name + "; pan: " + pan + "; vol: " + volume);

  play(noteIndex, volume, pan);
  createDrop(event.pageX, event.pageY, 1, colors[Math.floor(Math.random() * colors.length)], 1, dropsToDraw);
};

/*
 * key events
 */

var keyMap = new Map(),
    notesToPlay = [];

// set [key, value] to [keyCode, noteIndex]
for (var i = notes.length - 1; i >= 0; i--) {
  keyMap.set(notes[i].keyCode, i);
}

// add note to notesToPlay list on key down event
document.onkeydown = function (event) {
  keyCode = event.which;

  // if pressed key is "space"
  if (keyCode == 32) {
    // randomize color and note
    var noteIndex = Math.floor(Math.random() * tones.length),
        colorIndex = Math.floor(Math.random() * colors.length),
        posX = canvas.width / 2,
        posY = canvas.height / 2,
        radius = 1,
        alpha = 1;

    play(noteIndex, 0.8, 0);
    createDrop(posX, posY, radius, colors[colorIndex], alpha, dropsToDraw);
  }
  else {
    // pushes noteIndex of pressed key into notesToPlay list
    var noteIndex = keyMap.get(keyCode);
    // if valid key and key not pressed prior to this event
    if ((noteIndex != undefined) && (notesToPlay.indexOf(noteIndex) == -1)) notesToPlay.push(noteIndex);
  }
}

// remove note from notesToPlay list on key up event
document.onkeyup = function (event) {
	notesToPlay.splice(notesToPlay.indexOf(keyMap.get(event.which)));
}

// plays all notes in notesToPlay list
function updateKeys () {
  var volume = 0.8,
      pan = 0,
      radius = 1,
      alpha = 1;

  for (var i = notesToPlay.length - 1; i >= 0; i--) {
    var noteIndex = notesToPlay[i],
        posX = notes[noteIndex].dropPos[0] * canvas.width / 100,
        posY = notes[noteIndex].dropPos[1] * canvas.height / 100,
        colorIndex = Math.floor(Math.random() * colors.length);

    // play note
    play(noteIndex, volume, pan);
    // draw
    createDrop(posX, posY, radius, colors[colorIndex], alpha, dropsToDraw);
  }
}

// gameloop
function gameloop () {
  updateKeys();
  updateVisuals();

  window.requestAnimationFrame(gameloop);
}

// game
gameloop();
