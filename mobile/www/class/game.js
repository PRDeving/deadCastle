if (!SGE.classes) SGE.classes = {};

SGE.classes.Game = function(lvl) {
  var level = lvl || 0;
  var points = 0;

  function _levelUp() {
    level++;
  }

  function _renderBG(media) {
    var c = document.createElement('canvas');
    c.width = canvas.width;
    c.height = canvas.height;
    var ratio = c.height / c.width;
    cx = c.getContext('2d');

    for (var e = 0; e < 4 * ratio; e++)
      for (var i = 0; i < 4; i++) {
        cx.drawImage(media.bg, i * (c.width / 4), e * (c.width / 4), c.width / 4, c.width / 4);
      }

    cx.save();
    cx.strokeStyle = "white";
    cx.fillStyle = "white";
    cx.lineWidth = 40;
    cx.beginPath();
      cx.moveTo(c.width/2,0);
      cx.lineTo(c.width/2, c.height/2);

      cx.moveTo(c.width/2,c.height);
      cx.lineTo(c.width/2, c.height/2);

      if (this.level > 1) {
        cx.moveTo(0,c.height/2);
        cx.lineTo(c.width/2, c.height/2);

        cx.moveTo(c.width,c.height/2);
        cx.lineTo(c.width/2, c.height/2);
      }

      if (this.level > 4) {
        cx.moveTo(0,0);
        cx.lineTo(c.width/2, c.height/2);

        cx.moveTo(c.width,0);
        cx.lineTo(c.width/2, c.height/2);

        cx.moveTo(0,c.height);
        cx.lineTo(c.width/2, c.height/2);

        cx.moveTo(c.width,c.height);
        cx.lineTo(c.width/2, c.height/2);
      }

      cx.moveTo(c.width/2, c.height/2);
      cx.arc(c.width/2, c.height/2, 50, 2 * Math.PI, false);

    cx.stroke();
    cx.fill();
    cx.restore();


    var c2 = document.createElement('canvas');
    c2.width = c.width;
    c2.height = c.height;
    var cx2 = c2.getContext('2d');

    for (var e = 0; e < 4 * ratio; e++)
      for (var i = 0; i < 4; i++) {
        cx2.drawImage(media.dirt, i * (c.width / 4), e * (c.width / 4), c.width / 4, c.width / 4);
      }

    cx2.globalCompositeOperation = 'overlay';
    cx2.drawImage(c, 0, 0);

    return c2;
  }

  this.__defineGetter__('level', function() { return level; });
  this.points = points;
  this.renderBG = _renderBG;
  this.levelUp = _levelUp;
};
