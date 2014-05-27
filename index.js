var connect = require('connect');
var http = require('http');
var proxyServer = require('http-route-proxy');

var url = require('url');
var proxy = require('proxy-middleware');

var app = connect()
  .use(connect.logger('dev'))
  

  /*
  proxyServer.proxy([
	{
			from: 'localhost:9000',
			to: 'blockchain.info',
			https: true,
			route: ['/'],
			headers: {
				req: {origin: 'blockchain.info', referer: 'https://blockchain.info'},
				res: {'access-control-allow-origin': 'https://blockchain.info', 'access-control-allow-credentials': true}
			}
		}
  ]);
  */
  
  // app.use(proxyServer.connect(
		// {			
			// to: 'blockchain.info',
			// //from:'localhost:9000/blocks',
			// //to:'localhost:9000',
			// https: true,
			// route: ['/', '!/app']
			
			// /*
			// route: [
            // {
                // action: '/',
                // forward: 'localhost:9000',
                // headers: {
                    // req: {origin: 'blockchain.info'}
                // }
            // },
			// {
                // action: '/blocks',
                // forward: 'blockchain.info',
                // headers: {
                    // req: {origin: 'blockchain.info'}
                // }
            // }]*/
			
							
		// }
	// ));	
	

	/*,
			headers: {
							req: {origin: 'blockchain.info', referer: 'blockchain.info'},
							res: {'access-control-allow-origin': 'https://blockchain.info', 'access-control-allow-credentials': true}
					}		
			*/	

			
			
			
			app.use('/blocks', proxy(url.parse('https://blockchain.info/blocks')));
			app.use(connect.static('.'));
http.createServer(app).listen(9000);