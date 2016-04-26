var htmlTidy = require('html');

var fileHelper = require('./fileHelper.js');
var componentRenderer = require('./componentRenderer.js');
var toolbarRenderer = require('./toolbarRenderer.js');

function renderHtml(page, injectPreviewComponents) {
    if (!page) {
        console.error('No page provided!');
        return;
    }
    
    var pageJson = fileHelper.loadPageJson(page);
    var html = '';

    html += fileHelper.loadPageTopSection();
    html += fileHelper.loadContentTopSection(pageJson.header || '');

    for(var item in pageJson.components) {
        html += componentRenderer(pageJson.components[item]);
    }
    
    html += fileHelper.loadContentBottomSection(pageJson.footer || '');

    if (injectPreviewComponents === true) {
        html += toolbarRenderer();
    }
    
    html += fileHelper.loadPageBottomSection();
    
    return htmlTidy.prettyPrint(html, {unformatted: []});
}

module.exports = renderHtml;