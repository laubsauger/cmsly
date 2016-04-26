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

Toolbar.prototype.highlightCurrentPageInPageFlyout = function(pageFlyout, pathname) {
    // pageFlyout.fin
};

var cmsToolbar = new Toolbar();

window.onload = function() {
    cmsToolbar.renderToElement(document.querySelector('body'));
    
    cmsToolbar.highlightCurrentPageInPageFlyout(
        document.querySelector('#toolbar_pageSelect .toolbar__flyout'),
        window.location.pathname
    );
}
