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
    $scope.data = 
    {alphabet: ['1', '2', '3', '4'], 
        rules:[
            {from:'3',  terminating:false,  to:'4'},
            {from:'2',  terminating:true,  to:'3'}, 
            {from:'1',  terminating:false,  to:'2'} 
        ], mode: 'markov', maxIterations: 100,
    input: '123'};
    $scope.letter = '';
    $scope.ruleFrom = '';
    $scope.ruleTo = '';
    $scope.results = [];
    
    $scope.addLetter = function(keyevent) {
        //Only accept return key events
        if (keyevent !== undefined) {
            if (keyevent.which !== 13) {
                return;
            }
        }
        //Disallow empty words
        if ($scope.letter === '') {
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
    
    $scope.letterUsed = function(letter) {
        for (var i = 0; i < $scope.data.rules.length; i++) {
            var rule = $scope.data.rules[i];
            if (getIndicesOf(letter, rule.from).length > 0 || getIndicesOf(letter, rule.to).length > 0) {
                return 'btn-success';
            }
        }
        return 'btn-warning';
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
        //Disallow empty to empty space rule
        if ($scope.ruleFrom === '' && $scope.ruleTo === '' ) {
            return;
        }
        
        $scope.data.rules.push({from: $scope.ruleFrom, to: $scope.ruleTo, terminating: false});
        console.log('Added rule "' + $scope.ruleFrom  + '"->"' + $scope.ruleTo + '"');
        
        $scope.ruleFrom = '';
        $scope.ruleTo = '';
        $('#ruleFrom').focus();
    };
    
    $scope.dragControlListeners = {
        accept: function () {
            return true;
        } //override to determine drag is allowed or not. default is true.
    };
    
    $scope.runAutomat = function(keyevent) {
        //Only accept return key events
        if (keyevent !== undefined) {
            if (keyevent.which !== 13) {
                return;
            }
        }
        //Disallow empty input
        if ($scope.data.input === '') {
            return;
        }
        if ($scope.data.mode === 'markov') {
            var terminatedByRule = runMarkov();
            
            if (terminatedByRule > 0) {
                $scope.results.push({display: 'End1: Terminating rule', used: terminatedByRule});
            } else if (terminatedByRule < 0){
                $scope.results.push({display: 'End2: No rule executable', used: terminatedByRule});
            } else {
                $scope.results.push({display: 'End3: Max iterations reached', used: terminatedByRule});
            }
        } else if ($scope.data.mode === 'semithue') {
            runSemiThue();
        }
        
    };
    
    function runMarkov() {
        $scope.results = [];
        $scope.results.push({display: $scope.data.input, used: '-'});
        var maxIt = $scope.data.maxIterations;
        var current = $scope.data.input;
        
        for (var i = 0; i < maxIt; i++) {
            var ruleExecutedFlag = false;
            
            for (var j = 0; j < $scope.data.rules.length; j++) {
                var fromRule = $scope.data.rules[j].from;
                var toRule = $scope.data.rules[j].to;
                var terminatingRule = $scope.data.rules[j].terminating;
                
                var indices = getIndicesOf(fromRule, current);
                if (indices.length > 0) {
                    var partA = current.substr(0, indices[0]);
                    var partB = current.substr(indices[0] + fromRule.length);
                    
                    current = partA + toRule + partB;
                    $scope.results.push({display: partA + '<b>' +  toRule + '</b>' + partB, used: j + 1});
                    if (terminatingRule) {
                        return i + 1;
                    }
                    ruleExecutedFlag = true;
                    break;        
                }
            }
            
            if (!ruleExecutedFlag) {
                break;
            }
        }
        console.log(i + ' ## ' + maxIt);
        return i - maxIt;
    }
    
    function runSemiThue() {
        
    }
    
    //function to find occurrences of an substring within a string, returns an array with position 
    function getIndicesOf(searchStr, str) {
        var startIndex = 0;
        var index;
        var indices = [];

        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + 1;
        }
        return indices;
    }
});
