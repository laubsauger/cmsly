var fse = require('fs-extra');
var path = require('path');

/**
 * get directories in path, return empty array if none found
 * @returns array
 */
function getDirectories(srcpath) {
    try {
        return fse.readdirSync(srcpath).filter(function(file) {
            return fse.statSync(path.join(srcpath, file)).isDirectory();
        });
    } catch (e) {
        return [];
    }
}

/**
 * get files in path, return empty array if none found
 * @returns array
 */
function getFiles(srcpath) {
    try {
        return fse.readdirSync(srcpath).filter(function(file) {
            return fse.statSync(path.join(srcpath, file)).isFile();
        }); 
    } catch (e) {
        return [];
    }
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
    
    loadContent: function (path) {
        if (!path) {
            path = 'content';
        }
        
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '/content.html', 'utf-8');
    },
    
    loadContentTopSection: function (path) {
        if (!path) {
            path = 'content_top';
        }
        
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    loadContentBottomSection: function (path) {
        if (!path) {
            path = 'content_bottom';
        }
        
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    loadPageTopSection: function () {
        var path = 'page_top';
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    loadPageBottomSection: function () {
        var path = 'page_bottom';
        return fse.readFileSync(__dirname + '/../data/pages/' + path + '.html', 'utf-8');
    },
    
    
    /**
     * returns subdirectories of pages directory as array
     * @returns array
     */
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
    
    copyPublishResult: function(publishTimestamp, targetPath) {
        fse.copySync(__dirname + '/../output/' + publishTimestamp, targetPath);
    },
    
    loadToolbarTemplate: function() {
        return fse.readFileSync(__dirname + '/../app/templates/toolbar/toolbar.html', 'utf-8');
    },
    
    loadDashboardTemplate: function() {
        return fse.readFileSync(__dirname + '/../app/templates/dashboard.html', 'utf-8');
    }
};