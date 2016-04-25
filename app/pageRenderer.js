var htmlTidy = require('html');

var fileHelper = require('./fileHelper.js');
var componentRenderer = require('./componentRenderer.js');
var toolbarRenderer = require('./toolbarRenderer.js');

function renderHtml(page, injectToolbar) {
    if (!page) {
        console.error('No page provided!');
        return;
    }
    
    var pageJson = fileHelper.loadPageJson(page);
    var html = '';

    html += fileHelper.loadHeader(pageJson.header || '');

    for(var item in pageJson.components) {
        html += componentRenderer(pageJson.components[item]);
    }
    
    if (injectToolbar === true) {
        html += toolbarRenderer(pageJson.components);
    }
    
    html += fileHelper.loadFooter(pageJson.footer || '');
    
    return htmlTidy.prettyPrint(html, {unformatted: []});
}

module.exports = renderHtml;