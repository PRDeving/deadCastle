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

  this.getline = _getline;
}
