if (!SGE.classes) SGE.classes = {};
if(!window.plPrerender) window.plPrerender = {};

SGE.classes.Player = function() {
  var width = 100;
  var height = 100;
  var pos = {
    x: canvas.width/2 - width/2,
    y: canvas.height/2 - height/2
  };
  var range = 200;
  var nukeRange = 60;
  var nukeCost = 50;
  var points = 0;

  var mana = 100;
  var manaMax = 100;
  var manaRec = 1;
  
  var hp = 100;
  var hpMax = 100;
  var hpRec = 0;

  var pointsMod = 1;

  var tileS = 64;
  var animations = {
    idle: [0],
    attack: [1],
  }


  var tile = 0;
  var attacking = 0;
  var pointsEarned;
  function _attack(x, y, hitzone) {
    attacking = 4;

    var path = SGE.utils.getline(x, y);

    var el;
    for (var i = 0; i < hitzone.length; i++) {
      el = hitzone[i];

      if (path == 'center' || el.line == path) {
        el.dead();

        if (mana + manaRec < manaMax) {
          mana += manaRec;
          SGE.ui.poptag('+' + manaRec, 'mana', el.pos.x, el.pos.y);
        }

        if (hp + hpRec < hpMax) {
          hp += hpRec;
          SGE.ui.poptag('+' + hpRec, 'hp', el.pos.x, el.pos.y);
        }

        pointsEarned = 10 * pointsMod;
        points += pointsEarned;
        SGE.ui.poptag('+' + pointsEarned, 'gold', el.pos.x, el.pos.y);
      }
    }
  }

  var animation;
  var frame;
  function _update() {
    if (attacking > 0) {
      attacking--;
      animation = 'attack';
      frame = 0;
    } else {
      animation = 'idle';
      frame = 0;
    }
    if (!window.plPrerender[animation]) window.plPrerender[animation] = {};
  }

  var c;
  var cx;
  function _render(media) {
    if (window.plPrerender[animation][frame]) return window.plPrerender[animation][frame];

    c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    cx = c.getContext('2d');

    c.clearRect(0, 0, width, height);
    cx.drawImage(media.hero, animation[frame] * tileS, 0, tileS, tileS, 0, 0, width, height);

    window.plPrerender[animation][frame] = c;
    return c;
  }

  this.width = width;
  this.height = height;
  this.pos = pos;
  this.range = range;
  this.points = points;

  this.mana = mana;
  this.manaMax = manaMax;
  this.hp = hp;
  this.hpMax = hpMax;

  this.render = _render;
  this.update = _update;
  this.attack = _attack;
}

