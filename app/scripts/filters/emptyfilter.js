'use strict';

/**
 * @ngdoc filter
 * @name markovApp.filter:emptyFilter
 * @function
 * @description filter wich replaces empty string wit epsilon (ε)
 * # emptyFilter
 * Filter in the markovApp.
 */
 angular.module('markovApp')
 .filter('emptyFilter', function () {
 	return function (input) {
 		if (input === '') {
 			return 'ε';
 		} else {
 			return input;
 		}
 	};
 });
