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
};

Forms.prototype.registerSaveButtonClickEvent = function(pageEditFormElement, buttonElement) {
    var self = this;

    buttonElement.addEventListener("click", function(e) {
        e.preventDefault();
        self.sendFormData(pageEditFormElement);
    });
};

Forms.prototype.sendFormData = function(pageEditFormElement) {
    console.log('parsing form');
    var formData = this.parseFormDataToJson(pageEditFormElement);

    console.log('sending data');
    console.log(formData);
};

Forms.prototype.parseFormDataToJson = function(pageEditFormElement) {
    var data = {};

    for (var i=0; i < pageEditFormElement.elements.length; i++) {
        var element = pageEditFormElement.elements[i];

        if (!element.hasAttribute('name')) {
            continue;
        }
        
        var keyPath = element.getAttribute('name').split('/');
        
        if (typeof data[keyPath[0]] === "undefined") {
            data[keyPath[0]] = [];
        }
        
        if (typeof data[keyPath[0]][keyPath[1]] === "undefined") {
            data[keyPath[0]][keyPath[1]] = {};
        }

        //@todo: handle manual overwriting 
        // don't save dynamically resolved values
        if (keyPath[2].indexOf('_') === 0) {
            data[keyPath[0]][keyPath[1]][keyPath[2]] = null;
        } else {
            data[keyPath[0]][keyPath[1]][keyPath[2]] = element.value;
        }
    }
    
    return data;
};

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




window.addEventListener('load', function() {
    console.log('forms - init');
    var cmslyForms = new Forms();
    var formElement = document.getElementById('pageEditForm');

    cmslyForms.registerInputTextChangeEvent(
        formElement,
        cmslyForms.updateComponentWithInputData
    );
    
    cmslyForms.registerInputTextFocusEvent(
        formElement
    );
    
    cmslyForms.registerSaveButtonClickEvent(
        formElement,
        document.getElementById('pageEditFormSaveButton')
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