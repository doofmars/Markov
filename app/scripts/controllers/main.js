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
    $scope.data = {alphabet: ['1', '2'], rules:[{from:'b',  terminating:false,  to:''}, { from:'a',  terminating:false,  to:'b'}], mode: ''};
    $scope.letter = '';
    $scope.ruleFrom = '';
    $scope.ruleTo = '';
    
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
    };
    
    $scope.addRule = function(element, keyevent) {
         //Only accept certain key events
         if (element !== undefined && keyevent !== undefined) {
            if (keyevent.which === 13) {
                //On key return either switch to "to rule" or add rule
                if (element === 'from') {
                    $('#ruleTo').focus();
                    return;
                }                 
            } else {
                return;
            }
        }
        //Disallow single space rule
        if ($scope.ruleFrom === ' ' || $scope.ruleTo === ' ' ) {
            return;
        }
        
        $scope.data.rules.push({from: $scope.ruleFrom, to: $scope.ruleTo, terminating: false});
        console.log('Added rule ' + $scope.ruleFrom  + '->' + $scope.ruleTo);
        
        $scope.ruleFrom = '';
        $scope.ruleTo = '';
        $('#ruleFrom').focus();
    };
});
