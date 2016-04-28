var cheerio = require('cheerio');

function renderHtml(pageJson) {
    return renderForm(pageJson);
}

function renderForm(pageJson) {
    var html = '';
    
    html += renderPageEditForm(pageJson);
    html += renderStyleTag();
    
    return html;
}

//@todo: RENDER WITH HANDLEBARS... OBVIOUSLY!!!
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
    var disabled = false;
    var isDynamicType = type.indexOf('_') === 0;
    
    if (isDynamicType) {
        // type = type.slice(1);
        disabled = true;
    }
    
    var dataComponentSelector = 'data-cmsly-selector="' + componentType + '/' + itemIndex + '/' + type + '"';
    var inputHtml = '';
    
    console.log(dataComponentSelector);
    
    switch(type) {
        case 'title': 
            inputHtml = '<label>Title<input type="text" placeholder="title"/></label>';
            break;
        case 'subtitle': 
            inputHtml = '<label>Subtitle<input type="text" placeholder="subtitle"/></label>';
            break;
        case 'link': 
            inputHtml = '<label>Link<input type="text" placeholder="link"/></label>';
            break;
        case 'sku':
            inputHtml = '<label>Sku<input type="text" placeholder="sku"/></label>';
            break;
        case 'image':
            inputHtml = '<label>Image<input type="text" placeholder="image"/></label>';
            break;
        default:
            inputHtml = '<div><span class="error">Unknown field type <strong>' + type + '</strong><span></div>';
            break;
            console.error('Unknown form input!', type);
    }
    
    return configureFormInput(inputHtml, value, type, disabled, dataComponentSelector);
}

function configureFormInput(inputHtml, value, type, isDisabled, dataComponentSelector) {
   var $ = cheerio.load(inputHtml);
    
    if (isDisabled) {
        $('input').attr('disabled', 'disabled');
    }

    if (dataComponentSelector) {
        $('input').attr('data-cmsly-selector', dataComponentSelector);
    }
    
    if (value) {
        $('input').attr('value', value);
    }
    
    return $.html();
}

function renderStyleTag() {
    return '<link type="text/css" rel="stylesheet" href="/css/forms.css">'
}

// function renderScriptTag() {
//     return '<script src="/js/toolbar.js"></script>';
// }

module.exports = renderHtml;