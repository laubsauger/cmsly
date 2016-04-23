var fileHelper = require('./fileHelper.js');
var componentRenderer = require('./componentRenderer.js');
var htmlTidy = require('html');

function renderHtml(page) {
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
    
    html += fileHelper.loadFooter(pageJson.footer || '');
    
    return htmlTidy.prettyPrint(html, {unformatted: []});
}

module.exports = renderHtml;