function Market() {
  var $list = $('#inventary #market #items');
  var $desc = $('#inventary #market #desc');
  $desc.hide();
  var $name = $desc.find('#name');
  var $description = $desc.find('#description');
  var $cost = $desc.find('#cost');
  var items;
  var selected;

  function _setItems(it) {
    items = it;
  }

  function _select(ev) {
    var $el = $(ev.target);
    var idx = $el.attr('data-id');
    selected = items[idx];

    $list.find('.selected').removeClass('selected');
    $el.addClass('selected');
    $desc.show();
    $name.html(selected.name)
    $description.html(selected.description);
    $cost.html(selected.cost);
  }

  function _buyIt(pl) {
    if (!selected) return false;
    return (pl.pay(selected.cost)) ? selected.id : -1;
  }

  function _newEl(e) {
    return $('<div>').addClass('item')
                    .attr('data-id', e.id)
                    .html(e.name)
                    .on('click', _select);;
  }

  function _fill() {
    $list.empty();
    for (var i in items) $list.append(_newEl(items[i]));
  }

  this.setItems = _setItems;
  this.fill = _fill;
  this.buyIt = _buyIt;
}
