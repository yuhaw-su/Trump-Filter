/*
 * Trump Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of unsafe things from the web page.
 */

// Variables
// var defaultFilters = ["Trump", "Iowa State", "Nickelback"];
// var customFilters = [];
var defaultFilter = "Trump";
var filter1;
var filter2;
var filter3;
var filter4;
var filter5;
var selector;

// Functions


// function getFilters()
// {
// 	chrome.storage.sync.get({
// 		unsafeThing1: ''
// 	}, function(items) {
// 		filter1 = items.unsafeThing1;
// 		// customFilters = items.unsafeThing1;
// 	});
// 	if (filter1 === null || filter1 === 0)
// 	{
// 		filter1 = defaultFilter;
// 	}
// }

// function getRegex()
// {
// 	getFilters();
//
// 	var outArray = [];
// 	// for (var i = 0; i < customFilters.length; i++)
// 	// {
// 	// 	outArray.push(customFilters[i].toLowerCase());
// 	// 	if (customFilters[i].split(" ").length > 1)
// 	// 	{
// 	// 		outArray.push(customFilters[i].toLowerCase().replace(/\s/g, '+'));
// 	// 	}
// 	// }
// 	outArray.push(filter1.toLowerCase());
// 	if (filter1.split(" ").length > 1)
// 	{
// 		// outArray.push(customFilters[i].toLowerCase().replace(/\s/g, '+'));
// 		// outArray.push(customFilters[i].toLowerCase().replace(/\s/g, '%20'));
// 		outArray.push(filter1.toLowerCase().replace(/\s/g, '+'));
// 		outArray.push(filter1.toLowerCase().replace(/\s/g, '%20'));
// 	}
// 	return new RegExp(outArray.join("|"), 'i');
// }

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
			var separators = [",", ".", "-", "_", "+", "%20", ""];
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

function getSelector()
{
	chrome.storage.sync.get({
		unsafeThing1: '',
		unsafeThing2: '',
		unsafeThing3: '',
		unsafeThing4: '',
		unsafeThing5: ''
	}, function(items) {
		filter1 = items.unsafeThing1;
		filter2 = items.unsafeThing2;
		filter3 = items.unsafeThing3;
		filter4 = items.unsafeThing4;
		filter5 = items.unsafeThing5;
		if (filter1 === null || filter1.length === 0)
		{
			filter1 = defaultFilter;
			chrome.storage.sync.set({
				unsafeThing1: filter1
			});
		}
		var terms = [];
		if (filter1)
		{
			terms.push(filter1);
		}
		if (filter2)
		{
			terms.push(filter2);
		}
		if (filter3)
		{
			terms.push(filter3);
		}
		if (filter4)
		{
			terms.push(filter4);
		}
		if (filter5)
		{
			terms.push(filter5);
		}
		selector = createSelector(getSearchTerms(terms));
	});
}

// Implementation
// customFilters = defaultFilters.slice();
// var regex = getRegex();
// var search = regex.exec(document.body.innerText);
getSelector();
// if (search) {
   console.log("Unsafe things found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   var elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", unsafeThingCount: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " unsafe things.");
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
// }
