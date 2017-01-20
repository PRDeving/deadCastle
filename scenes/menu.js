function SceneConstructor(App) {
  console.log('hi');
  $('#menu').show();
  App.$loading.fadeOut(300);

  // var btn = new SGE.ui.button();
  // var playBtn = btn.render("jugar");
  // ctx.drawImage(playBtn, App.canvas.width / 2 -  btn.width / 2, 80);

  $('#go').on('click', function() {
    App.$loading.fadeOut(300);
    SGE.Scene.Load('game', App);
  });

}

function SceneDestructor(App) {
  console.log('bye');
  $('#menu').hide();
  $('#go').off();
}
