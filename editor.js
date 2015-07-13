var through = require('through2')
var storage = require('simple-local-storage')

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
    actions: require('./actions')({ appendTo: this.el.actions }),
    filter: require('./filter')({ appendTo: this.el.actions })
  }
  
  this.store = new storage()
  var state = this.store.get('state')
  if (state) {
    console.log(typeof state)
    this.data = state.data
    this.properties = state.properties
    this.render(state)
  }
}

Editor.prototype.render = function (options) {
  options = options || {}
  var properties = options.properties || this.properties
  var data = options.data || this.data
  this.views.headers.render(properties)
  this.views.list.render(data)
  this.views.actions.render()
  this.views.filter.render(data)
  this.store.set('state', JSON.stringify({ data: data, properties: properties }))
}

Editor.prototype.write = function (item) {
  this.data.push(item)
  this.render(self.data)
}

Editor.prototype.newColumn = function () {
  var name = window.prompt('new column')
  this.properties.push(name)
  this.views.headers.render(this.properties)
  this.data.forEach(function (item) {
    item.value[name] = null
  })
  this.views.list.render(this.data)
}

Editor.prototype.destroy = function () {
  this.data = []
  this.properties = []
  this.store.set('state', null)
  this.render()
}

Editor.prototype.destroyRow = function (key) {
  this.data = this.data.filter(function (row) {
    return row.key !== key
  })
  this.render({ data: this.data })
}

Editor.prototype.destroyColumn = function (name) {
  this.data.forEach(function (item) {
    delete item.value[name]
  })
  this.properties = this.properties.filter(function (header) {
    return header !== name
  })
  this.render({ data: this.data, properties: this.properties })
}

Editor.prototype.renameColumn = function (oldname, newname) {
  this.data.forEach(function (item) {
    item.value[newname] = item.value[oldname]
    delete item.value[oldname]
  })
  var i = this.properties.indexOf(oldname)
  this.properties[i] = newname
  this.render({ data: this.data, properties: this.properties })
}
