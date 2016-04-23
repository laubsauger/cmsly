var http = require('http');
var path = require('path');
var fs = require('fs');

var async = require('async');
var express = require('express');
var Handlebars = require('handlebars');

var router = express();
var server = http.createServer(router);

//--- app
var fileHelper = require('./fileHelper.js');
var componentRenderer = require('./componentRenderer.js');

router.use(function(req, res){
  var page = 'home';
  var pageJson = fileHelper.loadPageJson(page);
  var html = '';
  
  html += fileHelper.loadHeader(pageJson.header || '');
    
  for(var item in pageJson.components) {
    html += componentRenderer(pageJson.components[item]);
  }

  html += fileHelper.loadFooter(pageJson.footer || '');

  res.send(html);
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
