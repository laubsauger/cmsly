var fs = require('fs');
var path = require('path');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

function getFiles(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isFile();
    });
}
        
module.exports = {
    loadComponentTemplate: function (name) {
        return fs.readFileSync(__dirname + '/../data/templates/components/' + name + '.html', 'utf-8');
    },
    
    loadPartialTemplate: function (name) {
        return fs.readFileSync(__dirname + '/../data/templates/partials/' + name + '.html', 'utf-8');
    },

    getComponentPartialsFileIndex: function(componentType) {
        return getFiles(__dirname + '/../data/templates/partials/' + componentType);
    },
    
    loadPageJson: function (path) {
        return JSON.parse(fs.readFileSync(__dirname + '/../data/pages/' + path + '/page.json', 'utf-8'));
    },
    
    loadHeader: function (path) {
        if (!path) {
            path = 'header';
        }
        
        return fs.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    loadFooter: function (path) {
        if (!path) {
            path = 'footer';
        }
        
        return fs.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    getPagesFolderIndex: function() {
        return getDirectories(__dirname + '/../data/pages');
    },
    
    createPublishRootFolder: function(publishTimestamp) {
        var path = __dirname + '/../output';
        
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        
        return fs.mkdirSync(path + '/' + publishTimestamp);
    },
    
    createPublishPageFolder: function(publishTimestamp, page) {
        return fs.mkdirSync(__dirname + '/../output/' + publishTimestamp + '/' + page);
    },
    
    writePageHtmlFile: function(publishTimestamp, page, pageHtml) {
        this.createPublishPageFolder(publishTimestamp, page);
        
        return fs.writeFileSync(__dirname + '/../output/' + publishTimestamp + '/' + page + '/' + 'index.html', pageHtml, 'utf-8');
    }
};