function Inventory() {
  var equip = [false, false];
  var items = [];
  var itemsList;
  var $list = $('#inventary #inv #items');
  var $equipement = $('#inventary #equipement');

  function _add(e) {
    items.push(itemsList[e]);
  }

  function _equip(e) {
    var idx = typeof e == 'number' ? e : $(e.target).attr('data-id');
    var it = itemsList[idx];

    for (var i in items) {
      if (items[i].id == idx) {
        if (equip[it.block]) _unequip(it.block);
        equip[it.block] = items[i];
        items.splice(i, 1);
        _fill();
        return;
      }
    }
  }

  function _unequip(b) {
    var bl = typeof b == 'number' ? itemsList[b].block : itemsList[$(b.target).attr('data-id')].block;
    items.push(equip[bl]);
    equip[bl] = false;
    _fill();
  }

  function _find(id) {
    items.forEach(function(i) { if (i.id === id) return i; });
  }

  function _newEl(e) {
    return $('<div>').addClass('item')
                    .attr('data-id', e.id)
                    .html(e.name)
                    .on('click', _equip);;
  }

  function _fill() {
    $list.empty();
    for (var i in items) $list.append(_newEl(items[i]));
    $equipement.find('#weapon').empty();
    $equipement.find('#armor').empty();
    if (equip[0]) $equipement.find('#weapon').attr('data-id', equip[0].id).html(equip[0].name).off().on('click', _unequip);
    if (equip[1]) $equipement.find('#armor').attr('data-id', equip[1].id).html(equip[1].name).off().on('click', _unequip);
  }

  function _setItems(i) {
    itemsList = i;
  }

  function _getBonus() {
    return {
      'hp': (equip[0].hp || 0) + (equip[1].hp || 0),
      'mana': (equip[0].mana || 0) + (equip[1].mana || 0),
      'hpSec': (equip[0].hpSec || 0) + (equip[1].hpSec || 0),
      'manaSec': (equip[0].manaSec || 0) + (equip[1].manaSec || 0),
      'gold': (equip[0].gold || 0) + (equip[1].gold || 0),
      'goldSec': (equip[0].goldSec || 0) + (equip[1].goldSec || 0),
      'strength': (equip[0].strength || 0) + (equip[1].strength || 0),
    }
  }

  this.add = _add;
  this.fill = _fill;

  this.setItems = _setItems;
  this.getBonus = _getBonus;
  this.equip = _equip;
}
