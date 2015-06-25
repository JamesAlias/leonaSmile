canvas.onmousedown = function (event) {
	var pan = computeStereoPan(event.pageX, canvas.width);
  var index = Math.floor(Math.random() * tones.length);
  var volume = computeVolume(event.pageY, canvas.height);

  // debug
  // console.log(tones[index].name + "; pan: " + pan + "; vol: " + volume);

  play(index, volume, pan);
};


