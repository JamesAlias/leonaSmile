/**
 * SoundManager class
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
 * Update function for game loop.
 */
SoundManager.prototype.update = function() {
  //todo
};
