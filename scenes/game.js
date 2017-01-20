function SceneConstructor(App) {
  console.log('game');
  App.$loading.fadeOut(300);
  $(App.canvas).show();

  var game = new SGE.classes.Game();
  var bg = game.renderBG(App.media);

  var text = new SGE.ui.text();

  var enemies = [];
  enemies.push(new SGE.classes.Enemy(0));
  enemies.push(new SGE.classes.Enemy(1));
  enemies.push(new SGE.classes.Enemy(2));
  enemies.push(new SGE.classes.Enemy(3));
  enemies.push(new SGE.classes.Enemy(4));
  enemies.push(new SGE.classes.Enemy(5));
  enemies.push(new SGE.classes.Enemy(6));
  enemies.push(new SGE.classes.Enemy(7));

  function spawn() {
    var al = game.level > 4 ? 8 : (game.level > 1 ? 4 : 2);
    var els = Math.floor(Math.random() * al) + 1;

    for (var i = 0; i < els; i++) {
      switch (al) {
        case 8:
          enemies.push(new SGE.classes.Enemy(Math.floor(Math.random() * 8)));
          break;
        case 4:
          enemies.push(new SGE.classes.Enemy(parseInt(Math.floor(Math.random() * 4) * 2 - 1 || 0)));
          break;
        case 2:
          enemies.push(new SGE.classes.Enemy(Math.floor(Math.random()) * 4));
          break;
      }
    }
  }

  var pl = new SGE.classes.Player();
  var points = text.render(pl.points || '0');

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
  var hitzone = [];

  SGE.GameLoop.Suscribe(function() {
    hitzone.length = 0;
    if (game.level > llevel) {
      llevel++;
      bg = game.renderBG(App.media);
    }
  }, true);

  SGE.GameLoop.Suscribe(function() {
    App.ctx.drawImage(bg, 0, 0);
    App.ctx.drawImage(points, 0, 0);
  });

  SGE.GameLoop.Suscribe(function() {
    var e;
    for (var i  = 0; i < enemies.length; i++) {
      e = enemies[i];
      if (e.isDead()) enemies.splice(i, 1);
      e.update();
      App.ctx.drawImage(e.render(App.media), e.pos.x, e.pos.y);

      if (e.pos.x > pl.pos.x - pl.range && e.pos.x < pl.pos.x + pl.range &&
        e.pos.y > pl.pos.y - pl.range && e.pos.y < pl.pos.y + pl.range) {
          hitzone.push(e);
        }
    }

    pl.update();
    App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);
  });

  var counticks = 0;
  SGE.GameLoop.Suscribe(function() {
    counticks += game.level;
    if (counticks > 2000) {
      counticks = 0;
      spawn();
    }
  });

  $(canvas).on('click', keyboardHandler);
  function keyboardHandler(ev) {
    pl.attack(ev.pageX, ev.pageY, hitzone);
  }

  App.ctx.drawImage(bg, 0, 0);
  App.ctx.drawImage(points, 0, 0);
  App.ctx.drawImage(pl.render(App.media), pl.pos.x, pl.pos.y);

  countdown(5, function() {
    SGE.GameLoop.Run(60);
  });

}

function SceneDestructor(App) {
  $(App.canvas).off().hide();
}
