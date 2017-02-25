/*
 * Trump Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of Donald Trump from the web page.
 */

// Variables
//var regex = /Kevin/i;
var regex = /(Kevin|Shrek)*/i;
var search = regex.exec(document.body.innerText);

var selector = ":contains('Kevin'), :contains('KEVIN'), :contains('kevin'), :contains('Shrek'), :contains('SHREK'), :contains('shrek')";


// Functions
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
	   chrome.runtime.sendMessage({method: "saveStats", unsafeThings: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " unsafe things.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
