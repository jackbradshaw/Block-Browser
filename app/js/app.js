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
  $routeProvider.when('/:date?', {templateUrl: 'partials/partial1.html', controller: 'BlockList'});
  $routeProvider.when('/block/:block_hash', {templateUrl: 'partials/partial2.html', controller: 'BlockDetail'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
