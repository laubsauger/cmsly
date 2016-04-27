var Handlebars = require('handlebars');

var fileHelper = require('./fileHelper.js');

// load component template, compile, return html
function renderHtml(pageJson) {
    var toolbarTemplate = fileHelper.loadToolbarTemplate();
    var compiledTemplate = Handlebars.compile(toolbarTemplate);
    
    var toolbarTemplateData = {'pages': fileHelper.getPagesFolderIndex()};
    
    return renderToolbar(compiledTemplate(toolbarTemplateData), pageJson);
}

function renderToolbar(toolbarTemplate, pageJson) {
    var html = '';
    
    html += '<script type="text/template" id="tpl-toolbar">' + toolbarTemplate + '</script>';
    //@todo: inject in a decent place, analog to toolbar
    html += renderPageEditForm(pageJson);
    html += renderStyleTag();
    html += renderScriptTag();
    
    return html;
}

//@todo: RENDER WITH HANDLEBARS... OBVIOUSLY!!!
//@todo: extract to pageEditFormRenderer
function renderPageEditForm(pageJson) {
    var formHtml = '<form>'
    
    for (var component in pageJson.components) {
        formHtml += '<fieldset>';
        formHtml += '<legend>' + pageJson.components[component].type + '</legend>';
        
        for (var item in pageJson.components[component].content.items) {
            formHtml += '<fieldset>';
            formHtml += '<legend>Item #' + item + '</legend>';
            
            for (var itemField in pageJson.components[component].content.items[item]) {
                formHtml += renderFormInput(itemField);
            }
            
            formHtml += '</fieldset>';
        }
        
        formHtml += '</fieldSet>';
    }
    
    formHtml += '</form>'
    
    return formHtml;
}

function renderFormInput(type, item) {
    switch(type) {
        case 'title': 
            return '<label>Title<input type="text" placeholder="title" value=""/></label><br/>';
        case 'subtitle': 
            return '<label>Subtitle<input type="text" placeholder="subtitle" value=""/></label><br/>';
        case 'link': 
            return '<label>Link<input type="text" placeholder="link" value=""/></label><br/>';
        case 'sku':
            return '<label>Sku<input type="text" placeholder="sku" value=""/></label><br/>';
        default:
            console.error('Unknown form input!', type);
            return '';
    } 
}

function renderStyleTag() {
    return '<link type="text/css" rel="stylesheet" href="/css/toolbar.css">'
}

function renderScriptTag() {
    return '<script src="/js/toolbar.js"></script>';
}

module.exports = renderHtml;