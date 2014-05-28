'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var blockBrowserServices = angular.module('blockBrowser.services', ['ngResource']);
  
  
blockBrowserServices.factory('Blocks', ['$resource', '$http',
  function($resource, $http){
  
	return new BlockService();
	
	function BlockService()
	{
		this.resource =  $resource('/rawblock/:block_hash', {}, {
		  //query: {method:'GET', url:'https://blockchain.info/blocks/:time_in_milliseconds?format=json&cors=true', isArray:true}
		  query: {method:'GET', url:'/blocks/:time_in_milliseconds?format=json&cors=true'}
		});
		
		
		this.blockChain = function(blocksToGet, startingBlockHash)
		{	
			if(!startingBlockHash)
			{
				var hashPromise = $http({method:'GET', url: '/q/latesthash'});
				return hashPromise.then(function(result) { return promiseChain(blocksToGet, result.data); });				
			}
			return promiseChain(blocksToGet, startingBlockHash);
			
			function promiseChain(blocksToGet, hash)
			{
				var blocksLeft = blocksToGet;
				var blockChain = [];				
				return $http({method:'GET', url: '/rawblock/' + hash}).then(myThen);
				function myThen(block)
				{
					if(blocksLeft-- > 0)
					{
						blockChain.push(block.data);
						return $http({method:'GET', url: '/rawblock/' + block.data.prev_block}).then(myThen);									
					}else
					{
						return blockChain;
					}
				}
			};						
		};
	}	
  }]);

