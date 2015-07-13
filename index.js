var through = require('through2')
var debounce = require('lodash.debounce')
var elClass = require('element-class')

var properties = Object.keys({
  title: 'this is title ' + i,
  description: 'this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool ',
  someField: 'this is a field',
  another: (123 * i).toString(),
  pizza: (123 / i).toString(),
  awesome: (1 * i).toString(),
  serious: 'nope'
})

var editor = require('./editor')({ properties: properties })

editor.views.list.addEventListener('click', function (e, row) {
  editor.views.item.render(row)
  elClass(editor.el.item).add('active')
  elClass(editor.el.listWrapper).remove('active')
})

editor.views.item.addEventListener('close', function (e) {
  elClass(editor.el.item).remove('active')
  elClass(editor.el.listWrapper).add('active')
})

var render = window.render = debounce(editor.render.bind(editor), 100)

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

for (var i=0;i<=100;i++) {
  editor.write({
    key: i,
    value: {
      title: 'this is title ' + i,
      description: 'this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool ',
      someField: 'this is a field',
      another: (123 * i).toString(),
      pizza: (123 / i).toString(),
      awesome: (1 * i).toString(),
      serious: 'nope'
    }
  })
}

render()