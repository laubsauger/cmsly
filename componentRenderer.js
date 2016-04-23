var fileHelper = require('./fileHelper.js');
var Handlebars = require('handlebars');

//lookup partials for this component type and register them
function registerComponentPartials(componentType) {
  var partials = fileHelper.getComponentPartialsFolderIndex(componentType);

  for (var i = 0; i < partials.length; i++) {
    var partialName = partials[i].split(".").slice(0, -1).join(".");
    var partialContent = fileHelper.loadPartialTemplate(componentType + '/' + partialName);
    
    Handlebars.registerPartial(partialName, partialContent);
  }
}

// compile template and map data
function buildHtml(template, data) {
  var compiledTemplate = Handlebars.compile(template);

  return compiledTemplate(data);
}

// load component template, compile, return html
function renderHtml(component) {
  var componentTemplate = fileHelper.loadComponentTemplate(component.type + '/' + component.type);
  
  registerComponentPartials(component.type);

  return buildHtml(componentTemplate, component.content);
}

module.exports = renderHtml;