var connect = require('connect');
var http = require('http');
var proxyServer = require('http-route-proxy');
var rest = require('connect-rest');

var merkleTree = require('./merkleTree');

var url = require('url');
var proxy = require('proxy-middleware');

var app = connect()
  .use(connect.logger('dev'))
			
			
	//app.use('/blocks', proxy(url.parse('https://blockchain.info/blocks')));
	app.use('/rawblock', proxy(url.parse('http://blockexplorer.com/rawblock')));
	app.use('/rawtx', proxy(url.parse('http://blockexplorer.com/rawtx')));
	app.use('/q', proxy(url.parse('http://blockexplorer.com/q')));
	app.use(connect.static('.'));

	//uses for rest:
	app.use( connect.query() )   
    .use( connect.urlencoded() )
    .use( connect.json() )

	app.use( rest.rester() )

	rest.post('/merkleTree/', test );

	function test(request, content)
	{
		var block = content;
		var tree = merkleTree.tree(block);

		return { tree : tree };
	}

http.createServer(app).listen(9000);