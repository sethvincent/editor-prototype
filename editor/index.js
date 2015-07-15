var through = require('through2')
var storage = require('simple-local-storage')
var elClass = require('element-class')
var dataset = require('data-set')

module.exports = Editor

function Editor (options) {
  if (!(this instanceof Editor)) return new Editor(options)
  options = options || {}
  var self = this

  this.data = []
  this.properties = options.properties || []
  this._active = { row: null, column: null, cell: null }

  this.el = {
    list: document.getElementById('list'),
    listWrapper: document.querySelector('.list-wrapper'),
    item: document.getElementById('item'),
    actions: document.getElementById('actions')
  }

  this.headers = require('./headers')(this.el.list)
  this.item = require('./item')({ titleField: 'title', appendTo: this.el.item })
  this.list = require('./list')({ appendTo: this.el.list, height: window.innerHeight })
  this.actions = require('./actions')({ appendTo: this.el.actions })
  this.filter = require('./filter')({ appendTo: this.el.actions })

  this.store = new storage()
  var state = this.store.get('state')
  if (state) {
    this.data = state.data
    this.properties = state.properties
    this.render(state)
  }

  this.list.addEventListener('click', function (e, row) {
    var rowEl = e.target.parentNode.parentNode
    var header = dataset(e.target).key

    self._active.cell = e.target
    self._active.column = header
    self._active.row = rowEl
    self._active.rowKey = row.key
    self._active.fieldId = 'field-'+row.key+'-'+header

    self.data.forEach(function (obj) {
      if (obj.key === row.key) row.active = { cell: e.target }
      else obj.active = false
    })
    
    self.list.send('active', self._active)
  })
}

Editor.prototype.render = function (options) {
  options = options || {}
  var properties = options.properties || this.properties
  var data = options.data || this.data
  this.headers.render(properties)
  this.list.render(data)
  this.actions.render()
  this.filter.render(data)
  this.store.set('state', JSON.stringify({ data: data, properties: properties }))
}

Editor.prototype.write = function (item) {
  this.data.push(item)
  this.render(self.data)
}

Editor.prototype.newColumn = function () {
  var name = window.prompt('new column')
  this.properties.push(name)
  this.headers.render(this.properties)
  this.data.forEach(function (item) {
    item.value[name] = null
  })
  this.list.render(this.data)
  if (this._active.rowdata) this.item.render(this._active.rowdata)
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

Editor.prototype.setActiveRow = function (key) {
  this
}

Editor.prototype.setActiveColumn = function (key) {
  this.data.forEach(function (row) {
    if (row.key === key) row.active = true
    else row.active = false
  })
}