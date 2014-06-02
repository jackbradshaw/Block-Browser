'use strict';

/* Services */

var blockBrowserServices = angular.module('blockBrowser.services', ['ngResource']);
  
  
blockBrowserServices.factory('Blocks', ['$resource', '$http', '$q',
  function($resource, $http, $q){
  
	return new BlockService();
	
	function BlockService()
	{
		
			// this.resource =  $resource('/rawblock/:block_hash', {}, {		  
			//   query: {method:'GET', url:'/blocks/:time_in_milliseconds?format=json&cors=true'}
			// });	


			/**
			* Calucaltes the merkle tree for the block on the server
			**/
			this.merkleTree = function(block)
			{
				return $http.post('/merkleTree/', block);
			}

			/**
			*	Returns a Promise of a block hash for the given search term
			**/
			this.getBlockHash = function(searchTerm)
			{
				//BlockId is a hash return it:
				if(searchTerm.match('[a-e]+') != null)
					return $q.when(searchTerm);
				else
				{
					return $http({method:'GET', url: '/q/getblockhash/' + searchTerm}).then(
						function(result) { return result.data; },
						function(reason) { return searchTerm; } );
				}

			}

			this.block = function(blockHash)
			{
				return $http({method:'GET', url: '/rawblock/' + blockHash}).then(null, blockNotFound);				
			}

			function blockNotFound()
			{
				throw new Error('Block not found.');
			}

			
			this.blockChain = function(blocksToGet, startingBlockHash)
			{	
				var promise;
				var startAtLatestBlock = startingBlockHash == null;

				//If no starting hash provided, query for latest hash:
				if(startAtLatestBlock)
				{
					promise = $http({method:'GET', url: '/q/latesthash'});
				}
				//Otherwise, return the provided statingBlockHash as a promise:
				else
				{
					promise = $q.when({data: startingBlockHash});	
				}
				
				promise = promise.then(function(result) { 						
							return {
								nextHash: result.data,
								blocks: [],
								retry: startAtLatestBlock
							};
						}					
					);	
				
					for (var i = 0; i < blocksToGet; i++) 
					{
						promise = promise.then(function(obj)    
						{ 					
							console.log('obj: ' + obj);
							return $http({method:'GET', url: '/rawblock/' + obj.nextHash})
								.then(function(result) {
									obj.blocks.push(result.data);
									obj.nextHash = result.data.prev_block;								
									return obj;
								},
								//Fail
								function(reason)
								{										
									if(reason.status == 404 && obj.retry)
									{						
										obj.retry = false;								
										console.log('404');
										
										//return $q.when(100000000000000)
										return $http({method:'GET', url: '/q/getblockcount'})
										.then(function(result) {
											var height = result.data;
											return getHeadOfChain(height - 1, 3);
										});
									}
									else
									{
										throw new Error('Could not complete block chain.');
									}								
								}
							);
						}						
					); 
				}
		
			return promise.then(
				//Success		
				function(obj) {
					return obj.blocks;
				},
				//Failure
				function(reason) {
					console.log('fail');
					return $q.when([]); 
				}
			);


			function getHeadOfChain(height, retries)
			{
				return $http({method:'GET', url: '/q/getblockhash/' + height})
				.then(function(result) {
					var hash = result.data;				
					console.log('hash' + hash);
					return $http({method:'GET', url: '/rawblock/' + hash})					
					.then(
					//Success
					function(result) {						
						console.log('retried block ' + result.data.prev_block);
						return {
							nextHash: result.data.prev_block,
							blocks: new Array(result.data),
							retry: false
						};
					},
					//Fail
					function(reason)
					{	
						if(retries > 1)
						{
							return getHeadOfChain(height - 1, --retries);
						}
						else
						{
							throw new Error('Head of block chain not found after 3 attempts');	
						}
					})
				});												
			}		
		};
	}	
}]);

