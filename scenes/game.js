function SceneConstructor(App) {
  App.$loading.fadeOut(300);
  $('#game').show();

  var start;
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
          path = Math.floor(Math.random() * 4) * 2;
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

  var tpoints = 0;

  SGE.GameLoop.Suscribe(function() {
    hitzone.length = 0;

    if (lpoints != pl.points) {
      tpoints += +pl.points - lpoints;
      lpoints = +pl.points;
      App.$points.html(pl.points);

      if (tpoints > (1000 * game.level) * 1.2) {
        game.levelUp();
        SGE.ui.poptag('Level Up', 'level');
      }
    }
    if (game.level != llevel) {
      llevel++;
      bg = game.renderBG(App.media);
      App.$level.html(game.level);
    }
    if (lhp != pl.hp) {
      lhp = +pl.hp;
      App.$hp.html(pl.hp);
    }
    if (lmana != pl.mana) {
      lmana = +pl.mana;
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

      e.update();
      distance = Math.sqrt(Math.abs(Math.pow(e.pos.x - canvas.width/2, 2) + Math.pow(e.pos.y - canvas.height/2, 2)));
      if (distance <= Math.sqrt(Math.abs(Math.pow(pl.range, 2) + Math.pow(pl.range, 2)))) {
        hitzone.push(e);
      }

      if (distance < Math.sqrt(Math.abs(Math.pow(40, 2) + Math.pow(40, 2)))) {
        hitcount--;
        if (hitcount < 0) {
          hitcount = pl.strength;

          // handle
          pl.hit(1);
        }
      } else {
        App.ctx.drawImage(e.render(App.media), e.pos.x - e.width/2, e.pos.y - e.height/2);
      }
    }

    pl.update();
    App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);
    SGE.ui.digestPoptag();

    if (pl.dead) {
      SGE.GameLoop.Stop();

      SGE.ui.modal.Open(App.$keepPlaying, {
        '.yes': function() {
          SGE.ui.modal.Close(App.$keepPlaying);
          pl.reset();
          App.$hp.html(pl.hp);
          App.$mana.html(pl.mana);
          SGE.utils.countdown(3, function() {
            SGE.GameLoop.Run(60);
          });
        },
        '.no': function() {
          SGE.ui.modal.Close(App.$keepPlaying);
          SGE.Scene.Load('dead', App, tpoints, Date.now() - start);
        }
      });
    }
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

  var mode = 'inv';
  var $inventary = $('#inventary');
  var $mk = $inventary.find('#market');
  var $inv = $inventary.find('#inv');
  function closeMarket() {
    $mk.hide();
    mode = 'inv';
  }
  function openMarket() {
    $mk.show();
    mode = 'mkt';
  }
  $('#pointsContainer').on('click', function() {
    SGE.GameLoop.Stop();
    App.inventary.fill();
    SGE.ui.modal.Open($inventary, {
      '.close': function() {
        if (mode == 'inv') {
          SGE.ui.modal.Close($inventary, function() {
            $inv.find('.close').off();
            SGE.GameLoop.Run(60);
            pl.setBonus(App.inventary.getBonus());
          });
        } else {
          closeMarket();
        }
      },
      '#market-button': function() {
        openMarket();
      },
      '#market #items .item': function(ev) {
        console.log('buy', ev);
      }
    }, function() {
      $inventary.find('#coins').html(pl.points);
    });
  });

  App.ctx.drawImage(bg, 0, 0);
  App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);

  App.$points.html(pl.points);
  App.$level.html(game.level);
  App.$hp.html(pl.hp);
  App.$mana.html(pl.mana);

  SGE.utils.countdown(3, function() {
    start = Date.now();
    SGE.GameLoop.Run(60);
  });
}

function SceneDestructor(App) {
  $(App.canvas).off();
  SGE.GameLoop.Stop();
  $('#pointsContainer').off();
  $('#game').hide();
}
