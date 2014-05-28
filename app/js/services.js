'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var blockBrowserServices = angular.module('blockBrowser.services', ['ngResource']);
  
  
blockBrowserServices.factory('Blocks', ['$resource', '$http', '$q',
  function($resource, $http, $q){
  
	return new BlockService();
	
	function BlockService()
	{
		this.resource =  $resource('/rawblock/:block_hash', {}, {		  
		  query: {method:'GET', url:'/blocks/:time_in_milliseconds?format=json&cors=true'}
		});		
		
		this.blockChain = function(blocksToGet, startingBlockHash)
		{	
			var promise;
			if(startingBlockHash == null)
			{
				promise = $http({method:'GET', url: '/q/latesthash'})
					
			}else
			{
				promise = $q.when(undefined);	
			}
			
			promise = promise.then(function(result) { 						
						return {
							nextHash: result.data === undefined ? startingBlockHash : result.data,
							blocks: []
						};
					});	
			
			for (var i = 0; i < blocksToGet; i++) {
				promise = promise.then(function(obj) { 
						return $http({method:'GET', url: '/rawblock/' + obj.nextHash})
							.then(function(result) {
								obj.blocks.push(result.data);
								obj.nextHash = result.data.prev_block;
								return obj;
							});
					});
			}
			
			return promise.then(function(obj) {
				return obj.blocks;
			});


			
			if(!startingBlockHash)
			{
				var hashPromise = $http({method:'GET', url: '/q/latesthash'});
				return hashPromise.then(function(result) { return promiseChain(blocksToGet, result.data); });				
			}
			return promiseChain(blocksToGet, startingBlockHash);
			
			function promiseChain(blocksToGet, hash)
			{
				var blocksLeft = blocksToGet - 1;
				var blockChain = [];				
				return $http({method:'GET', url: '/rawblock/' + hash}).then(myThen);
				
				function myThen(block)
				{
					//Add block to array:
					blockChain.push(block.data);
					
					//If we need to get more blocks add another block promise to the end of the promise chain and recurse:
					if(blocksLeft-- > 0)
					{						
						return $http({method:'GET', url: '/rawblock/' + block.data.prev_block}).then(myThen);										
					}
					//The final promise on the chain returns the full array:
					else
					{
						return blockChain;
					}
				}
			};		
		};
	}	
  }]);

