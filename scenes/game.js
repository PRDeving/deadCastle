function SceneConstructor(App) {
  console.log('game');
  App.$loading.fadeOut(300);
  $('#game').show();

  var game = new SGE.classes.Game(1);
  var bg = game.renderBG(App.media);

  var text = new SGE.ui.text(40);

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
          enemies.push(new SGE.classes.Enemy(parseInt(Math.floor(Math.random() * 4) * 2 - 1 || 0)));
          break;
        case 2:
          path = Math.floor(Math.random() * 2) * 4;
          enemies.push(new SGE.classes.Enemy(path));
          break;
      }
    }
  }

  var pl = new SGE.classes.Player();

  function countdown(s, cb) {
    function loop() {
      App.$countdown.fadeOut(100);
      if (s >= 0) wait();
      else cb();
    }

    function wait() {
      App.$countdown.html(s).fadeIn(100);
      s--;
      setTimeout(loop, 1000);
    }
    wait();
  }

  var llevel = 0;
  var lpoints = 0;
  var lhp = pl.hp;
  var lmana = pl.mana;
  var hitzone = [];

  SGE.GameLoop.Suscribe(function() {
    hitzone.length = 0;
    if (lpoints != pl.points) {
      lpoints = pl.points;
      App.$points.html(pl.points);
    }
    if (lhp != pl.hp) {
      lhp = pl.hp;
      // App.$hp.css('width', ((pl.hp / pl.hpMax) * 100) + '%');
      App.$hp.html(pl.hp);
    }
    if (lmana != pl.mana) {
      lmana = pl.mana;
      // App.$mana.css('width', ((pl.mana / pl.manaMax) * 100) + '%');
      App.$mana.html(pl.mana);
    }

    if (game.level != llevel) {
      llevel++;
      bg = game.renderBG(App.media);
    }
  }, true);

  SGE.GameLoop.Suscribe(function() {
    App.ctx.drawImage(bg, 0, 0);
  });

  var hitcount = 100;
  SGE.GameLoop.Suscribe(function() {
    var e;
    for (var i  = 0; i < enemies.length; i++) {
      e = enemies[i];
      if (e.rip) {
        enemies.splice(i, 1);
        continue;
      }

      if (e.pos.x > pl.pos.x - pl.range && e.pos.x < pl.pos.x + pl.range &&
        e.pos.y > pl.pos.y - pl.range && e.pos.y < pl.pos.y + pl.range) {
        hitzone.push(e);
      }

      if (Math.sqrt((e.pos.x-pl.pos.x)*(e.pos.x-pl.pos.x) + (e.pos.y-pl.pos.y)*(e.pos.y-pl.pos.y)) < 40) {
        hitcount--;
        if (hitcount < 0) {
          hitcount = 100;
          pl.hp--;
          SGE.ui.poptag('-1', 'hp', pl.pos.x, pl.pos.y);
        }
      } else {
        e.update();
        App.ctx.drawImage(e.render(App.media), e.pos.x, e.pos.y);
      }
    }

    pl.update();
    App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);
    SGE.ui.digestPoptag();
    // pl.digestAttacks(App.media);

    if (pl.hp <= 0) SGE.Scene.Load([App, pl.points]);
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
  // App.$hp.css('width', ((pl.hp / pl.hpMax) * 100) + '%');
  // App.$mana.css('width', ((pl.mana / pl.manaMax) * 100) + '%');

  countdown(3, function() {
    SGE.GameLoop.Run(60);
  });

}

function SceneDestructor(App) {
  $(App.canvas).off();
  $('#game').hide();
}
