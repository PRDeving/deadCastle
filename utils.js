SGE.utils = {
  function _getline(x, y) {
    if (x < canvas.width/3 && y < canvas.height/3) return 7;
    if (x < canvas.width/3 && y < (canvas.height/3) * 2) return 6;
    if (x < canvas.width/3) return 5;
    if (x < (canvas.width/3) * 2 && y < canvas.height/3) return 0;
    if (x < (canvas.width/3) * 2 && y < (canvas.height/3) * 2) return 'center';
    if (x < (canvas.width/3) * 2) return 4;
    if (y < canvas.height/3) return 1;
    if (y < (canvas.height/3) * 2) return 2;
    return 3;
  }

  function _getSpawn(l) {
    switch (l) {
      case '0':
        return {
          x: canvas.width/2,
          y: -50,
        }
        break;
      case '1':
        return {
          x: canvas.width + 50,
          y: -50,
        }
        break;
      case '2':
        return {
          x: canvas.width + 50,
          y: canvas.height/2,
        }
        break;
      case '3':
        return {
          x: canvas.width + 50,
          y: canvas.height + 50,
        }
        break;
      case '4':
        return {
          x: canvas.width/2,
          y: canvas.height + 50,
        }
        break;
      case '5':
        return {
          x: -50,
          y: canvas.height + 50,
        }
        break;
      case '6':
        return {
          x: -50,
          y: canvas.height/2,
        }
        break;
      case '6':
        return {
          x: -50,
          y: -50,
        }
        break;
    }
  }

  this.getline = _getline;
  this.getSpawn = _getSpawn;
}
