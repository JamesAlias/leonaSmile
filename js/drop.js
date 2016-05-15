/**
 * Creates drop object.
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @param {number} radius
 * @param {number} alpha Opacity value (between 0 and 1)
 * @constructor
 */
function Drop(x, y, color, radius, alpha) {
  this.pos = {
    x: x,
    y: y
  };
  this.color = color;
  this.radius = radius || 1;
  this.alpha = alpha || 1;
}

/**
 * Draw drop on canvas.
 * @param  {Object} canvasCtx Canvas 2D context.
 */
Drop.prototype.draw = function(canvasCtx) {
  canvasCtx.beginPath();
  canvasCtx.arc(
    this.pos.x,
    this.pos.y,
    this.radius,
    0, Math.PI * 2, true);
  canvasCtx.closePath();
  canvasCtx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
  canvasCtx.fill();
};


/**
 * Update function for game loop. Handles behavior over time.
 * @param  {Object} canvasCtx Canvas 2d rendering context.
 */
Drop.prototype.update = function(canvasCtx) {
  this.draw(canvasCtx);
  // increase radius
  this.radius += 1.5;
  // update alpha
  this.alpha -= 1 / 60;
};
