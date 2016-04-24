var fse = require('fs-extra');
var path = require('path');

function getDirectories(srcpath) {
    return fse.readdirSync(srcpath).filter(function(file) {
        return fse.statSync(path.join(srcpath, file)).isDirectory();
    });
}

function getFiles(srcpath) {
    return fse.readdirSync(srcpath).filter(function(file) {
        return fse.statSync(path.join(srcpath, file)).isFile();
    });
}
        
module.exports = {
    loadComponentTemplate: function (name) {
        return fse.readFileSync(__dirname + '/../data/templates/components/' + name + '.html', 'utf-8');
    },
    
    loadPartialTemplate: function (name) {
        return fse.readFileSync(__dirname + '/../data/templates/partials/' + name + '.html', 'utf-8');
    },

    getComponentPartialsFileIndex: function(componentType) {
        return getFiles(__dirname + '/../data/templates/partials/' + componentType);
    },
    
    loadPageJson: function (path) {
        return JSON.parse(fse.readFileSync(__dirname + '/../data/pages/' + path + '/page.json', 'utf-8'));
    },
    
    loadHeader: function (path) {
        if (!path) {
            path = 'header';
        }
        
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    loadFooter: function (path) {
        if (!path) {
            path = 'footer';
        }
        
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    getPagesFolderIndex: function() {
        return getDirectories(__dirname + '/../data/pages');
    },
    
    createPublishRootFolder: function(publishTimestamp) {
        var path = __dirname + '/../output';
        
        if (!fse.existsSync(path)){
            fse.mkdirSync(path);
        }
        
        return fse.mkdirSync(path + '/' + publishTimestamp);
    },
    
    createPublishPageFolder: function(publishTimestamp, page) {
        return fse.mkdirSync(__dirname + '/../output/' + publishTimestamp + '/' + page);
    },
    
    writePageHtmlFile: function(publishTimestamp, page, pageHtml) {
        this.createPublishPageFolder(publishTimestamp, page);
        
        return fse.writeFileSync(__dirname + '/../output/' + publishTimestamp + '/' + page + '/' + 'index.html', pageHtml, 'utf-8');
    },
    
    copyPublishResultToTmp: function(publishTimestamp) {
        fse.copySync(__dirname + '/../output/' + publishTimestamp, './tmp/');
    }
};