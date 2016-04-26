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
    console.log(pathname);
};

Toolbar.prototype.removeItem = function(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
};

var cmsToolbar = new Toolbar();

window.onload = function() {
    cmsToolbar.renderToElement(document.querySelector('body'));
    
    cmsToolbar.highlightCurrentPageInPageFlyout(
        document.querySelector('#toolbar_pageSelect .toolbar__flyout'),
        window.location.pathname
    );
    
    // add/remove certain buttons when on dashboard
    if (window.location.pathname === '/') {
        cmsToolbar.removeItem('toolbar_diff');
        cmsToolbar.removeItem('toolbar_json');
    }
}
