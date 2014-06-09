'use strict';

/* Controllers */

var controllers = angular.module('blockBrowser.controllers', []);

controllers
  .controller('BlockDetail', ['$scope', '$routeParams', '$location' ,'Blocks', function($scope, $routeParams, $location, Blocks) {	
	
  	getBlock($routeParams.block_hash);
	
	$scope.visualiseButtonClick = function(transactionHash)
	{
		$location.path('/transaction/' + transactionHash);		
	}

	$scope.verifyButtonClick = function()
	{
		$scope.verificationResult = null;

		Blocks.verify($scope.block).then
		(	
			//Success
			function(result)
			{
				console.log('Verification result', result);
				$scope.verificationResult = new VerificationResult(true, result.data);
			}
			, 
			//Failure
			function(reason)
			{
				$scope.verificationResult = new VerificationResult(false, false);
			}
		)
	}

	function getBlock(blockHash)
	{
		$scope.loading = true;

		var block = Blocks.block(blockHash);

		$scope.blockNotFound = false;

		block.then( 
			//block found
			function(result) { console.log('block', result); $scope.block =  result.data; },
			//block not found 
			function(reason) { $scope.blockNotFound = true }
		).finally(function() { $scope.loading = false;})
	}	

	function VerificationResult(success, result)
	{
		this.success = success;
		this.result = result;
	}	
}]);

controllers.controller('BlockList', ['$scope','$routeParams', 'Blocks', function($scope, $routeParams, Blocks) {		

	$scope.loading = true;
	if($routeParams.block_hash)	
		var promise = Blocks.blockChain(10, $routeParams.block_hash);
	else
		promise =  Blocks.blockChain(10);			
	
	promise.then(function(result) { console.log(result); $scope.blocks =  result; }).finally(function() { $scope.loading = false;});	
	
 }]);

controllers.controller('SearchController', ['$scope', '$location', 'Blocks', function($scope, $location, Blocks) {
	$scope.submit = function()
	{
		var hash = Blocks.getBlockHash($scope.searchInput);

		hash.then(function(result) { $location.path('/block/' + result); });	

		$scope.searchInput = "";		
	}			
}]);


//Transaction History:
controllers.controller('TransactionHistory', ['$scope', '$routeParams' ,'Transactions', function ($scope, $routeParams, Transactions) {

	var transactionId = $routeParams.transactionId;

	Transactions.getTransaction(transactionId).then(function(result)
	{
		console.dir(result);
		$scope.transaction = result;
	});
	
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

