var Handlebars = require('handlebars');

var fileHelper = require('./fileHelper.js');
var formRenderer = require('./formRenderer.js');

// load component template, compile, return html
function renderHtml(pageJson) {
    var toolbarTemplate = fileHelper.loadToolbarTemplate();
    var compiledTemplate = Handlebars.compile(toolbarTemplate);
    
    var toolbarTemplateData = {'pages': fileHelper.getPagesFolderIndex()};
    
    return renderToolbar(compiledTemplate(toolbarTemplateData), pageJson);
}

function renderToolbar(toolbarTemplate, pageJson) {
    var html = '';
    
    html += '<script type="text/template" id="tpl-toolbar">';
    
        html += toolbarTemplate;
        
        if (pageJson) {
            html += formRenderer(pageJson);
        }
        
    html += '</script>';

    html += renderStyleTag();
    html += renderScriptTag();
    
    return html;
}

function renderStyleTag() {
    return '<link type="text/css" rel="stylesheet" href="/css/toolbar.css">'
}

function renderScriptTag() {
    return '<script src="/js/toolbar.js"></script>';
}

module.exports = renderHtml;