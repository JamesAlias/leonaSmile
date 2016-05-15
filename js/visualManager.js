/**
 * VisualManager class.
 * @constructor
 */
function VisualManager() {
  this.canvas = this.initCanvas();
  this.canvasCtx = this.canvas.getContext('2d');
  this.dropsToDraw = [];
}


/**
 * Gets and initializes HTML5 canvas element from DOM.
 * @return {Element} Canvas element
 */
VisualManager.prototype.initCanvas = function() {
  // get canvas element
  var canvas = document.getElementById('canvas');
  // set width and height
  canvas.setAttribute('width', window.innerWidth.toString());
  canvas.setAttribute('height', window.innerHeight.toString() - 4);

  return canvas;
};


/**
 * Update function for game loop.
 */
VisualManager.prototype.update = function() {
  // clear canvas
  this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // debugging
  var dropCount = 0;

  // update Drops
  this.dropsToDraw.forEach(function(drop) {
    dropCount++;
    drop.update(this.canvasCtx);
    // remove drop if alpha < 0
    if (drop.alpha < 0) {
      this.dropsToDraw.shift();
      drop = null;
      dropCount--;
    }
  });
  console.log(dropCount);
};
