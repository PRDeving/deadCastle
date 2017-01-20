SGE.ui = new function() {
  _button = function(w, h) {
    var width = w || 80;
    var height = h || 40;
    var c = document.createElement('canvas')
    c.width = width;
    c.height = height;
    var cx = c.getContext('2d');

    function _render(msg) {
      var s = cx.measureText(msg);
      cx.strokeRect(0, 0, width, height);
      cx.fillText(msg, (width/ 2) - (s.width/2), (height/2) + 4);
      return c;
    }

    this.render = _render;
    this.width = width;
    this.height = height;
  }

  _text = function(size) {
    var width = 100;
    var height = size * 1.5 || 40;
    var c = document.createElement('canvas')
    c.width = width;
    c.height = height;
    var cx = c.getContext('2d');
    cx.fontSize = size || 18;
    cx.fillStyle = "white";

    function _render(msg) {
      var s = cx.measureText(msg);
      cx.fillText(msg, (width/ 2) - (s.width/2), (height/2) + 4);
      return c;
    }

    this.render = _render;
    this.width = width;
    this.height = height;
  }

  _poptag = function(msg, cls) {
    var cls = cls || '';
    var p = $('<div>').html(msg).addClass(cls).addClass('poptag').css({
      top: canvas.height / 2,
      left: canvas.width / 2,
    }).addClass('active').css('top', 0).fadeOut(200);
    setTimeout( function() {
      p.remove();
    }, 300);
  }

  this.button = _button;
  this.text = _text;
  this.poptag = _poptag;
}
