var connect = require('connect');
var http = require('http');
var proxyServer = require('http-route-proxy');

var url = require('url');
var proxy = require('proxy-middleware');

var app = connect()
  .use(connect.logger('dev'))
			
			
	//app.use('/blocks', proxy(url.parse('https://blockchain.info/blocks')));
	app.use('/rawblock', proxy(url.parse('http://blockexplorer.com/rawblock')));
	app.use('/q', proxy(url.parse('http://blockexplorer.com/q')));
	app.use(connect.static('.'));
http.createServer(app).listen(9000);