/**
 * @fileoverview The game LeonaSmile.
 * @author robert.baruck@gmail.com (Robert Baruck)
 */

/**
 * game class
 * @constructor
 */
function Game() {
  this.colors = [];
  this.notes = [];

  this.soundManager = new SoundManager();
  this.visualManager = new VisualManager();
}


/**
 * Retrieve Notes from server and stores sound buffers.
 */
Game.prototype.getNotes = function() {
  xhrGet('assets/notes.json', 'text')
    .then(function(event) {
      this.notes = JSON.parse(event.target.response);
      updateLoadedAssets(1);
      var urlList = this.getNoteUrls();
      updateLoadedAssets(1);
      this.soundManager.loadSounds(urlList);
    }.bind(this))
    .catch(function(error) {
      console.log('could not retrieve', 'assets/notes.json', '!\nerr:', error);
    });
};

/**
 * Get list of urls from {@link game.notes}.
 * Also make shure the urls are in the right order.
 * @return {array} List of urls.
 */
Game.prototype.getNoteUrls = function() {
  var urlList = new Array(this.length);

  this.notes.forEach(function(currentValue, index) {
    urlList[index] = currentValue.src;
  });

  return urlList;
};

/**
 * Retrieve colors from server.
 */
Game.prototype.getColors = function() {
  xhrGet('assets/colors.json', 'text')
    .then(function(event) {
      this.colors = JSON.parse(event.target.response);
      updateLoadedAssets(1);
    }.bind(this))
    .catch(function(error) {
      console.log('could not retrieve', 'assets/colors.json', '!\nerr:', error);
    });
};


/**
 * XMLHttpRequest interface
 * @param  {string} url  Url of the requested file.
 * @param  {string} type Type of response.
 * @return {Promise}     Promise
 */
function xhrGet(url, type) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = type;

    request.onerror = reject;
    request.onload = resolve;

    request.send();
  });
}

var UiModule = (function() {
  var assetCount = 40; //TODO should be 63 but some sounds are still missing
  var assetsLoaded = 0;


  return {
    getPercantageLoaded: function() {
      return this.assetsLoaded / game.assetCount * (100 - 2);
    },

    incAssetsLoaded: function(val) {
      this.assetsLoaded += val;
    }
  };
})();



/**
 * Handle loading screen and dispatch 'ready' event when loading is done.
 * @param  {number} inc Number of new files finished loading.
 */
function updateLoadedAssets(inc) {
  game.assetsLoaded += inc;
  var percentage = game.assetsLoaded / game.assetCount * (100 - 2);
  document.getElementById('loader-bar')
    .style.width = percentage.toString() + '%';
  if (game.assetCount == game.assetsLoaded) {
    var ready = new Event('ready');
    document.dispatchEvent(ready);
  }
}


///////////
/// Game //
///////////


var game = new Game();

document.addEventListener('ready', function(event) {
  document.getElementById('menu-text').innerHTML = 'Start';
  document.getElementById('menu').className = '';
  document.getElementById('menu').onclick = function() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    gameLoop();
  };
});


game.getNotes();
game.getColors();

function gameLoop() {
  game.soundManager.update();
  game.visualManager.update();

  window.requestAnimationFrame(gameLoop);
}


