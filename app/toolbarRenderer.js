var fileHelper = require('./fileHelper.js');

// load component template, compile, return html
function renderHtml(components) {
  var toolbarTemplate = fileHelper.loadToolbarTemplate();

  return renderToolbar(toolbarTemplate, components);
}

function renderToolbar(toolbarTemplate, components) {
    var html = '';
    
    html += '<script type="text/template" id="tpl-toolbar">' + toolbarTemplate + '</script>';
    html += getScriptTag();
    
    return html;
}

function getScriptTag() {
    return '<script src="/js/toolbar.js"></script>';
}

module.exports = renderHtml;