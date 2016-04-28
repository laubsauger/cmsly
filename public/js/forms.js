var Forms = function() {};

Forms.prototype.registerInputTextChangeEvent = function(pageEditFormElement) {
    var self = this;
    pageEditFormElement.addEventListener("keyup", function(e) {
    	if(e.target && e.target.nodeName === 'INPUT' && e.target.getAttribute('type') === 'text') {
    	    var input = e.target;
    	    console.log(input);
    	    self.updateComponentsWithInputData(input);
    	}
    });
};

Forms.prototype.updateComponentsWithInputData = function(input) {
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
    switch (componentField) {
        case 'text':
            componentElement.textContent = input.value;
            break;
        case 'title':
            componentElement.title = input.value;
            break;
        case 'image':
        case 'link':
            componentElement.href = input.value;
            break;
        default:
            console.error('Unhandled componentField', componentField);
            break;
    }
};

var cmslyForms = new Forms();

window.addEventListener('load', function() {
    console.log('forms - init');
    console.log(document.getElementById('pageEditForm'));
    
    cmslyForms.registerInputTextChangeEvent(
        document.getElementById('pageEditForm'),
        cmslyForms.updateComponentWithInputData
    );
});
