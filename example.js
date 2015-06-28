var through = require('through2')
var debounce = require('lodash.debounce')
var elClass = require('element-class')

var itemEl = document.getElementById('item')
var item = require('./item')({
  titleField: 'title',
  appendTo: itemEl
})

var listWrapper = document.querySelector('.list-wrapper')
var listEl = document.getElementById('list')
var headers = require('./headers')(listEl)

var properties = Object.keys({
  title: 'this is title ' + i,
  description: 'this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool ',
  someField: 'this is a field',
  another: (123 * i).toString(),
  pizza: (123 / i).toString(),
  awesome: (1 * i).toString(),
  serious: 'nope'
})

headers.render(properties)

var list = require('./list')({
  appendTo: listEl,
  height: window.innerHeight
})

list.on('click', function (e, row) {
  item.render(row)
  elClass(itemEl).add('active')
  elClass(listWrapper).remove('active')
})

item.addEventListener('close', function (e) {
  elClass(itemEl).remove('active')
  elClass(listWrapper).add('active')
})

var render = debounce(list.render.bind(list), 100)

var all = []
var model = through.obj(function (chunk, enc, cb) {
  this.push(chunk)
  cb()
})

model.on('data', function (data) {
  all.push(data)
  render(all)
})

for (var i=0;i<=100000;i++) {
  model.write({
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
