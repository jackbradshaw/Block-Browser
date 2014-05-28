'use strict';

/* Controllers */

angular.module('blockBrowser.controllers', [])
  .controller('BlockDetail', ['$scope', '$routeParams' ,'Blocks', function($scope, $routeParams, Blocks) {
	
	var block =  Blocks.resource.get({block_hash: $routeParams.block_hash}, function(data)
	{
		console.log(data.tx[0].in[0].prev_out.hash == 0);
	});
	
	$scope.block = block;
	
	console.log(block);	
  }])
  .controller('BlockList', ['$scope','$routeParams', 'Blocks', function($scope, $routeParams, Blocks) {				
		
		if($routeParams.block_hash)	
			var promise = Blocks.blockChain(10, $routeParams.block_hash);
		else
			promise =  Blocks.blockChain(10);			
		
		promise.then(function(result) { $scope.blocks = result });
	 }])
	.controller('SearchController', ['$scope', '$location', function($scope, $location) {
		$scope.submit = function()
		{
			$location.path('/block/' + $scope.searchInput);
		}			
	}]);
