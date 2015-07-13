/**
 * @fileoverview The game LeonaSmile.
 * @author robert.baruck@gmail.com (Robert Baruck)
 */

/**
 * game class
 * @constructor
 */
function Game() {
  this.assetCount = 40; //TODO should be 63 but some sounds are still missing
  this.assetsLoaded = 0;
  this.colors = [];
  this.notes = [];
  this.soundManager = new SoundManager();
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
 * Sound manager class
 * @constructor
 */
function SoundManager() {
  this.context = new window.AudioContext();

  this.compressorNode = this.createCompressor(0, 20, -25);

  this.buffers = [];
}

/**
 * Creates Web Audio compressor and sets values.
 * @param  {number} attack
 * @param  {number} ratio
 * @param  {number} threshold
 * @return {Object}           The initialized compressor.
 */
SoundManager.prototype.createCompressor = function(attack, ratio, threshold) {
  var compressor = this.context.createDynamicsCompressor();

  compressor.connect(this.context.destination);
  compressor.attack.setTargetAtTime(attack, this.context.currentTime, 0);
  compressor.ratio.setTargetAtTime(ratio, this.context.currentTime, 0);
  compressor.threshold.setTargetAtTime(threshold, this.context.currentTime, 0);

  return compressor;
};

//TODO Consider using promise for decoding as well.
/**
 * Get sound file from server, decode it and store it in
 * {@link Soundmanager.buffers}.
 * @param  {string} url URL of sound file.
 */
SoundManager.prototype.getBuffer = function(url) {
  xhrGet(url, 'arraybuffer')
    .then(function(event) {
      this.context.decodeAudioData(event.target.response, function(data) {
        this.buffers.push(data);
        updateLoadedAssets(1);
      }.bind(this));
    }.bind(this))
    .catch(function(error) {
      console.log('could not retrieve', url, '!\nerr:', error);
    });
};


/**
 * Loads sound buffers and stores them in {@link SoundManager.buffers} using
 * {@link SoundManager.buffers}.
 * @param  {array} urls List of URLs of sound files.
 */
SoundManager.prototype.loadSounds = function(urls) {
  for (var i = 0; i < urls.length; i++) {
    this.getBuffer(urls[i]);
  }
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


/**
 * Handle loading screen and dispatch 'ready' event when loading is done.
 * @param  {number} inc Number of new files finished loading.
 */
function updateLoadedAssets(inc) {
  game.assetsLoaded += inc;
  var percentage = game.assetsLoaded / game.assetCount * (100 - 2);
  document.getElementById('loader-bar').style.width = percentage.toString() + '%';
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
  document.getElementById('menu').onclick = function() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('title').style.display = 'none';
    // start game
  };
});

game.getNotes();
game.getColors();
