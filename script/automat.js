/*!
 * Markov | Semi Thue machine simulator
 * https://github.com/doofmars/Markov
 *
 * Copyright 2014 Jan Preuss
 * www.doofmars.de
 * 
 * Released under the MIT license
 *
 */


function init() {
	//Return trigger für inAlphabet Eingabe
	$('#inAlphabet').keypress(function(e){ 
	    if(e.which == 13){//Enter key pressed
	    	addAlphabet();
	    }
	});
	
	//Return trigger für inAlphabet Eingabe
	$('#inRuleB').keypress(function(e){ 
		if(e.which == 13){//Enter key pressed
			addRule();
			$('#inRuleA').focus();
		}
	});

	//Return trigger für inRun Eingabe
	$('#inRun').keypress(function(e){ 
		if(e.which == 13){//Enter key pressed
			run();
		}
	});
	
	//call Switch mode on radio select
	$( "input[type=radio][name=selector]" )
	.change(
		function () { 
			switchMode();
		}
	).change();
	
	$('#iterations').val('100');
	
	$( "#theRules" ).sortable();
	$( "#theRules" ).disableSelection();

}

//data object
var data = {
		"markov":false,
		"alphabet":[],
		"productionRuleA":[],
		"productionRuleB":[]
};

//function called on switch mode
function switchMode() {
	if (data.markov) {
		data.markov = false;
	} else {		
		data.markov = true;
	}
	$('.aRule').each(function( index ){
		if ( data.markov ) {
			$(this).children('input').css('visibility', 'visible');			
		} else {
			$(this).children('input').css('visibility', 'hidden');
		}
	});
	console.log("modeSwitched");
	$('#theRun').html('');	
}

//add letter to alphabet
function addAlphabet() {
	var letter = $('#inAlphabet').val();
	if (letter != "") {
		data.alphabet.push(letter);
		var newLetter = $('<div>')
			.html(letter)
			.attr('class','aLetter').attr('id', data.alphabet.length)
			.attr('data-k1',letter);
		$('<a>')
			.html('X')
			.attr('title','Click to delete ' + letter)
			.click(
					function(){ 
						deleteLetter($(this).parent().attr('data-k1'));
						$(this).parent().remove();
						}
					)
			.appendTo(newLetter);
		$('#theAlphabet').append(newLetter);
		$('#inAlphabet').val('');
		checkLetter();
		checkRule();
	}
}

//add a new rule
function addRule() {
	var ruleA = $('#inRuleA').val();
	var ruleB = $('#inRuleB').val();
	if (ruleA != "" || ruleB != "") {
		data.productionRuleA.push(ruleA);
		data.productionRuleB.push(ruleB);
		
		var newRule = $('<div>')
			.html(checkForE(ruleA) + "→" + checkForE(ruleB))
			.attr('class','aRule')
			.attr('id',data.productionRuleA.length)
			.attr('data-k1',ruleA)
			.attr('data-k2',ruleB);
		$('<a>')
			.html('X')
			.attr('title','Click to delete ' + checkForE(ruleA) + "→" + checkForE(ruleB))
			.click(
					function(){ 
						deleteRule( $(this).parent().attr('data-k1'), $(this).parent().attr('data-k2') );
						$(this).parent().remove();
						}
					)
			.appendTo(newRule);
		var terminating = $('<input>')
			.attr('type','checkbox')
			.attr('title','Set Terminating')
			.attr('class','terminator')
			.appendTo(newRule);
		if (data.markov) {
			terminating.css('visibility', 'visible');
		} else {			
			terminating.css('visibility', 'hidden');
		}
		$('#theRules').append(newRule);
		$('#inRuleA').val('');
		$('#inRuleB').val('');
		checkLetter();
		checkRule();
	}
}

//checks for each letter if it is used in production rule
function checkLetter() {
	$('.aLetter').each(function( index ){
			if ( checkSingleLetter($(this))) {
				$(this).css('background-color', '#D3E992')
				.attr('title','');				
			} else {
				$(this).css('background-color', '#FFAFAF')
				.attr('title','This character is currently not used');	
			}
		});
}

//checks if single letter is used in production rule
function checkSingleLetter(context) {
	var part = context.attr('data-k1');
	for ( var i = 0; i < data.productionRuleA.length; i++) {
		for ( var k = 0; k < data.productionRuleA[i].length; k++) {
			if (part === data.productionRuleA[i][k]){
				return true;
			}	
		}
	}
	for ( var i = 0; i < data.productionRuleB.length; i++) {
		for ( var k = 0; k < data.productionRuleB[i].length; k++) {
			if (part === data.productionRuleB[i][k]){
				return true;
			}	
		}
	}
	return false;
}

//function to delete an letter
function deleteLetter(letter) {
	for ( var i = 0; i < data.alphabet.length; i++) {
		if (letter === data.alphabet[i]) {
			data.alphabet.splice(i, 1);
			checkLetter();
			checkRule();
			return;
		}
	}
}

//checks for each production rule if it is used in alphabet
function checkRule() {
	$('.aRule').each(function( index ){
		if (checkSingleRule($(this), 'data-k1') &&
			checkSingleRule($(this), 'data-k2')	) {			
			$(this).css('background-color', '#D3E992');				
		} else {
			$(this).css('background-color', '#FFAFAF');	
		}
		});
}

//checks if single production rule is used in alphabet
function checkSingleRule(context, dataValue) {
	var part = context.attr(dataValue);
	for ( var i = 0; i < part.length; i++) {
		if ( $.inArray(part[i], data.alphabet) === -1 ){
			return false;
		}	
	}
	return true;
}

//function to delete rule
function deleteRule(ruleA, ruleB) {
	for ( var i = 0; i < data.productionRuleA.length; i++) {
		if (ruleA === data.productionRuleA[i]) {
			if (ruleB === data.productionRuleB[i]) {
				data.productionRuleA.splice(i, 1);
				data.productionRuleB.splice(i, 1);
				checkLetter();
				checkRule();
				return;
			}
		}
	}
}

//run wiht given input
function run() {
	if (data.markov) {
		runMarkov();
	} else {
		runSemi();
	}
}

//run semi thue
function runSemi(){
	var element = $('#inRun').val();
	$('#theRun').html(createResult(element, element));
}

//evaluate posibility
function eval(context) {
	var counter = 0;
	for ( var i = 0; i < data.productionRuleA.length; i++) {
		var instances = getIndicesOf(data.productionRuleA[i], context.attr('data-k1'));
		for ( var k = 0; k < instances.length; k++) {
			var partA = context.attr('data-k1').substr(0, instances[k]);
			var partB = context.attr('data-k1').substr(instances[k] + data.productionRuleA[i].length);
			var newString = partA + data.productionRuleB[i] + partB;
			var newStringB =  partA + "<b>" +  data.productionRuleB[i] + "</b>" + partB;
			context.append(createResult(newString, newStringB));
			counter++;
		}
	}
	return counter;
}

//creates a single result 
function createResult(string, stringBig){
	var result = $('<div>')
	.html(stringBig)
	.attr('class','aRun')
	.attr('id',data.productionRuleA.length)
	.attr('data-k1', string)
	.attr('data-k2', stringBig);
	
	//user feedback and onClick is enabled for semi-tue mode
	if (!data.markov) {
	result
		.attr('title','Click to Collapse')
		.attr('data-collapsed', "false")
		.click(
			function(e) {
				e.stopPropagation();
				if ($(this).attr('data-collapsed') === 'false') {
					if (eval($(this)) === 0) {
						$(this)
							.css('background-color', '#FFAFAF')
							.attr('title','End of the Line');
					} else {
						$(this)
						.css('background-color', '#FFFFFF')
						.attr('title','Click to Collapse');
					}
					$(this).attr('data-collapsed', 'true');
				} else {
					$(this).html($(this).attr('data-k2'));
					$(this).attr('data-collapsed', 'false');
				}
			}
		);
	}
	return result;
}

//runs markov algorythm
function runMarkov(){
	$('#theRun').html('');
	
	var maxIt = parseInt($('#iterations').val()); //maximal iteration count
	var currentString = $('#inRun').val();
	var output =  $('#theRun');
	var ende1 = false;
	var flag = false;
	
	//Checks maxIt
	if (typeof(maxIt) !== 'number' || isNaN(maxIt) || maxIt <= 0 || maxIt > 100000) {
		$('#iterations').css('background-color', '#FFAFAF');
		return;
	} else {
		$('#iterations').css('background-color', '#FFFFFF');
	}
	
	//main loop 0 ... maxIt
	for ( var i = 0; i < maxIt ; i++) {
		
		//check each rule for match with currentString
		$('.aRule').each(function( index ){
			var search = $(this).attr('data-k1');
			var replace = $(this).attr('data-k2');
			//special case for ε ("")
			if (search === "") {
				createResult(replace + currentString,  "<b>" +  replace + "</b>" + currentString)
					.appendTo(output);
				flag = true;
				currentString = replace + currentString;
				return false;
			} 
			
			//if current rule can be used
			var instances = getIndicesOf(search, currentString);			
			if ( instances.length > 0)  {
				var partA = currentString.substr(0, instances[0]);
				var partB = currentString.substr(instances[0] + search.length);
				var newString = partA + replace + partB;
				var newStringB =  partA + "<b>" +  replace + "</b>" + partB;
				createResult(newString, newStringB).appendTo(output);
				if ($(this).children('input').is(':checked')) {
					ende1 = true;
				}
				flag = true;
				currentString = newString;
				return false;
			}
		});
		if (ende1 || !flag) {
			break;
		}
	}
	if (ende1) { //if terminating rule is triggered
		createResult('END2 terminating rule', 'END2 terminating rule').appendTo(output);		
	} else if (flag) { //If none is found, the algorithm stops.
		createResult('END1 none is found', 'END1 none is found').appendTo(output);
	} else { //else maxIt reached
		createResult('Max Iterations reached', 'Max Iterations reached').appendTo(output);		
	} 
}

//function to find occurencys of an substring within a string, returns an array with position 
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

//converts jQuery obect to string
function getStatus() {
	$('#IOGateway').html(JSON.stringify(data));
}

//input for saved state
function setStatus() {
	if ($('#IOGateway input').length === 0) {
		var tooltip = 'Paste JSON Object (Your Data String) here and click "Set Data" again';
		var textarea = $('<input>')
			.attr('type', 'text')
			.attr('size', '80')
			.val(tooltip)
			.focus(function() {
				if(this.value == tooltip) { 
					this.value = ''; 
					}
			})
			.keypress(function(e){ 
				if(e.which == 13){//Enter key pressed
					setStatus();
				}
			});
		$('#IOGateway').html(textarea);
	} else {
		var datatmp = JSON.parse($('#IOGateway input').val());
		if (datatmp.productionRuleA.length != datatmp.productionRuleB.length) {
			$('#IOGateway').html('error');			
		} else {
			reload(datatmp);
			data = datatmp;
			$('#IOGateway').html('loaded');
		}
	} 
}

//reloads the data
function reload(theData) {
	$('#theAlphabet').html('');
	$('#theRules').html('');
	for ( var i = 0; i < theData.alphabet.length; i++) {
		$('#inAlphabet').val(theData.alphabet[i]);
		addAlphabet();
	}
	for ( var k = 0; k < theData.productionRuleA.length; k++) {
		$('#inRuleA').val(theData.productionRuleA[k]);
		$('#inRuleB').val(theData.productionRuleB[k]);
		addRule();
	}
	
	if (data.markov !== theData.markov) {
		if (theData.markov == true) {
			$('#Markov').prop('checked',true);
		} else if (theData.markov == false) {
			$('#SemiThue').prop('checked',true);
		}
		switchMode();
	}
}

//replaces "" with ε
function checkForE(toChekc) {
	if (toChekc === "") {
		return "ε";
	} else {
		return toChekc;
	}
}