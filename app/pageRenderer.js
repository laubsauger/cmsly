var htmlTidy = require('html');
var Handlebars = require('handlebars');

var fileHelper = require('./fileHelper.js');
var componentRenderer = require('./componentRenderer.js');
var toolbarRenderer = require('./toolbarRenderer.js');

function replacePlaceholderInContent(contentHtml, data) {
    var compiledTemplate = Handlebars.compile(contentHtml);
    return compiledTemplate(data);
}

/**
 * replace a placeholder in full html page with the respective components
 */
function renderInPlaceholderMode(contentHtmlTemplate, pageJson) {
    var html = contentHtmlTemplate;
    var data = {};

    for(var item in pageJson.components) {
        data[pageJson.components[item].placeholder] = componentRenderer(pageJson.components[item]);
    }
    
    if (pageJson.baseCss) {
        data['baseCss'] = pageJson.baseCss;
    }
    
    if (pageJson.baseJs) {
        data['baseJs'] = pageJson.baseJs;
    }
    
    html = replacePlaceholderInContent(html, data);

    return html;    
}

/**
 * concat page parts and components
 */
function renderInStackingMode(pageJson) {
    var html = '';
    var componentsHtml = '';
    
    for(var item in pageJson.components) {
        componentsHtml += componentRenderer(pageJson.components[item]);
    }

    html += fileHelper.loadPageTopSection();
    
    if (pageJson.header !== false) {
        html += fileHelper.loadContentTopSection(pageJson.header || '');
    }
    
    html += componentsHtml;

    if (pageJson.footer !== false) {
        html += fileHelper.loadContentBottomSection(pageJson.footer || '');
    }

    html += fileHelper.loadPageBottomSection();
    
    return html;
}

function renderHtml(page, injectPreviewComponents) {
    if (!page) {
        console.error('No page provided!');
        return;
    }
    
    if (injectPreviewComponents === true) {
        Handlebars.registerHelper("helperMissing", function(context) {
            console.error('Template defines "' + context.name + '", but it was not provided in context');
            return '<pre class="cmsly-error">No data for placeholder "' + context.name + '"!</pre>';
        });
    }
    
    var pageJson = fileHelper.loadPageJson(page);
    var html = '';
    
    if (pageJson.placeholderMode) {
        html = renderInPlaceholderMode(fileHelper.loadContent(page), pageJson);
    } else {
        html += renderInStackingMode(pageJson);
    }
        
    if (injectPreviewComponents === true) {
        html = html.replace('</body>', toolbarRenderer(pageJson) + '</body>');
    }
        
    return htmlTidy.prettyPrint(html, {unformatted: []});
}

module.exports = renderHtml;