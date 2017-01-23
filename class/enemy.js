if (!SGE.classes) SGE.classes = {};
if(!window.enPrerender) window.enPrerender = {};

SGE.classes.Enemy = function(line) {
  var width = 40;
  var height = 40;
  var pos = SGE.utils.getSpawn(line);
  var rip = false;
  var speed = 1;

  var line = line;
  var center = [canvas.width/2, canvas.height/2];
  var face = Math.atan2(center[1] - pos.y, center[0] - pos.x);
  if (!window.enPrerender[line]) window.enPrerender[line] = {};

  var sprite = (line > 2 && line < 6) ? 'enemy2' : 'enemy';
  var spriteS = 32;
  var fps = 15;
  var tile = 0;
  var animations = {
    walk: [0, 1],
    dead: [],
    attack: [],
  }
  var animation = 'walk';


  function _dead() {
    speed = 0;
    rip = true;
  }

  function _isDead() {
    return rip;
  }

  var counts = 0;
  function _update() {
    if (Math.sqrt(Math.pow(pos.x - center[0], 2) + Math.pow(pos.y - center[1], 2)) < Math.sqrt(Math.pow(30, 2) + Math.pow(30, 2))) {
      // under
      // animation = 'attack';
    } else {
      pos.x += speed * Math.cos(face);
      pos.y += speed * Math.sin(face);
      animation = 'walk';
    }

    if (counts++ >= fps) {
      counts = 0;
      tile++;
      if (tile >= animations[animation].length) tile = 0;
    }
  }

  var c;
  var cx;
  function _render(media) {
    if (!window.enPrerender[line][animation]) window.enPrerender[line][animation] = {};
    if (window.enPrerender[line][animation][tile]) return window.enPrerender[line][animation][tile];

    c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    cx = c.getContext('2d');

    cx.drawImage(media[sprite], tile * spriteS, 0, spriteS, spriteS, 0, 0, width, height);
    window.enPrerender[line][animation][tile] = c;

    return c;
  }

  this.render = _render;
  this.update = _update;
  this.dead = _dead;
  this.isDead = _isDead;

  this.width = width;
  this.height = height;
  this.pos = pos;
  this.rip = rip;

  this.__defineGetter__('line', function() { return line; });
  this.speed = speed;

}
