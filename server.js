var http = require('http');https://cms-laubsauger.c9users.io/
var path = require('path');

var async = require('async');
var express = require('express');

var router = express();
var server = http.createServer(router);
var _ = require('lodash');

//--- app
var pageRenderer = require('./app/pageRenderer.js');
var dashboardRenderer = require('./app/dashboardRenderer.js');
var toolbarRenderer = require('./app/toolbarRenderer.js');
var fileHelper = require('./app/fileHelper.js');

router.use(express.static('public'));

// route dashboard
router.get('/', function(req, res) {
    var html = toolbarRenderer();
    html += dashboardRenderer();
    
    res.send(html);
    return;
});

router.get('/publish', function(req, res) {
    console.log('Starting publishing job via web')
    
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff'
    });
    
    res.write('Running command: node ' + path.resolve(__dirname, 'publish.js') + '\n');
    var exec = require('child_process').exec;
    var publishProcess = exec('node ' + path.resolve(__dirname, 'publish.js'));
    
    publishProcess.stdout.on('data', function(data) {
        res.write(data.toString() + '\n');
    });
    
    publishProcess.on('exit', function(data) {
        res.end('Finished\n');
    });
});

// route content
router.get('*', function (req, res) {
    console.log(req.path);
    var page = req.path.slice(1); 
    
    // get page by path
    if (_.indexOf(fileHelper.getPagesFolderIndex(), page) !== -1) {
        console.log('serving page: ' + page);
        var pageHtmlWithInjectedToolbar = pageRenderer(page, true);
        res.send(pageHtmlWithInjectedToolbar);
        return;
    }
    
    var errorMsg = 'Page "' + page + '" does not exist yet';
    console.error(errorMsg);
    res.send(errorMsg);
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
