var Forms = function() {};

Forms.prototype.registerInputTextChangeEvent = function(pageEditFormElement) {
    var self = this;
    pageEditFormElement.addEventListener("keyup", function(e) {
    	if(e.target && e.target.nodeName === 'INPUT' && e.target.getAttribute('type') === 'text') {
    	    var input = e.target;
    	    self.updateComponentsWithInputData(input);
    	}
    });
};

Forms.prototype.updateComponentsWithInputData = function(input) {
    // is dynamic data resolver -> do that
    if (!input.hasAttribute('data-cmsly-selector')) {
        console.log('dynamic data resolver', input);
        return;
    }
    
    var cmslySelector = input.getAttribute('data-cmsly-selector');
    var cmslySelectorSegments = cmslySelector.split('/');
    var componentType = cmslySelectorSegments[0];
    var componentField = cmslySelectorSegments[2];
    
    var componentElements = document.querySelectorAll('[data-cmsly-target*="'+cmslySelector+'"]');

    for(var i=0; i<componentElements.length; i++) {
        this.updateComponent(componentElements[i], componentField, input);
    }
};

Forms.prototype.updateComponent = function(componentElement, componentField, input) {
    console.log('updating component', {'componentElement': componentElement, 'componentField': componentField, 'value': input.value});
    
    var componentFieldType = componentField;
    if (componentField.indexOf('__') !== -1) {
        componentFieldType = componentField.split('__')[0];
    }
    
    switch (componentFieldType) {
        case 'text':
            componentElement.textContent = input.value;
            break;
        case 'title':
            componentElement.title = input.value;
            break;
        case 'alt':
            componentElement.alt = input.value;
            break;
        case 'bg_image':
            componentElement.style = 'background-image:url("'+input.value+'");';
            break;
        case 'image':
        case 'linkHref':
            componentElement.href = input.value;
            break;
        case 'linkTarget':
            componentElement.target = input.value;
            break;
        default:
            console.error('Unhandled componentFieldType', componentFieldType);
            break;
    }
};

Forms.prototype.registerInputTextFocusEvent = function(pageEditFormElement) {
    var self = this;

    pageEditFormElement.addEventListener("focus", function(e) {
    	if(e.target && e.target.nodeName === 'INPUT' && e.target.getAttribute('type') === 'text') {
    	    var input = e.target;
	        self.toggleOverlayOnCurrentElement(input, true);
    	}
    }, true);
    
    pageEditFormElement.addEventListener("blur", function(e) {
    	if(e.target && e.target.nodeName === 'INPUT' && e.target.getAttribute('type') === 'text') {
    	    var input = e.target;
	        self.toggleOverlayOnCurrentElement(input, false);
    	}
    }, true);
}

Forms.prototype.toggleOverlayOnCurrentElement = function(input, show) {
    var overlayClass = 'cmsly-overlay';
    
    if (!show) {
        var overlays = document.querySelectorAll('.' + overlayClass);
        
        for(var i=0; i<overlays.length; i++) {
            overlays[i].remove();
        }
    } else {
        var cmslySelector = input.getAttribute('data-cmsly-selector');
        var componentDomElements = document.querySelectorAll('[data-cmsly-target*="'+cmslySelector+'"]');
        
        for(var j=0; j<componentDomElements.length; j++) {
            var rootComponent = closest(componentDomElements[j], '[data-cmsly-component-root]');
            var parent = closest(componentDomElements[j], '[data-cmsly-item-root]');
            
            if (parent) {
                this.createOverlay(parent, overlayClass, true, false);
            }
            
            if(rootComponent) {
                this.createOverlay(rootComponent, overlayClass, false, true);
            }
            
            this.createOverlay(componentDomElements[j], overlayClass, false, false);
        }
    }
}

Forms.prototype.createOverlay = function(componentDomElement, overlayClass, isItemRoot, isComponentRoot) {
    var overlay = document.createElement('div');
    var componentDomDimension = componentDomElement.getBoundingClientRect();

    if (isItemRoot) {
        overlay.setAttribute('class', overlayClass + ' ' + overlayClass + '__item__root');
    } else if (isComponentRoot) {
        overlay.setAttribute('class', overlayClass + ' ' + overlayClass + '__root');
    } else {
        overlay.setAttribute('class', overlayClass);
    }

    overlay.style.top = (window.scrollY + componentDomDimension.top) + 'px';
    overlay.style.left = (window.scrollX + componentDomDimension.left) + 'px';
    overlay.style.width = (componentDomDimension.width) + 'px';
    overlay.style.height = (componentDomDimension.height) + 'px';
    
    document.body.appendChild(overlay);
}


var cmslyForms = new Forms();

window.addEventListener('load', function() {
    console.log('forms - init');
    var formElement = document.getElementById('pageEditForm');

    cmslyForms.registerInputTextChangeEvent(
        formElement,
        cmslyForms.updateComponentWithInputData
    );
    
    cmslyForms.registerInputTextFocusEvent(
        formElement
    );
});

function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    // traverse parents
    while (el!==null) {
        parent = el.parentElement;
        if (parent!==null && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}