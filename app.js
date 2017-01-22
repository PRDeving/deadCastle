function Init() {
  SGE.Loader.Add([
    'ui.js',
    'class/game.js',
    'class/enemy.js',
    'class/player.js',
  ]);

  SGE.Scene.Add('menu', 'scenes/menu.js');
  SGE.Scene.Add('game', 'scenes/game.js');

  SGE.Scene.Add('dead', function() {
    console.log(arguments);
  });

  var bg = new Image();
  bg.src = "http://img15.deviantart.net/df83/i/2015/075/1/c/rock_tile_a_by_hupie-d8lzed3.png";

  var dirt = new Image();
  dirt.src = 'http://www.wurmpedia.com/images/thumb/2/2f/Dirt.png/180px-Dirt.png';

  var hero = new Image();
  hero.src = "/img/hero.png";

  var enemy = new Image();
  enemy.src = "/img/enemy.png";

  var enemy2 = new Image();
  enemy2.src = "/img/enemy2.png";

  var ray = new Image();
  ray.src = "/img/ray.png";

  const $window = $(window);
  SGE.CanvasManager.Init("gameCanvas", $window.width(), $window.height());
  const App = {
    $window: $window,
    $loading: $('#loading'),
    $countdown: $('#countdown'),
    $points: $('#points'),
    $hp: $('#hp'),
    $mana: $('#mana'),
    media: {
      bg: bg,
      dirt: dirt,
      hero: hero,
      enemy: enemy,
      enemy2: enemy2,
      ray: ray,
    },
    canvas: window.canvas,
    ctx: window.ctx,
  }

  return App;
}

function Main(App) {
  SGE.Scene.Load('menu', App);
}
