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

function extendComponentDataItemFieldWithBackendData(resolverItem, resolverFieldValue, field, componentType) {
  switch(componentType) {
    case 'productList':
        return backendService.getProductsData(resolverItem, resolverFieldValue, field);
    }
}

function containsDynamicField(contentItem) {
    return Object.keys(contentItem).filter(function(item) { return item.indexOf('_') === 0; }).length > 0;
}

function getResolverField(contentItem) {
    return Object.keys(contentItem).filter(function(item) { return item.indexOf('#') === 0; })[0];
}


// compile template and map data
function buildHtml(componentType, template, componentData) {
  var compiledTemplate = Handlebars.compile(template);

  for (var itemIndex in componentData.items) {
    if(containsDynamicField(componentData.items[itemIndex])) {
      var resolverField = getResolverField(componentData.items[itemIndex]);
      
      if (!resolverField) {
        throw 'No resolverItem found for item "' + itemIndex + '" in component "' + componentType + '"';
      } 
      
      for (var field in componentData.items[itemIndex]) {
        if (field.indexOf('#') === 0) {
          continue;
        }
        
        // field is manually overwritten
        if (field.indexOf('_') !== 0) {
          // duplicate array key with dynamic prefix _ to allow keeping the template untouched when setting dynamic values manually
          componentData.items[itemIndex]['_' + field] = componentData.items[itemIndex][field];
          continue;
        }

        componentData.items[itemIndex][field] = extendComponentDataItemFieldWithBackendData(resolverField, componentData.items[itemIndex][resolverField], field, componentType);
      }
    }
  }
  

  return compiledTemplate(componentData);
}

// load component template, compile, return html
function renderHtml(component) {
  var componentTemplate = fileHelper.loadComponentTemplate(component.type + '/' + component.type);
  
  registerComponentPartials(component.type);

  return buildHtml(component.type, componentTemplate, component.content);
}

module.exports = renderHtml;