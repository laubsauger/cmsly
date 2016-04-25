var Toolbar = function() {};

Toolbar.prototype.renderToElement = function(targetElement) {
    if (!targetElement) {
        throw "element does not exist";
    }
    
    var toolbarTemplate = document.querySelector('#tpl-toolbar'),
        toolbarContainer = document.createElement('div');
        
    toolbarContainer.setAttribute('class', 'cmsly-toolbar');
    toolbarContainer.innerHTML = toolbarTemplate.innerHTML;
    
    targetElement.parentNode.insertBefore(toolbarContainer, targetElement);
    toolbarTemplate.parentNode.removeChild(toolbarTemplate);
};

var cmsToolbar = new Toolbar();

window.onload = function() {
    cmsToolbar.renderToElement(document.querySelector('body'));
}
