SGE.NewModule('utils', {
  getline: function(x, y) {
    if (x < canvas.width/3 && y < canvas.height/3) return 7;
    if (x < canvas.width/3 && y < (canvas.height/3) * 2) return 6;
    if (x < canvas.width/3) return 5;
    if (x < (canvas.width/3) * 2 && y < canvas.height/3) return 0;
    if (x < (canvas.width/3) * 2 && y < (canvas.height/3) * 2) return 'center';
    if (x < (canvas.width/3) * 2) return 4;
    if (y < canvas.height/3) return 1;
    if (y < (canvas.height/3) * 2) return 2;
    return 3;
  },

  getSpawn: function(l) {
    switch (l) {
      case 0:
        return {
          x: canvas.width/2,
          y: -50,
        }
        break;
      case 1:
        return {
          x: canvas.width + 50,
          y: -50,
        }
        break;
      case 2:
        return {
          x: canvas.width + 50,
          y: canvas.height/2,
        }
        break;
      case 3:
        return {
          x: canvas.width + 50,
          y: canvas.height + 50,
        }
        break;
      case 4:
        return {
          x: canvas.width/2,
          y: canvas.height + 50,
        }
        break;
      case 5:
        return {
          x: -50,
          y: canvas.height + 50,
        }
        break;
      case 6:
        return {
          x: -50,
          y: canvas.height/2,
        }
        break;
      case 7:
        return {
          x: -50,
          y: -50,
        }
        break;
    }
  },

  countdown: function (s, cb) {
    function loop() {
      $('#countdown').fadeOut(100);
      if (s >= 0) wait();
      else cb();
    }

    function wait() {
      $('#countdown').html(s).fadeIn(100);
      s--;
      setTimeout(loop, 1000);
    }
    wait();
  },

});
