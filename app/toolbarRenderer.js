var Handlebars = require('handlebars');

var fileHelper = require('./fileHelper.js');

// load component template, compile, return html
function renderHtml() {
    var toolbarTemplate = fileHelper.loadToolbarTemplate();
    var compiledTemplate = Handlebars.compile(toolbarTemplate);
    
    var toolbarTemplateData = {'pages': fileHelper.getPagesFolderIndex()};
    
    return renderToolbar(compiledTemplate(toolbarTemplateData));
}

function renderToolbar(toolbarTemplate) {
    var html = '';
    
    html += '<script type="text/template" id="tpl-toolbar">' + toolbarTemplate + '</script>';
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