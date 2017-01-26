function Market() {
  var $list = $('#inventary #market #items');
  var $desc = $('#inventary #market #desc');
  $desc.hide();
  var $name = $desc.find('#name');
  var $description = $desc.find('#description');
  var $cost = $desc.find('#cost');
  var items;

  function _setItems(it) {
    items = it;
  }

  function _select(ev) {
    var $el = $(ev.target);
    var idx = $el.attr('data-id');
    var i = items[idx];

    $list.find('.selected').removeClass('selected');
    $el.addClass('selected');
    $desc.show();
    $name.html(i.name)
    $description.html(i.description);
    $cost.html(i.cost);
  }

  function _buy(ev) {

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
}
