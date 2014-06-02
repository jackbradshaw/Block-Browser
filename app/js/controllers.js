'use strict';

/* Controllers */

var controllers = angular.module('blockBrowser.controllers', []);

controllers
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

	// D3 Visualisation:
	controllers.controller('D3Visual', ['$scope', '$routeParams' ,'Blocks', function ($scope, $routeParams, Blocks) {
		  
		  //var block = Blocks.block($routeParams.block_hash);

		  var block = Blocks.block('000000000000000063be697bdeaa662587226ca7648aeed64a324d7cef936ccd');

			$scope.blockNotFound = false;

			block.then( 
				//block found
				function(result) {  Blocks.merkleTree(result.data).then(function(result) { $scope.merkleTree = result.data.tree; console.dir(result.data.tree);} );}
				//block not found 
				
			);
		}]);

