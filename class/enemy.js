if (!SGE.classes) SGE.classes = {};
if(!window.enPrerender) window.enPrerender = {};

SGE.classes.Enemy = function(line) {
  this.width = 20;
  this.height = 20;
  this.isDead = false;

  this.line = line;
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
  this.pos = {x: lines[line][0] - 10, y: lines[line][1] - 10};
  this.speed = 1;

  if (!window.enPrerender[line]) window.enPrerender[line] = {};

  var tile = 0;
  var center = [canvas.width/2 - 10, canvas.height/2 - 10];

  function _dead() {
    this.speed = 0;
    this.isDead = true;
  }

  function _update() {
    var face = Math.atan2(center[1] - this.pos.y, center[0] - this.pos.x);
    this.pos.x += this.speed * Math.cos(face);
    this.pos.y += this.speed * Math.sin(face);
  }

  function _render(media) {
    if (window.enPrerender[line][tile]) return window.enPrerender[line][tile];

    var c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    var cx = c.getContext('2d');

    cx.fillRect(0,0,20,20);
    // cx.drawImage(media.enemy, 0, 0);

    window.enPrerender[line][tile] = c;
    return c;
  }

  this.render = _render;
  this.update = _update;
  this.dead = _dead;
}
