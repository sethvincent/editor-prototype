var through = require('through2')
var debounce = require('lodash.debounce')
var elClass = require('element-class')

var editor = require('./editor')()

editor.views.list.addEventListener('click', function (e, row) {
  editor.views.item.render(row)
  elClass(editor.el.item).add('active')
  elClass(editor.el.listWrapper).remove('active')
})

editor.views.item.addEventListener('close', function (e) {
  elClass(editor.el.item).remove('active')
  elClass(editor.el.listWrapper).add('active')
})

var render = editor.render.bind(editor)

editor.views.filter.addEventListener('filter', function (results, length) {
  render({ data: results })
})

editor.views.filter.addEventListener('reset', function (results, length) {
  render()
})

editor.views.list.addEventListener('load', function () {
  editor.views.filter.render(editor.data)
})

editor.views.item.addEventListener('input', function (property, row, e) {
  render()
})

editor.views.actions.addEventListener('new-row', function (e) {
  var row = {
    key: editor.data.length+1,
    value: {}
  }

  editor.properties.forEach(function (key) {
    row.value[key] = null
  })

  editor.write(row)
})

editor.views.actions.addEventListener('new-column', function (e) {
  editor.newColumn()
})

editor.views.actions.addEventListener('destroy', function (e) {
  editor.destroy()
})

render()