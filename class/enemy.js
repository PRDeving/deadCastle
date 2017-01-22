if (!SGE.classes) SGE.classes = {};
if(!window.enPrerender) window.enPrerender = {};

SGE.classes.Enemy = function(line) {
  this.width = 40;
  this.height = 40;
  this.rip = false;

  this.line = line;
  var lines = [
    [canvas.width/2, -50],
    [canvas.width + 50, -50],
    [canvas.width + 50, canvas.height/2],
    [canvas.width + 50, canvas.height + 70],
    [canvas.width/2, canvas.height + 50],
    [-50, canvas.height + 50],
    [-50, canvas.height/2],
    [-50, -70],
  ];
  this.pos = {x: lines[line][0] - 20, y: lines[line][1] - 20};
  this.speed = 1;

  if (!window.enPrerender[line]) window.enPrerender[line] = {};

  var tile = 0;
  var center = [canvas.width/2 - 20, canvas.height/2 - 20];

  function _dead() {
    this.speed = 0;
    this.rip = true;
  }

  function _isDead() {
    return this.rip;
  }


  var counts = 0;
  function _update() {
    var face = Math.atan2(center[1] - this.pos.y, center[0] - this.pos.x);
    this.pos.x += this.speed * Math.cos(face);
    this.pos.y += this.speed * Math.sin(face);
    counts++;
    if (counts >= 15) {
      counts = 0;
      tile = (tile + 1) == 2 ? 0 : 1;
    }
  }

  var med = (line > 2 && line < 6) ? '2' : '';
  function _render(media) {
    if (window.enPrerender[line][tile]) return window.enPrerender[line][tile];

    var c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    var cx = c.getContext('2d');

    // cx.fillRect(0,0,20,20);
    // cx.drawImage(media.enemy, 0, 0, 20, 20, tile * 32, 0, 32, 32);
    cx.drawImage(media['enemy' + med], tile * 32, 0, 32, 32, 0, 0, 40, 40);

    window.enPrerender[line][tile] = c;
    return c;
  }

  this.render = _render;
  this.update = _update;
  this.dead = _dead;
  this.isDead = _isDead;
}
