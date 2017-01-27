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
  var manaSec = 0;
  
  var dead = false;
  var hp = 100;
  var hpMax = 100;
  var hpRec = 0;
  var hpSec = 0;

  var goldRec = 0;
  var goldSec = 0;

  var strength = 100;

  var tileS = 64;
  var animations = {
    idle: [0],
    attack: [1],
  }

  function _setBonus(b) {
    hpRec = b.hp;
    hpSec = b.hpSec;
    manaRec = b.mana;
    manaSec = b.manaSec;
    goldRec = b.gold;
    goldSec = b.goldSec;
    strength = 100 + b.strength;
  }

  function _setExtras(e) {
    hp += e.hp;
    hpSec += e.hpSec;
    hpMax += e.hpMax;
    mana += e.mana;
    manaSec += e.manaSec;
    manaMax += e.manaMax;
    strength += e.strength;

    if (hp > hpMax) hp = hpMax;
    if (mana > manaMax) mana = manaMax;
  }

  function _pay(a) {
    if (points - a >= 0) {
      points -= a;
      return true;
    }
    return false;
  }

  var tile = 0;
  var attacking = 0;
  var pointsEarned;
  function _attack(x, y, hitzone) {
    attacking = 4;

    var path = SGE.utils.getline(x, y);
    if (path == 'center' && mana >= nukeCost) {
      mana -= nukeCost;
    } else if (path == 'center'){
      path = 9;
      SGE.ui.poptag('no mana', 'exp');
    }

    var el;
    for (var i = 0; i < hitzone.length; i++) {
      var dead = false;
      el = hitzone[i];

      if (path == 'center' || el.line == path) {
        if (el.hit(1)) {
          if (manaRec > 0) {
            mana += manaRec;
            if (mana > manaMax) mana = manaMax;
            SGE.ui.poptag('+' + manaRec, 'mana', el.pos.x, el.pos.y);
          }

          if (hpRec > 0) {
            hp += hpRec;
            if (hp > hpMax) hp = hpMax;
            SGE.ui.poptag('+' + hpRec, 'hp', el.pos.x, el.pos.y);
          }

          pointsEarned = 10 + goldRec;
          points += pointsEarned;
          SGE.ui.poptag('+' + pointsEarned, 'gold', el.pos.x, el.pos.y);
        }
        if (path != 'center') return;
      }
    }
  }

  function _hit(a) {
    if (hp - a >= 0) {
      hp -= a;
      SGE.ui.poptag('-' + a, 'hp', pos.x, pos.y);
    } else {
      dead = true;
    }
  }

  function _reset() {
    hp = hpMax;
    mana = manaMax;
    dead = false;
  }

  var animation = 'idle';
  var frame = 0;
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
    if (window.plPrerender[animation] && window.plPrerender[animation][frame]) return window.plPrerender[animation][frame];

    c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    cx = c.getContext('2d');

    cx.clearRect(-1, 0, width, height);
    cx.drawImage(media.hero, animations[animation][frame] * tileS, 0, tileS, tileS, 0, 0, width, height);

    if (!window.plPrerender[animation]) window.plPrerender[animation] = {};
    window.plPrerender[animation][frame] = c;
    return c;
  }

  this.width = width;
  this.height = height;
  this.pos = pos;
  this.tileS = tileS;
  this.range = range;

  this.__defineGetter__('manaMax', function() { return manaMax; });
  this.__defineGetter__('hpMax', function() { return hpMax; });
  this.__defineGetter__('strength', function() { return strength; });
  this.__defineGetter__('points', function() { return points; });
  this.__defineGetter__('mana', function() { return mana; });
  this.__defineGetter__('hp', function() { return hp; });
  this.__defineGetter__('dead', function() { return dead; });

  this.render = _render;
  this.update = _update;
  this.attack = _attack;
  this.hit = _hit;
  this.reset = _reset;
  this.setBonus = _setBonus;
  this.setExtras = _setExtras;
  this.pay = _pay;
}

