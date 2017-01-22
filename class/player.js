if (!SGE.classes) SGE.classes = {};
if(!window.plPrerender) window.plPrerender = {};

SGE.classes.Player = function() {
  this.width = 100;
  this.height = 100;
  var pos = {x: canvas.width/2 - 50, y: canvas.height/2 - 50};
  this.pos = pos;
  var range = 200;
  this.range = range;
  this.points = 0;

  var mana = 100;
  var manaMax = 100;
  this.mana = mana;
  this.manaMax = manaMax;
  
  var hp = 100;
  var hpMax = 100;
  this.hp = hp;
  this.hpMax = hpMax;

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

  // function ray(x, y) {
  //   var angle = Math.atan2(canvas.width/2 + 50 - y, canvas.height/2 + 50 - x);
  //   var time = 20;
  //   this.angle = angle;
  //   this.time = time;
  // }
  //
  var attacking = 0;
  // var _attStack = [];
  function _attack(x, y, hitzone) {
    attacking = 4;
    // _attStack.push(new ray(x, y));
    var aim = Math.atan2(this.pos.y - y, this.pos.x - x);
    var deg = aim * (180/Math.PI) + 180;

    var path = (function() {
      if (x > pos.x - 50 && x < pos.x + 50 &&
          y > pos.y - 50 && y < pos.y + 50) {
        if (mana >= 50) {
          mana -= 50;
          this.mana = mana;
          return "nuke";
        }
      };
      if (deg > 250 && deg < 290) return 0;
      if (deg > 295 && deg < 335) return 1;
      if (deg > 340 || deg < 20) return 2;
      if (deg > 25 && deg < 65) return 3;
      if (deg > 70 && deg < 110) return 4;
      if (deg > 115 && deg < 155) return 5;
      if (deg > 160 && deg < 200) return 6;
      if (deg > 205 && deg < 245) return 7;
    })();

    var el;
    var ela;
    for (var i = 0; i < hitzone.length; i++) {
      el = hitzone[i];
      if (path == "nuke" || el.line == path) {
        el.dead();
        if (mana < manaMax) {
          mana++;
          SGE.ui.poptag("+1", "exp", el.pos.x, el.pos.y);
        }
        this.mana = mana;
        this.points += 10;
        SGE.ui.poptag("+10", "gold", el.pos.x, el.pos.y);

        if (path != "nuke") return;
      }
    }
  }

  // var cd = document.createElement('canvas');
  // cd.width = canvas.width;
  // cd.heigth = canvas.heigth;
  // var cxd = cd.getContext('2d');
  //
  // function digestAttacks(media) {
  //   var a;
  //   cxd.clearRect(0, 0, cd.width, cd.height);
  //   for (var i = 0; i < _attStack.length; i++) {
  //     a = _attStack[i];
  //     a.time--;
  //     if (a.time <= 0) _attStack.splice(i, 1);
  //
  //     cxd.rotate(a.angle);
  //     cxd.drawImage(media.ray, -32, -50);
  //
  //   }
  //   ctx.drawImage(cd, 0, 0);
  // }
  // this.digestAttacks = digestAttacks;

  var frame = 0;
  function _update() {
    if (attacking > 0) {
      attacking--;
      frame = 1;
    } else {
      frame = 0;
    }
  }

  function _render(media) {
    // if (window.plPrerender[tile]) return window.plPrerender[tile];

    var c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    var cx = c.getContext('2d');

    // cx.fillRect(0,0,20,20);
    cx.drawImage(media.hero, frame * 64, 0, 64, 64, 0, 0, 100, 100);
    // cx.drawImage(media.player, 0, 0);

    window.plPrerender[tile] = c;
    return c;
  }

  this.render = _render;
  this.update = _update;
  this.attack = _attack;
}

