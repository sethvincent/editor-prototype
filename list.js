var ViewList = require('view-list')
var extend = require('extend')
var value = require('dom-value')
var dataset = require('data-set')

module.exports = function (opts) {
  var options = extend({
    className: 'row-list',
    eachrow: rows,
    editable: true,
    properties: {}
  }, opts)

  var list = ViewList(options)

  function rows (row) {
    var properties = Object.keys(row.value)
    var elements = properties.map(element)

    function element (key) {
      function getProperty (target) {
        var property = {}
        var ds = dataset(target)
        property[ds.key] = value(target)
        return property
      }

      function onclick (e) {
        list.send('click', e, row)
      }

      function onfocus (e) {
        var property = getProperty(e.target)
        list.send('focus', e, property, row)
      }

      function onblur (e) {
        var property = getProperty(e.target)
        list.send('blur', e, property, row)
      }

      var propertyOptions = {
        attributes: { 
          'data-type': 'string', // todo: use property type from options.properties
          'data-key': key
        },
        onfocus: onfocus,
        onblur: onblur
      }

      return list.html('li.list-property', { onclick: onclick }, [
        list.html('span.list-property-value', propertyOptions, row.value[key]),
      ])
    }

    var rowOptions = { attributes: { 'data-key': row.key } }

    return list.html('li.list-row', rowOptions, [
      list.html('ul.list-properties', elements)
    ])
  }

  return list
}
