draw();

canvas.onmousedown = function (event) {
	var pan = computeStereoPan(event.pageX, canvas.width),
  		index = Math.floor(Math.random() * tones.length),
  		volume = computeVolume(event.pageY, canvas.height);

  // debug
  // console.log(tones[index].name + "; pan: " + pan + "; vol: " + volume);

  play(index, volume, pan);
  createDrop(event.pageX, event.pageY, 1, colors[Math.floor(Math.random() * colors.length)], 1, dropsToDraw);
};
