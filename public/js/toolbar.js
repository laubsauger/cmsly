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
    // @todo: implement
    console.log(pathname);
};

Toolbar.prototype.removeItem = function(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
};

Toolbar.prototype.addConfirmDialogToButton = function(buttonElement, confirmText) {
    buttonElement.addEventListener(
        'click',
        function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if(confirm(confirmText)) {
                if (buttonElement.parentElement.tagName === 'A') {
                    window.location.href = buttonElement.parentElement.getAttribute('href');
                    return true;
                }
            }
            
            return false;
        }
    );
}

Toolbar.prototype.registerPageDataClickToShowFormEvent = function(buttonElement) {
    buttonElement.addEventListener(
        'click',
        function(event) {
            var form = document.getElementById('pageEditForm');
            
            if (form.style.display === 'block') {
                form.style.display = 'none';
            } else {
                form.style.display = 'block';
            }
        }
    );
}

var cmsToolbar = new Toolbar();

window.addEventListener('load', function() {
    console.log('toolbar - init');
    cmsToolbar.renderToElement(document.querySelector('body'));
    
    cmsToolbar.highlightCurrentPageInPageFlyout(
        document.querySelector('#toolbar_pageSelect .toolbar__flyout'),
        window.location.pathname
    );
    
    // add/remove certain buttons when on dashboard
    if (window.location.pathname === '/') {
        cmsToolbar.removeItem('toolbar_diff');
        cmsToolbar.removeItem('toolbar_json');
        cmsToolbar.removeItem('toolbar_data');
    }
    
    cmsToolbar.addConfirmDialogToButton(
        document.querySelector('.toolbar__section--publish .toolbar__button'),
        'Are you sure you want to publish?'
    );
    
    cmsToolbar.registerPageDataClickToShowFormEvent(
        document.querySelector('.toolbar__section--data .toolbar__button')
    );
});
