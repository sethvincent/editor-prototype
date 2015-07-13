var element = require('base-element')
var inherits = require('inherits')

module.exports = Headers
inherits(Headers, element)

function Headers (appendTo) {
  if (!(this instanceof Headers)) return new Headers(appendTo)
  element.call(this, appendTo)
}

Headers.prototype.render = function (headers) {
  var self = this
  var items = []

  headers.forEach(function (header) {
    items.push(self.html('li.list-header-item.data-list-property', [
      self.html('button#destroy-column.small', {
        onclick: function (e) {
          self.send('destroy-column', header, e)
        }
      }, self.html('i.fa.fa-remove', '')),
      //self.html('button#rename-column.small', {
      //  onclick: function (e) {
      //    self.send('rename-column', header, e)
      //  }
      //}, self.html('i.fa.fa-pencil', '')),
      header
    ]))
  })

  var vtree = this.html('ul.headers-list.data-list-properties', items)
  return this.afterRender(vtree)
}