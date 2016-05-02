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
    var formHtml = '<form class="pageEditForm" id="pageEditForm">';
    
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
    
    formHtml += '<button id="pageEditFormSaveButton">Save</button>';
    
    formHtml += '</form>';
    
    return formHtml;
}

function renderFormInput(componentType, itemIndex, inputType, value) {
    var callsDynamicData = inputType.indexOf('#') === 0;
    var isDynamicData = inputType.indexOf('_') === 0;
    var type;
    var title;
    
    var dataComponentSelector = componentType + '/' + itemIndex + '/' + inputType;
    
    if (inputType.indexOf('__') !== -1) {
        title = inputType.split('__')[1];
        type = inputType.split('__')[0];
    } else {
        type = inputType;
        title = inputType;
    }
    
    // console.log(type + ' - ' + title);

    var inputHtml = '';
    var placeholder = 'Enter ' + title;
    
    switch(type) {
        case 'text':
        case 'title':
        case 'subtitle': 
        case 'linkHref': 
        case 'linkTarget': 
        case '#sku':
        case 'image':
        case 'bg_image':
        case 'alt':
        case '_text':
        case '_title':
        case '_subtitle': 
        case '_linkHref': 
        case '_linkTarget': 
        case '_image':
        case '_bg_image':
        case '_alt':
            inputHtml = '<label><input type="text" name="' + dataComponentSelector + '"/></label>';
            break;
        default:
            console.error('Unknown form input!', type);
            return '<div><span class="error">Unknown field type <strong>' + type + '</strong><span></div>';
    }
    
    return configureFormInput(inputHtml, title, type, placeholder, value, callsDynamicData, isDynamicData, dataComponentSelector);
}

function configureFormInput(inputHtml, title, type, placeholder, value, callsDynamicData, isDynamicData, dataComponentSelector) {
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