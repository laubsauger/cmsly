var fs = require('fs');

module.exports = {
    loadComponentTemplate: function (name) {
      return fs.readFileSync(__dirname + '/data/templates/components/' + name + '.html', 'utf-8');
    },
    
    loadPartialTemplate: function (name) {
      return fs.readFileSync(__dirname + '/data/templates/partials/' + name + '.html', 'utf-8');
    },
    
    getComponentPartialsFolderIndex: function(componentType) {
        return fs.readdirSync(__dirname + '/data/templates/partials/' + componentType);
    },
    
    loadPageJson: function (path) {
      return JSON.parse(fs.readFileSync(__dirname + '/data/content/' + path + '/page.json', 'utf-8'));
    },
    
    loadHeader: function (path) {
      if (!path) {
        path = 'header';
      }
      
      return fs.readFileSync(__dirname + '/data/content/' + path + '.html', 'utf-8');
    },
    
    loadFooter: function (path) {
      if (!path) {
        path = 'footer';
      }
      
      return fs.readFileSync(__dirname + '/data/content/' + path + '.html', 'utf-8');
    }
};