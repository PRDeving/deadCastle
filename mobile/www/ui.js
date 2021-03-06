SGE.NewModule('ui', new function() {
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
    // cx.font = (size || 50) + ' VT323';
    cx.font = "bold " + (size || 30) + "pt VT323";
    var s = width;
    this.s = s;

    function _render(msg, color, stroke) {
      cx.clearRect(0, 0, width, height);
      s = cx.measureText(msg);
      this.s = s;
      cx.fillStyle = color || "white";
      if (stroke) {
        cx.strokeStyle = "black";
        cx.strokeText(msg, (width/ 2) - (s.width/2), (height/2) + 4);
      }
      cx.fillText(msg, (width/ 2) - (s.width/2), (height/2) + 4);
      return c;
    }

    this.render = _render;
    this.width = width;
    this.height = height;
  }

  _poptagStack = [];
  _cachedPT = {};
  _poptag = function(msg, cls, x ,y) {
    setTimeout(function() {
      _poptagStack.push(new _cpoptag(msg, cls, x, y));
    }, Math.floor(Math.random() * 250));
  }

  _cpoptag = function(msg, cls, x, y) {
    var width = canvas.width;
    var height = 100;
    this.top = 0;
    var c = document.createElement('canvas')
    c.width = width;
    c.height = height;
    var cx = c.getContext('2d');
    var msg = msg;
    this.off = cx.measureText(msg);
    var speed = Math.floor(Math.random() * 3);

    this.x = (x ? (x - width / 2) : 0) + (Math.floor(Math.random() * 30) - 15);
    this.y = y ? y : (canvas.height / 2 - 30);
    this.alpha = 1.02;
    //
    // cx.fillStyle = "white";
    // cx.strokeStyle = "black";

    switch (cls) {
      case "mana":
        cx.fillStyle = "#015dd0";
        cx.strokeStyle = "black";
        break;
      case "gold":
        cx.fillStyle = "#eab419";
        cx.strokeStyle = "black";
        break;
      case "level":
        cx.fillStyle = "#f19e34";
        cx.strokeStyle = "black";
        break;
      case "hp":
        cx.fillStyle = "#e43636";
        cx.strokeStyle = "black";
        break;
      case "hit":
        cx.fillStyle = "#b3055d";
        cx.strokeStyle = "black";
        break;
    }

    function _update() {
      this.top += speed;
      if (this.top > 200) this.end = true;
    }

    function _render() {
      if (_cachedPT[msg + cls]) return _cachedPT[msg + cls];

      cx.clearRect(0, 0, width, height);
      cx.font = "20pt VT323";
      this.off = cx.measureText(msg);
      cx.fillText(msg, width/2 -this.off.width/2, height/2);
      cx.strokeText(msg, width/2 -this.off.width/2, height/2);

      if (!_cachedPT[msg + cls]) _cachedPT[msg + cls] = c;
      return c;
    }

    this.frame = _render();
    this.width = width;
    this.height = height;
    this.update = _update;
  }

  _digestPoptag = function() {
    var pt;
    for (var i = 0; i < _poptagStack.length; i++) {
      pt = _poptagStack[i];
      pt.update();
      // ctx.drawImage(pt.render(), 0, canvas.height/2 - 30 - pt.top);
      ctx.save();
      ctx.globalAlpha = pt.alpha -= .02;
      ctx.drawImage(pt.frame, pt.x, pt.y - pt.top);
      ctx.restore();
      if (pt.end || pt.alpha < 0) _poptagStack.splice(i, 1);
    }
  }

  _modal = {
    Open: function(sel, buttons, cb) {
      if (typeof sel == 'string') sel = $(sel);
      sel.fadeIn(200);
      setTimeout(function() { 
        sel.addClass('active');
        if (cb) cb();
      }, 300);

      for (var b in buttons) sel.find(b).on('click', buttons[b]);
    },
    Close: function(sel, cb) {
      if (typeof sel == 'string') sel = $(sel);
      sel.find('.button').off();
      sel.removeClass('active').fadeOut(300);
      if (cb) cb();
    }
  }

  this.button = _button;
  this.text = _text;
  this.poptag = _poptag;
  this.digestPoptag = _digestPoptag;
  this.modal = _modal;
});
