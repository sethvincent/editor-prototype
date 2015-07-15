var through = require('through2')
var debounce = require('lodash.debounce')
var elClass = require('element-class')

var editor = require('./editor')()

function itemActive () {
  elClass(editor.el.item).add('active')
  elClass(editor.el.listWrapper).remove('active')
}

function itemInActive () {
  elClass(editor.el.item).remove('active')
  elClass(editor.el.listWrapper).add('active')
}

editor.list.addEventListener('click', function (e, row) {
  editor.item.render(row)
  itemActive()
})

editor.item.addEventListener('close', function (e) {
  itemInActive()
})

var render = editor.render.bind(editor)

editor.filter.addEventListener('filter', function (results, length) {
  render({ data: results })
})

editor.filter.addEventListener('reset', function (results, length) {
  render()
})

editor.list.addEventListener('load', function () {
  editor.filter.render(editor.data)
})

editor.item.addEventListener('input', function (property, row, e) {
  render()
})

editor.actions.addEventListener('new-row', function (e) {
  var row = {
    key: editor.data.length+1,
    value: {}
  }

  editor.properties.forEach(function (key) {
    row.value[key] = null
  })

  editor.write(row)
})

editor.actions.addEventListener('new-column', function (e) {
  editor.newColumn()
})

editor.actions.addEventListener('destroy', function (e) {
  if (window.confirm('wait. are you sure you want to destroy all this data?')) {
    editor.destroy()
  }
})

editor.item.addEventListener('destroy-row', function (row, e) {
  if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
    editor.destroyRow(row.key)
    itemInActive()
  }
})

editor.headers.addEventListener('destroy-column', function (header, e) {
  if (window.confirm('wait. are you sure you want to destroy all the data in this column?')) {
    editor.destroyColumn(header)
  }
})

editor.headers.addEventListener('rename-column', function (header, e) {
  var newName = window.prompt('New name for the column')
  editor.renameColumn(header, newName)
})

editor.render()