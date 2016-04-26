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

var cmsToolbar = new Toolbar();

window.onload = function() {
    cmsToolbar.renderToElement(document.querySelector('body'));
    
    cmsToolbar.highlightCurrentPageInPageFlyout(
        document.querySelector('#toolbar_pageSelect .toolbar__flyout'),
        window.location.pathname
    );
    
    if (window.location.pathname === '/') {
        var diffButton = document.getElementById('toolbar_diff');
        var jsonButton = document.getElementById('toolbar_json');
        diffButton.parentNode.removeChild(diffButton);
        jsonButton.parentNode.removeChild(jsonButton);
    }
}
