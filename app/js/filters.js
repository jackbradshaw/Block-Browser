'use strict';

/* Filters */

angular.module('blockBrowser.filters', []).
  filter('millisecondsToDate', function() {
    return function(milliseconds) {
		//console.log(milliseconds);
		var date = new Date(milliseconds);
		//console.log(date);
        return date.getHours() + ':' + date.getMinutes() +  ':' + date.getSeconds();
    };
  });
