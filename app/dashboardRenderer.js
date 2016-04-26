var Handlebars = require('handlebars');
var fileHelper = require('./fileHelper.js');

// load component template, compile, return html
function renderHtml() {
    var template = fileHelper.loadDashboardTemplate();
    var compiledTemplate = Handlebars.compile(template);
    
    var templateData = {'pages': fileHelper.getPagesFolderIndex()};
    
    return renderDashboard(compiledTemplate(templateData));
}

function renderDashboard(template) {
    var html = '';
    
    html += template;
    html += renderStyleTag();
    html += renderScriptTag();
    
    return html;
}

function renderStyleTag() {
    return '<link type="text/css" rel="stylesheet" href="/css/dashboard.css">'
}

function renderScriptTag() {
    return '<script src="/js/dashboard.js"></script>';
}

module.exports = renderHtml;