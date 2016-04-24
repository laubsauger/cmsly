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

function extendContentWithBackendData(componentType, content) {
  switch(componentType) {
    case 'productList': 
        return backendService.getProductsData(content);
    default: 
      return content;
  }
}

function containsDynamicContent(contentItems) {
  var dynamicContentItems = 0;
  
  for (var item in contentItems) {
    dynamicContentItems += Object.keys(contentItems[item]).filter(function(item) { return item.indexOf('_') === 0; }).length;
  }
  
  return dynamicContentItems > 0;
}

// compile template and map data
function buildHtml(componentType, template, content) {
  var compiledTemplate = Handlebars.compile(template);

  if (containsDynamicContent(content.items)) {
      content = extendContentWithBackendData(componentType, content);
  }

  return compiledTemplate(content);
}

// load component template, compile, return html
function renderHtml(component) {
  var componentTemplate = fileHelper.loadComponentTemplate(component.type + '/' + component.type);
  
  registerComponentPartials(component.type);

  return buildHtml(component.type, componentTemplate, component.content);
}

module.exports = renderHtml;