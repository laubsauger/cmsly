var fileHelper = require('./app/fileHelper.js');
var pageRenderer = require('./app/pageRenderer.js');
var moment = require('moment');

var errors = 0;
var publishedPages = 0;

var pages = fileHelper.getPagesFolderIndex();
var publishTimestamp = moment().format('YYYYMMDD-HHmmss');

fileHelper.createPublishRootFolder(publishTimestamp);

for (var i=0; i<pages.length; i++) {
    try {
        var pageHtml = pageRenderer(pages[i]);
        fileHelper.writePageHtmlFile(publishTimestamp, pages[i], pageHtml);
        publishedPages++;
    } catch (e) {
        console.error('Error while creating page "' + pages[i], e);
        errors++;
    }
}

console.log('Publishing Job "' + publishTimestamp + '" finished. (Pages: ' + pages.length + ', Published: ' + publishedPages + ', Errors: ' + errors + ')');