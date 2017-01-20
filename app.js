function Init() {
  SGE.Loader.Add([
    'ui.js',
    'class/game.js',
    'class/enemy.js',
    'class/player.js',
  ]);

  SGE.Scene.Add('menu', 'scenes/menu.js');
  SGE.Scene.Add('game', 'scenes/game.js');

  var bg = new Image();
  bg.src = "http://img15.deviantart.net/df83/i/2015/075/1/c/rock_tile_a_by_hupie-d8lzed3.png";

  var dirt = new Image();
  dirt.src = 'http://www.wurmpedia.com/images/thumb/2/2f/Dirt.png/180px-Dirt.png';

  var enemy = new Image();
  // enemy.src = '';

  const $window = $(window);
  SGE.CanvasManager.Init($window.width(), $window.height());
  const App = {
    $window: $window,
    $loading: $('#loading'),
    $countdown: $('#countdown'),
    media: {
      bg: bg,
      dirt: dirt,
    },
    canvas: window.canvas,
    ctx: window.ctx,
  }

  return App;
}

function Main(App) {
  SGE.Scene.Load('menu', App);
}
