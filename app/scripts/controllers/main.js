'use strict';

/**
 * @ngdoc function
 * @name markovApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the markovApp
 */
 angular.module('markovApp')
 .controller('MainCtrl', function ($scope) {
    $scope.data = {alphabet: ['1', '2'], rules:{}, mode: ''};
    $scope.letter = '';
    
    $scope.addLetter = function(keyevent) {
        //Only accept return key events
        if (keyevent !== undefined) {
            if (keyevent.which !== 13) {
                return;
            }
        }
        //Disallow empty or single space words
        if ($scope.letter === '' || $scope.letter === ' ') {
            $scope.letter = '';
            return;
        }
        //Test if letter is already in alphabet
        if ($.inArray($scope.letter, $scope.data.alphabet) < 0) {
            $scope.data.alphabet.push($scope.letter);
            console.log('Added ' + $scope.letter + ' to the alphabet');
        } else {
            console.log('Letter already in alphabet');
        }
        $scope.letter = '';
        console.log($scope.data);
    };
 });
