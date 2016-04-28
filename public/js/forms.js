var Forms = function() {};

Forms.prototype.registerInputTextChangeEvent = function(pageEditFormElement) {
    var self = this;
    pageEditFormElement.addEventListener("keyup", function(e) {
        console.log('keyup')
    	if(e.target && e.target.nodeName === 'INPUT' && e.target.getAttribute('type') === 'text') {
    	    var input = e.target;
    	    console.log(input)
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
    //@todo: handling for dynamic fields
    if (componentField.indexOf('__') !== -1) {
        componentFieldType = componentField.split('__')[0];
    }
    
    console.log(componentFieldType)
    switch (componentFieldType) {
        case 'text':
            componentElement.textContent = input.value;
            break;
        case 'title':
            componentElement.title = input.value;
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

var cmslyForms = new Forms();

window.addEventListener('load', function() {
    console.log('forms - init');

    cmslyForms.registerInputTextChangeEvent(
        document.getElementById('pageEditForm'),
        cmslyForms.updateComponentWithInputData
    );
});
