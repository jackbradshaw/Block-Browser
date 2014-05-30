'use strict';

/* Controllers */

angular.module('blockBrowser.controllers', [])
  .controller('BlockDetail', ['$scope', '$routeParams' ,'Blocks', function($scope, $routeParams, Blocks) {	
	
  	var block = Blocks.block($routeParams.block_hash);

	$scope.blockNotFound = false;

	block.then( 
		//block found
		function(result) { console.log(result); $scope.block =  result.data; },
		//block not found 
		function(reason) { $scope.blockNotFound = true }
	);
	
	console.log(block);	
  }])
  .controller('BlockList', ['$scope','$routeParams', 'Blocks', function($scope, $routeParams, Blocks) {				
		
		if($routeParams.block_hash)	
			var promise = Blocks.blockChain(10, $routeParams.block_hash);
		else
			promise =  Blocks.blockChain(10);			
		
		promise.then(function(result) { console.log(result); $scope.blocks =  result; });	
	
	 }])
	.controller('SearchController', ['$scope', '$location', 'Blocks', function($scope, $location, Blocks) {
		$scope.submit = function()
		{
			var hash = Blocks.getBlockHash($scope.searchInput);

			hash.then(function(result) { $location.path('/block/' + result); });	

			$scope.searchInput = "";		
		}			
	}]);
