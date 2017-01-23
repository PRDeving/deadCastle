function SceneConstructor(App) {
  App.$loading.fadeOut(300);
  $('#game').show();

  var game = new SGE.classes.Game(1);
  var pl = new SGE.classes.Player();
  var bg = game.renderBG(App.media);

  App.game = game;
  App.player = pl;


  var enemies = [];
  function spawn() {
    var al = game.level > 4 ? 8 : (game.level > 1 ? 4 : 2);
    var els = Math.floor(Math.random() * al) + 1;

    var path;
    for (var i = 0; i < els; i++) {
      switch (al) {
        case 8:
          path = Math.floor(Math.random() * 8);
          enemies.push(new SGE.classes.Enemy(path));
          break;
        case 4:
          path = parseInt((Math.floor(Math.random() * 4) * 2 - 1) || 0);
          enemies.push(new SGE.classes.Enemy(path));
          break;
        case 2:
          path = Math.floor(Math.random() * 2) * 4;
          enemies.push(new SGE.classes.Enemy(path));
          break;
      }
    }
  }

  var llevel = game.level;
  var lpoints = pl.points;
  var lhp = pl.hp;
  var lmana = pl.mana;
  var hitzone = [];

  SGE.GameLoop.Suscribe(function() {
    hitzone.length = 0;

    if (lpoints != pl.points) {
      lpoints = pl.points;
      App.$points.html(pl.points);
    }
    if (game.level != llevel) {
      llevel++;
      bg = game.renderBG(App.media);
    }
    if (lhp != pl.hp) {
      lhp = pl.hp;
      App.$hp.html(pl.hp);
    }
    if (lmana != pl.mana) {
      lmana = pl.mana;
      App.$mana.html(pl.mana);
    }
  }, true);

  SGE.GameLoop.Suscribe(function() {
    App.ctx.drawImage(bg, 0, 0);
  });

  var hitcount = 100;
  var distance;
  SGE.GameLoop.Suscribe(function() {
    var e;
    for (var i  = 0; i < enemies.length; i++) {
      e = enemies[i];
      if (e.isDead()) {
        enemies.splice(i, 1);
        continue;
      }

      distance = Math.sqrt(Math.abs(Math.pow(e.pos.x - canvas.width/2, 2) + Math.pow(e.pos.y - canvas.height/2, 2)));
      if (distance <= Math.sqrt(Math.abs(Math.pow(pl.range, 2) + Math.pow(pl.range, 2)))) {
        hitzone.push(e);
      }

      if (distance < Math.sqrt(Math.abs(Math.pow(40, 2) + Math.pow(40, 2)))) {
        hitcount--;
        if (hitcount < 0) {
          hitcount = pl.strength;

          // handle
          pl.hp--;
          SGE.ui.poptag('-1', 'hp', pl.pos.x, pl.pos.y);
        }
      } else {
        e.update();
        App.ctx.drawImage(e.render(App.media), e.pos.x - e.width/2, e.pos.y - e.height/2);
      }
    }

    pl.update();
    App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);
    SGE.ui.digestPoptag();

    if (pl.hp <= 0) SGE.Scene.Load('dead', App);
  });

  var counticks = 0;
  SGE.GameLoop.Suscribe(function() {
    counticks += game.level;
    if (counticks > 60 * game.level) {
      counticks = 0;
      spawn();
    }
  });

  $(canvas).on('click', keyboardHandler);
  function keyboardHandler(ev) {
    pl.attack(ev.pageX, ev.pageY, hitzone);
  }

  App.ctx.drawImage(bg, 0, 0);
  App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);

  App.$points.html(pl.points);
  App.$hp.html(pl.hp);
  App.$mana.html(pl.mana);

  SGE.utils.countdown(3, function() {
    SGE.GameLoop.Run(60);
  });
}

function SceneDestructor(App) {
  $(App.canvas).off();
  $('#game').hide();
}
