/*
 * Trump Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Donald Trump from the web page.
 */

// Variables
//var regex = /Kevin/i;
// var regex = /(Kevin|Shrek)*/i;
var testingRegexArray = ["Kyle Christiansen", "Kevin", "Shrek"];
var regex = formatRegex(testingRegexArray);
// chrome.storage.sync.get({
// 	unsafeThings: []
// }, function(items) {
// 	regex = new RegExp(items.unsafeThings.join("|"), 'i');
// });
var search = regex.exec(document.body.innerText);
//
// //var selector = ":contains('Kevin'), :contains('KEVIN'), :contains('kevin'), :contains('Shrek'), :contains('SHREK'), :contains('shrek')";
var selector = createSelector(getSearchTerms(testingRegexArray));

// Functions
function formatRegex(strArray)
{
	var outArray = [];
	for (var i = 0; i < strArray.length; i++)
	{
		outArray.push(strArray[i].toLowerCase());
		if (strArray[i].split(" ").length > 1)
		{
			outArray.push(strArray[i].toLowerCase().replace(/\s/g, '+'));
		}
	}
	return new RegExp(outArray.join("|"), 'i');
}

function createSelector(searchTerms)
{
	return ":contains('" + searchTerms.join("'), :contains('") + "'')";
}

function getDifferentStringRepresentations(thing)
{
	var representations = [];
	if (thing !== '')
	{
		var wordSplit = thing.split(/[-\s]*/);
		representations.push(wordSplit[0].toLowerCase());
		representations.push(wordSplit[0].toUpperCase());
		representations.push(wordSplit[0]);
		//representations.push(wordSplit[0].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}));
		if (wordSplit.length > 1)
		{
			for (var i = 1; i < wordSplit.length; i++)
			{
				representations[0] += (" " + wordSplit[i].toLowerCase());
				representations[1] += (" " + wordSplit[i].toUpperCase());
				representations[2] += (" " + wordSplit[i]);
				//representations[2] += (" " + wordSplit[i].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}));
			}
			var separators = [",", ".", "-", "_", "+", ""];
			for (var i = 0; i < separators.length; i++)
			{
				representations.push(representations[0].split(" ").join(separators[i]));
				representations.push(representations[1].split(" ").join(separators[i]));
				representations.push(representations[2].split(" ").join(separators[i]));
			}
		}
	}
	return representations;
}

function getSearchTerms(singularTerms)
{
	var holdingArray = [];
	if (singularTerms.length > 0)
	{
		holdingArray = getDifferentStringRepresentations(singularTerms[0]);
		for (var i = 1; i < singularTerms.length; i++)
		{
			holdingArray = holdingArray.concat(getDifferentStringRepresentations(singularTerms[i]));
		}
	}
	return holdingArray;
}

function filterMild() {
	console.log("Mildly filtering unsafe things...");
	return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Aggressively filtering unsafe things...");
	return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Vindictively filtering unsafe things...");
	return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else {
	   return filterDefault();
	 }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}

// Implementation
if (search) {
   console.log("Unsafe things found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'mild',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", unsafeThingCount: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " unsafe things.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
