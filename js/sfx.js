function SFX() {
  this.context = new webkitAudioContext();
  this.osc = new context.createOscillator();
  this.osc.type = osc.SQUARE;
  this.osc.frequency.value = 220;

  this.filter = context.createBiquadFilter();
  this.filter.type = filter.LOWPASS;
  this.filter.frequency.value = 220;

  this.osc.connect(filter);
  this.filter.connect(context.destination);
};

SFX.prototype.mapFilter = function(f) {
  // expecting f in [0, 1]
  this.filter.frequency.value = 220 + f * 700;
};