var through = require('through2')

module.exports = Editor

function Editor (options) {
  if (!(this instanceof Editor)) return new Editor(options)
  options = options || {}
  this.data = []
  this.properties = options.properties || []

  this.el = {
    list: document.getElementById('list'),
    listWrapper: document.querySelector('.list-wrapper'),
    item: document.getElementById('item'),
    actions: document.getElementById('actions')
  }

  this.views = {
    headers: require('./headers')(this.el.list),
    item: require('./item')({ titleField: 'title', appendTo: this.el.item }),
    list: require('./list')({ appendTo: this.el.list, height: window.innerHeight }),
    filter: require('./filter')({ appendTo: this.el.actions })
  }
}

Editor.prototype.render = function (options) {
  options = options || {}
  var properties = options.properties || this.properties
  var data = options.data || this.data
  this.views.headers.render(properties)
  this.views.list.render(data)
  this.views.filter.render(data)
}

Editor.prototype.write = function (item) {
  this.data.push(item)
  this.render(self.data)
}
