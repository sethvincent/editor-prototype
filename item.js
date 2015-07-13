var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Item
inherits(Item, BaseElement)

function Item (options) {
  if (!(this instanceof Item)) return new Item(options)
  BaseElement.call(this, options.appendTo)
  this.titleField = options.titleField
}

Item.prototype.render = function (obj) {
  var self = this
  var fields = []

  Object.keys(obj.value).forEach(function (key) {
    var options = { 
      value: obj.value[key],
      oninput: function (e) {
        obj.value[key] = e.target.value
        self.send('input', obj.value[key], obj, e)
        self.render(obj)
      }
    }

    if (key === self.titleField) options.className += ' title'
    var field = self.html('textarea.item-property-value', options)

    var fieldwrapper = self.html('div.item-property-wrapper', [
      self.html('span.item-property-label', key),
      field
    ])

    fields.push(fieldwrapper)
  })

  var vtree = this.html('div.item', [
    self.html('a.close-item', { 
      href: '#', 
      onclick: function (e) {
        e.preventDefault()
        self.send('close', e) 
      }}, 'x'),
    self.html('div.item-properties-wrapper', fields)
  ])

  return this.afterRender(vtree)
}
