'use strict';


// Declare app level module which depends on filters, and services
angular.module('blockBrowser', [
  'ngRoute',
  'blockBrowser.filters',
  'blockBrowser.services',
  'blockBrowser.directives',
  'blockBrowser.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vis/', {templateUrl: 'partials/visualisation.html', controller: 'D3Visual'});
  $routeProvider.when('/:block_hash?', {templateUrl: 'partials/partial1.html', controller: 'BlockList'});
  $routeProvider.when('/block/:block_hash', {templateUrl: 'partials/partial2.html', controller: 'BlockDetail'});
  $routeProvider.when('/transaction/:transaction_hash', {templateUrl: 'partials/transactionVisual.html', controller: 'TransactionHistory'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
