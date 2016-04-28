var cheerio = require('cheerio');

function renderHtml(pageJson) {
    return renderForm(pageJson);
}

function renderForm(pageJson) {
    var html = '';
    
    html += renderPageEditForm(pageJson);
    
    return html;
}

//@todo: RENDER WITH HANDLEBARS... OBVIOUSLY!!!!!
function renderPageEditForm(pageJson) {
    var formHtml = '<form class="pageEditForm" id="pageEditForm">'
    
    for (var component in pageJson.components) {
        var componentType = pageJson.components[component].type;
        formHtml += '<fieldset>';
        formHtml += '<legend>' + componentType + '</legend>';
        
        for (var itemIndex in pageJson.components[component].content.items) {
            formHtml += '<fieldset>';
            formHtml += '<legend>Item #' + itemIndex + '</legend>';
            
            for (var itemField in pageJson.components[component].content.items[itemIndex]) {
                formHtml += renderFormInput(componentType, itemIndex, itemField, pageJson.components[component].content.items[itemIndex][itemField]);
            }
            
            formHtml += '</fieldset>';
        }
        
        formHtml += '</fieldSet>';
    }
    
    formHtml += '</form>'
    
    return formHtml;
}

function renderFormInput(componentType, itemIndex, type, value) {
    var callsDynamicData = type.indexOf('#') === 0;
    var isDynamicData = type.indexOf('_') === 0;
    // if (isDynamic) {
    //     type = type.slice(1);
    // }
    
    var dataComponentSelector = componentType + '/' + itemIndex + '/' + type;
    var inputHtml = '';
    var title = '';
    var placeholder = '';
    
    console.log(dataComponentSelector);
    
    switch(type) {
        case 'title':
            title = 'Title';
            placeholder = 'Enter title';
            inputHtml = '<label><input type="text"/></label>';
            break;
        case 'subtitle': 
            title = 'Title';
            placeholder = 'Enter subtitle';
            inputHtml = '<label><input type="text"/></label>';
            break;
        case 'link': 
            title = 'Link';
            placeholder = 'Enter link href';
            inputHtml = '<label><input type="text"/></label>';
            break;
        case '#sku':
            title = 'Sku';
            placeholder = 'Enter a single sku';
            inputHtml = '<label><input type="text"/></label>';
            break;
        case 'image':
            title = 'Image';
            placeholder = 'Select image';
            inputHtml = '<label><input type="text"/></label>';
            break;
        default:
            console.error('Unknown form input!', type);
            return '<div><span class="error">Unknown field type <strong>' + type + '</strong><span></div>';
    }
    
    return configureFormInput(inputHtml, title, placeholder, value, type, callsDynamicData, isDynamicData, dataComponentSelector);
}

function configureFormInput(inputHtml, title, placeholder, value, type, callsDynamicData, isDynamicData, dataComponentSelector) {
    var $ = cheerio.load(inputHtml);
    var input = $('input');
    
    if (title) {
        if (callsDynamicData) {
            title = '[' + title + ']';
        } else if (isDynamicData) {
            title = '{' + title + '}';
        }
        input.before(title);
    }
    
    if (placeholder) {
        input.attr('placeholder', placeholder);
    }
    
    if (isDynamicData) {
        input.attr('disabled', 'disabled');
    }

    if (dataComponentSelector && !callsDynamicData) {
        input.attr('data-cmsly-selector', dataComponentSelector);
    }
    
    if (value) {
        input.attr('value', value);
    }
    
    return $.html();
}

module.exports = renderHtml;