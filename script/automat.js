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

var markov = false;

var data = {
		"alphabet":[],
		"productionRuleA":[],
		"productionRuleB":[]
};

function switchMode() {
	if (markov) {
		markov = false;
	} else {		
		markov = true;
	}
	$('.aRule').each(function( index ){
		if ( markov ) {
			$(this).children('input').css('visibility', 'visible');			
		} else {
			$(this).children('input').css('visibility', 'hidden');
		}
	});
	console.log("modeSwitched");
	$('#theRun').html('');	
}

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
		if (markov) {
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

function checkSingleRule(context, dataValue) {
	var part = context.attr(dataValue);
	for ( var i = 0; i < part.length; i++) {
		if ( $.inArray(part[i], data.alphabet) === -1 ){
			return false;
		}	
	}
	return true;
}


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

function run() {
	if (markov) {
		runMarkov();
	} else {
		runSemi();
	}
}

function runSemi(){
	var element = $('#inRun').val();
	$('#theRun').html(createNewSemi(element, element));
}

function eval(context) {
	var counter = 0;
	for ( var i = 0; i < data.productionRuleA.length; i++) {
		var instances = getIndicesOf(data.productionRuleA[i], context.attr('data-k1'));
		for ( var k = 0; k < instances.length; k++) {
			var partA = context.attr('data-k1').substr(0, instances[k]);
			var partB = context.attr('data-k1').substr(instances[k] + data.productionRuleA[i].length);
			var newString = partA + data.productionRuleB[i] + partB;
			var newStringB =  partA + "<b>" +  data.productionRuleB[i] + "</b>" + partB;
			context.append(createNewSemi(newString, newStringB));
			counter++;
		}
	}
	return counter;
}

function createNewSemi(string, stringBig){
	var result = $('<div>')
	.html(stringBig)
	.attr('class','aRun')
	.attr('id',data.productionRuleA.length)
	.attr('data-k1', string)
	.attr('data-k2', stringBig);
	if (!markov) {
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

function runMarkov(){
	$('#theRun').html('');
	
	var maxIt = parseInt($('#iterations').val());
	var currentString = $('#inRun').val();
	var output =  $('#theRun');
	var ende1 = false;
	var flag = false;
	
	if (typeof(maxIt) !== 'number' || isNaN(maxIt) || maxIt <= 0 || maxIt > 100000) {
		$('#iterations').css('background-color', '#FFAFAF');
		return;
	} else {
		$('#iterations').css('background-color', '#FFFFFF');
	}
	for ( var i = 0; i < maxIt ; i++) {
		$('.aRule').each(function( index ){
			var search = $(this).attr('data-k1');
			var replace = $(this).attr('data-k2');
			if (search === "") {
				createNewSemi(replace + currentString,  "<b>" +  replace + "</b>" + currentString)
					.appendTo(output);
				flag = true;
				currentString = replace + currentString;
				return false;
			} 
			
			var instances = getIndicesOf(search, currentString);			
			if ( instances.length > 0)  {
				var partA = currentString.substr(0, instances[0]);
				var partB = currentString.substr(instances[0] + search.length);
				var newString = partA + replace + partB;
				var newStringB =  partA + "<b>" +  replace + "</b>" + partB;
				createNewSemi(newString, newStringB).appendTo(output);
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
	if (ende1) {
		createNewSemi('END1 terminating rule', 'END1 terminating rule').appendTo(output);
	} else if (!flag) {
		createNewSemi('END terminating rule', 'END1 terminating rule').appendTo(output);		
	} else {
		createNewSemi('Max Iterations reached', 'Max Iterations reached').appendTo(output);		
	} 
}

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


function getStatus() {
	$('#IOGateway').html(JSON.stringify(data));
}

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
}

function checkForE(toChekc) {
	if (toChekc === "") {
		return "ε";
	} else {
		return toChekc;
	}
}