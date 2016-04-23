var http = require('http');
var path = require('path');
var fs = require('fs');

var async = require('async');
var express = require('express');
var Handlebars = require('handlebars');

var router = express();
var server = http.createServer(router);

function loadComponentTemplate(name) {
  return fs.readFileSync(__dirname + '/data/templates/components/' + name + '.html', 'utf-8');
}

function loadPartialTemplate(name) {
  return fs.readFileSync(__dirname + '/data/templates/partials/' + name + '.html', 'utf-8');
}

function loadContentJson(path) {
  return JSON.parse(fs.readFileSync(__dirname + '/data/content/' + path + '/page.json', 'utf-8')).components;
}

function loadHeader(path) {
  return fs.readFileSync(__dirname + '/data/content/' + path + '/header.html', 'utf-8');
}

function loadFooter(path) {
  return fs.readFileSync(__dirname + '/data/content/' + path + '/footer.html', 'utf-8');
}

// compile handlebars templates, map data to compiled template
function buildHtml(template, data) {
  var compiledTemplate = Handlebars.compile(template);

  return compiledTemplate(data);
}

//lookup partials for this component type and register them
function registerComponentPartials(componentType) {
  var partials = fs.readdirSync(__dirname + '/data/templates/partials/' + componentType);

  for (var i = 0; i < partials.length; i++) {
    var partialName = partials[i].split(".").slice(0, -1).join(".");
    var partialContent = loadPartialTemplate(componentType + '/' + partialName);
    
    Handlebars.registerPartial(partialName, partialContent);
  }
}

// load component template, register template partials, map data, return html
function buildComponentHtml(component) {
  var componentTemplate = loadComponentTemplate(component.type + '/' + component.type);
  
  registerComponentPartials(component.type);

  return buildHtml(componentTemplate, component.content);
}

router.use(function(req, res){
  var page = 'home';
  var components = loadContentJson(page);
  var html = '';
  
  html += loadHeader(page);
    
  for(var item in components) {
    html += buildComponentHtml(components[item]);
  }

  html += loadFooter(page);

  res.send(html);
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
