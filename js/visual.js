/**
 * @fileoverview Main visual logic of the game LeonaSmile.
 * @author robert.baruck@gmail.com (Robert Baruck)
 */


/** constants *****************************************************************/

/**
 * HTML5 canvas element
 */
var canvas = initCanvas();

/**
 * HTML5 canvas context
 */
var canvasCtx = canvas.getContext('2d');

/**
 * List containing every individual drop (circle, visual representation of
 * tone) object to draw.
 */
var dropsToDraw = [];


/** visual functions **********************************************************/

/**
 * Gets and initializes HTML5 canvas element from DOM.
 * @return {Element} Canvas element
 */
function initCanvas() {
  // get canvas element
  var canvas = document.getElementById('canvas');
  // set width and height
  canvas.setAttribute('width', window.innerWidth.toString());
  canvas.setAttribute('height', window.innerHeight.toString() - 4);

  return canvas;
}

/**
 * Initialize menu onclick function
 */
function initMenu() {
  var menu = document.getElementById('menu');

  menu.onclick = function() {
    menu.style.display = 'none';
    document.getElementById('title').style.display = 'none';
    initGame();
    gameloop();
  };
}

/**
 * Creates drop object and pushes it into a given list.
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {string} color
 * @param {number} alpha Opacity value (between 0 and 1)
 * @param {Array.<Object>} list The list the drop is pushed into
 */
function createDrop(x, y, radius, color, alpha, list) {
  var drop = {};

  drop.pos = {};
  drop.pos.x = x;
  drop.pos.y = y;
  drop.radius = radius;
  drop.alpha = alpha;
  drop.color = color;

  list.push(drop);
}

/**
 * Draw drop on canvas.
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {string} color RGB in form of 'rrr, ggg, bbb'.
 * @param {number} alpha Opacity value (between 0 and 1)
 */
function drawDrop(x, y, radius, color, alpha) {
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, radius, 0, Math.PI * 2, true);
  canvasCtx.closePath();
  canvasCtx.fillStyle = 'rgba(' + color + ', ' + alpha + ')';
  canvasCtx.fill();
}

/**
 * Clear canvas and draw all drops in {@link dropsToDraw} as well as animating
 * the drops until removing them from {@link dropsToDraw} eventually.
 */
function updateVisuals() {
  // clear canvas
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  // draw drops
  for (var i = 0; i < dropsToDraw.length; i++) {
    // draw drop
    drawDrop(dropsToDraw[i].pos.x, dropsToDraw[i].pos.y, dropsToDraw[i].radius, dropsToDraw[i].color, dropsToDraw[i].alpha);
    // increase radius
    dropsToDraw[i].radius += 1.5;
    // update alpha
    dropsToDraw[i].alpha -= 1 / 60;
    // remove from list if alpha <= 0
    if (dropsToDraw[i].alpha <= 0) {
      dropsToDraw.shift();
      i--;
    }
  }
}
