'use strict';

/* Controllers */

angular.module('blockBrowser.controllers', [])
  .controller('BlockDetail', ['$scope', '$routeParams' ,'Blocks', function($scope, $routeParams, Blocks) {
	
	var block =  Blocks.get({block_hash: $routeParams.block_hash});
	
	$scope.block = block;
	
	console.log(block);
  }])
  .controller('BlockList', ['$scope','$routeParams', 'Blocks', function($scope, $routeParams, Blocks) {
		
		if($routeParams.date)			
			var d = new Date(parseInt($routeParams.date))
		else
			d = new Date();
			
		var time_in_milliseconds = d.getTime();
		
		var yesterday = new Date(), tomorrow = new Date();
		yesterday.setDate(d.getDate() - 1);
		tomorrow.setDate(d.getDate() + 1);
		
		$scope.yesterday = yesterday.getTime();
		$scope.date = d.toDateString();
		$scope.tomorrow = tomorrow.getTime();

		var queryResult = Blocks.query({time_in_milliseconds: time_in_milliseconds}, function(result)
		{
			$scope.blocks = result.blocks;	
			console.log($scope.blocks);			
		});	
	 }])
	.controller('SearchController', ['$scope', '$location', function($scope, $location) {
		$scope.submit = function()
		{
			$location.path('/block/' + $scope.searchInput);
		}			
	}]);
