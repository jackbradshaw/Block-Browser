'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var blockBrowserServices = angular.module('blockBrowser.services', ['ngResource']);
  
  
blockBrowserServices.factory('Blocks', ['$resource',
  function($resource){
    return $resource('https://blockchain.info/rawblock/:block_hash?cors=true', {}, {
      //query: {method:'GET', url:'https://blockchain.info/blocks/:time_in_milliseconds?format=json&cors=true', isArray:true}
	  query: {method:'GET', url:'/blocks/:time_in_milliseconds?format=json&cors=true'}
    });
  }]);

