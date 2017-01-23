function Init() {
  SGE.Loader.Add([
    'ui.js',
    'utils.js',
    'class/game.js',
    'class/enemy.js',
    'class/player.js',
  ]);

  SGE.Scene.Add('menu', 'scenes/menu.js');
  SGE.Scene.Add('game', 'scenes/game.js');
  SGE.Scene.Add('dead', function() {
    console.log(arguments);
  });

  const $window = $(window);
  SGE.CanvasManager.Init("gameCanvas", $window.width(), $window.height());

  const App = {
    $window: $window,
    $loading: $('#loading'),
    $points: $('#points'),
    $level: $('#level'),
    $hp: $('#hp'),
    $mana: $('#mana'),
    $keepPlaying: $('#keepPlaying'),

    canvas: window.canvas,
    ctx: window.ctx,
  }

  var d = Date.now();
  SGE.Images.Preload({
    bg: "http://img15.deviantart.net/df83/i/2015/075/1/c/rock_tile_a_by_hupie-d8lzed3.png",
    dirt: 'http://www.wurmpedia.com/images/thumb/2/2f/Dirt.png/180px-Dirt.png',
    hero: "/img/hero.png",
    enemy: "/img/enemy.png",
    enemy2: "/img/enemy2.png",
    ray: "/img/ray.png",
  }, function(media) {
    App.media = media;
    console.log('Media loaded in', Date.now() - d, 'ms');
  });

  return App;
}

function Main(App) {
  SGE.Scene.Load('menu', App);
}
