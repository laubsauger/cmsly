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
        formHtml += '<fieldset>';
        formHtml += '<legend>' + pageJson.components[component].type + '</legend>';
        
        for (var itemIndex in pageJson.components[component].content.items) {
            formHtml += '<fieldset>';
            formHtml += '<legend>Item #' + itemIndex + '</legend>';
            
            for (var itemField in pageJson.components[component].content.items[itemIndex]) {
                formHtml += renderFormInput(itemField, pageJson.components[component].content.items[itemIndex][itemField]);
            }
            
            formHtml += '</fieldset>';
        }
        
        formHtml += '</fieldSet>';
    }
    
    formHtml += '</form>'
    
    return formHtml;
}

function renderFormInput(type, value) {
    //@todo: handle this with a bit of brain
    var disabled = '';
    var isDynamicType = type.indexOf('_') === 0;
    
    if (isDynamicType) {
        type = type.slice(1);
        disabled = ' disabled="true" ';
    }
    
    switch(type) {
        case 'title': 
            return '<label>Title<input type="text" placeholder="title" value="'+value+'"' + disabled + '/></label>';
        case 'subtitle': 
            return '<label>Subtitle<input type="text" placeholder="subtitle" value="'+value+'"' + disabled + '/></label>';
        case 'link': 
            return '<label>Link<input type="text" placeholder="link" value="'+value+'"' + disabled + '/></label>';
        case 'sku':
            return '<label>Sku<input type="text" placeholder="sku" value="'+value+'"' + disabled + '/></label>';
        case 'image':
            return '<label>Image<input type="text" placeholder="image" value="'+value+'"' + disabled + '/></label>';
        default:
            return '<div><span class="error">Unknown field type <strong>' + type + '</strong><span></div>';
            console.error('Unknown form input!', type);
            return '';
    } 
}

function renderStyleTag() {
    return '<link type="text/css" rel="stylesheet" href="/css/forms.css">'
}

// function renderScriptTag() {
//     return '<script src="/js/toolbar.js"></script>';
// }

module.exports = renderHtml;