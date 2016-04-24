var fileHelper = require('./fileHelper.js');
var Handlebars = require('handlebars');
var backendService = require('./backendService.js');

//lookup partials for this component type and register them
function registerComponentPartials(componentType) {
  var partials = fileHelper.getComponentPartialsFileIndex(componentType);

  for (var i = 0; i < partials.length; i++) {
    var partialName = partials[i].split(".").slice(0, -1).join(".");
    var partialContent = fileHelper.loadPartialTemplate(componentType + '/' + partialName);
    
    Handlebars.registerPartial(partialName, partialContent);
  }
}

//@todo: 
function extendContentWithBackendData(componentType, content) {
  switch(componentType) {
    case 'productList': 
        return backendService.getProductsData(content);
    default: 
      return content;
  }
}

// compile template and map data
function buildHtml(componentType, template, content) {
  var compiledTemplate = Handlebars.compile(template);

  content = extendContentWithBackendData(componentType, content);

  // console.log(content);
  return compiledTemplate(content);
}

// load component template, compile, return html
function renderHtml(component) {
  var componentTemplate = fileHelper.loadComponentTemplate(component.type + '/' + component.type);
  
  registerComponentPartials(component.type);

  return buildHtml(component.type, componentTemplate, component.content);
}

module.exports = renderHtml;