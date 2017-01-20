if (!SGE.classes) SGE.classes = {};
if(!window.plPrerender) window.plPrerender = {};

SGE.classes.Player = function() {
  this.width = 20;
  this.height = 20;
  this.pos = {x: canvas.width/2 - 10, y: canvas.height/2 - 10};
  this.range = 30;
  this.points = 0;

  var lines = [
    [canvas.width/2, -30],
    [canvas.width + 30, -30],
    [canvas.width + 30, canvas.height/2],
    [canvas.width + 30, canvas.height + 30],
    [canvas.width/2, canvas.height + 30],
    [-30, canvas.height + 30],
    [-30, canvas.height/2],
    [-30, -30],
  ];

  var tile = 0;


    var face = Math.atan2
    this.pos.x += this.speed * Math.cos(face);
    this.pos.y += this.speed * Math.sin(face);


  function _attack(x, y, hitzone) {
    var aim1 = Math.atan2(this.pos.y - y - 10, this.pos.x - x - 10);
    var aim2 = Math.atan2(this.pos.y - y + 10, this.pos.x - x + 10);

    var el;
    var ela;
    for (var i = 0; i < hitzone.length; i++) {
      el = hitzone[i];
      ela = Math.atan2(this.pos.y - el.pos.y, this.pos.x - el.pos.x);
      if (ela > aim1 && ela < aim2) {
        this.points += el.dead();
        console.log("dead");
        SGE.ui.poptag('+1');
      }
    }
  }

  function _update() {
  }

  function _render(media) {
    if (window.plPrerender[tile]) return window.plPrerender[tile];

    var c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    var cx = c.getContext('2d');

    cx.fillRect(0,0,20,20);
    // cx.drawImage(media.player, 0, 0);

    window.plPrerender[tile] = c;
    return c;
  }

  this.render = _render;
  this.update = _update;
  this.attack = _attack;
}

