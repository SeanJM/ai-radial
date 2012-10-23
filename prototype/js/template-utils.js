// Templating
var template = {};
template.load = function (data,callback) {
  var cache           = $('<div />'),
      templateAddress = './templates/' + data['template-file'] + '.html' + ' ' + data['template'],
      newCache;
  cache.load(templateAddress,function() {
    newCache = cache.replaceWith(cache.contents());
    newCache.appendTo(data['parent']);
    if (callback) { callback(newCache); }
  });
};