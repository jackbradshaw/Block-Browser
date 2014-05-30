'use strict';

/* Filters */

angular.module('blockBrowser.filters', []).
  filter('millisecondsToDate', function() {
    return function(milliseconds) {
		//console.log(milliseconds);
		var date = new Date(milliseconds*1000);
		//console.log(date);
        return date.getHours() + ':' + date.getMinutes() +  ':' + date.getSeconds();
    };
  })
  .filter('scriptPubKeyHash', function() {
	return function(pubkey)	{
		return pubkey.split(' ')[2];
	}
  });
