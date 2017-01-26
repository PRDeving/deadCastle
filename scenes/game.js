function SceneConstructor(App) {
  App.$loading.fadeOut(300);
  $('#game').show();

  var start;
  App.game.game = new SGE.classes.Game(1);
  App.game.player = new SGE.classes.Player();
  var bg = App.game.game.renderBG(App.media);

  var enemies = [];
  function spawn() {
    var al = App.game.game.level > 4 ? 8 : (App.game.game.level > 1 ? 4 : 2);
    var els = Math.floor(Math.random() * al) + 1;

    var path;
    var mobLvl;
    for (var i = 0; i < els; i++) {

      mobLvl = Math.floor((Math.random() * Object.keys(App.game.enemies).length) - Object.keys(App.game.enemies).length + App.game.game.level - 3);
      mobLvl = mobLvl < 0 ? 0 : (mobLvl >= Object.keys(App.game.enemies).length ? Object.keys(App.game.enemies).length - 1 : mobLvl);

      switch (al) {
        case 8:
          path = Math.floor(Math.random() * 8);
          enemies.push(new SGE.classes.Enemy(path, App.game.enemies[mobLvl]));
          break;
        case 4:
          path = Math.floor(Math.random() * 4) * 2;
          enemies.push(new SGE.classes.Enemy(path, App.game.enemies[mobLvl]));
          break;
        case 2:
          path = Math.floor(Math.random() * 2) * 4;
          enemies.push(new SGE.classes.Enemy(path, App.game.enemies[mobLvl]));
          break;
      }
    }
  }

  var llevel = App.game.game.level;
  var lpoints = App.game.player.points;
  var lhp = App.game.player.hp;
  var lmana = App.game.player.mana;
  var hitzone = [];

  var tpoints = 0;

  SGE.GameLoop.Suscribe(function() {
    hitzone.length = 0;

    if (lpoints != App.game.player.points) {
      tpoints += +App.game.player.points - lpoints;
      lpoints = +App.game.player.points;
      App.$points.html(App.game.player.points);

      if (tpoints > (1000 * App.game.game.level) * 1.2) {
        App.game.game.levelUp();
        SGE.ui.poptag('Level Up', 'level');
      }
    }
    if (App.game.game.level != llevel) {
      llevel++;
      bg = App.game.game.renderBG(App.media);
      App.$level.html(App.game.game.level);
    }
    if (lhp != App.game.player.hp) {
      lhp = +App.game.player.hp;
      App.$hp.html(App.game.player.hp);
    }
    if (lmana != App.game.player.mana) {
      lmana = +App.game.player.mana;
      App.$mana.html(App.game.player.mana);
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
      if (distance <= Math.sqrt(Math.abs(Math.pow(App.game.player.range, 2) + Math.pow(App.game.player.range, 2)))) {
        hitzone.push(e);
      }

      if (distance < Math.sqrt(Math.abs(Math.pow(40, 2) + Math.pow(40, 2)))) {
        hitcount--;
        if (hitcount < 0) {
          hitcount = App.game.player.strength;

          // handle
          App.game.player.hit(e.force);
        }
      } else {
        App.ctx.drawImage(e.render(App.media), e.pos.x - e.width/2, e.pos.y - e.height/2);
      }
    }

    App.game.player.update();
    App.ctx.drawImage(App.game.player.render(App.media), App.game.player.pos.x, App.game.player.pos.y);
    SGE.ui.digestPoptag();

    if (App.game.player.dead) {
      SGE.GameLoop.Stop();

      SGE.ui.modal.Open(App.$keepPlaying, {
        '.yes': function() {
          SGE.ui.modal.Close(App.$keepPlaying);
          App.game.player.reset();
          App.$hp.html(App.game.player.hp);
          App.$mana.html(App.game.player.mana);
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
    counticks += App.game.game.level;
    if (counticks > 60 * App.game.game.level) {
      counticks = 0;
      spawn();
    }
  });

  $(canvas).on('click', keyboardHandler);
  function keyboardHandler(ev) {
    App.game.player.attack(ev.pageX, ev.pageY, hitzone);
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
    App.market.fill();
    SGE.ui.modal.Open($inventary, {
      '.close': function() {
        if (mode == 'inv') {
          SGE.ui.modal.Close($inventary, function() {
            $inv.find('.close').off();
            SGE.GameLoop.Run(60);
            App.game.player.setBonus(App.inventary.getBonus());
          });
        } else {
          closeMarket();
        }
      },
      '#market-button': function() {
        openMarket();
      }
    }, function() {
      $inventary.find('#coins').html(App.game.player.points);
    });
  });

  App.ctx.drawImage(bg, 0, 0);
  App.ctx.drawImage(App.game.player.render(App.media), App.game.player.pos.x, App.game.player.pos.y);

  App.$points.html(App.game.player.points);
  App.$level.html(App.game.game.level);
  App.$hp.html(App.game.player.hp);
  App.$mana.html(App.game.player.mana);

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
