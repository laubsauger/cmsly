var moment = require('moment');

var fileHelper = require('./app/fileHelper.js');
var pageRenderer = require('./app/pageRenderer.js');
var versionControl = require('./app/versionControl.js');

var errors = 0;
var publishedPages = 0;

var pages = fileHelper.getPagesFolderIndex();
var publishTimestamp = moment().format('YYYYMMDD-HHmmss');

console.log('Starting publishing job "' + publishTimestamp + '"');

fileHelper.createPublishRootFolder(publishTimestamp);

console.log(' - Publishing ' + pages.length + ' pages');

for (var i=0; i<pages.length; i++) {
    try {
        console.log(' -- Publishing page: "' + pages[i]);
        var pageHtml = pageRenderer(pages[i]);
        fileHelper.writePageHtmlFile(publishTimestamp, pages[i], pageHtml);
        publishedPages++;
    } catch (e) {
        console.error('Error while creating page "' + pages[i], e);
        errors++;
    }
}

console.log('Publishing job "' + publishTimestamp + '" finished. (Pages: ' + pages.length + ', Published: ' + publishedPages + ', Errors: ' + errors + ')');

console.log('Starting version control for publishing result "' + publishTimestamp + '"');
versionControl.createNewRelease(publishTimestamp);