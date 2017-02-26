function onMessage(request, sender, sendResponse) {
  if (request.method == "saveStats") {
    console.log("Storing stats...");
    console.log ("Adding " + request.unsafeThingCount + " unsafe things to stats.");
    chrome.storage.sync.get({
      unsafeThingCount: 0,
      pages: 0
    }, function(items) {
      chrome.storage.sync.set({
        unsafeThingCount: items.unsafeThingCount + request.unsafeThingCount,
        pages: items.pages + 1
      });
    });
    sendResponse({});
  } else {
    // Show icon
    console.log("Putting badge on address bar.");
    chrome.pageAction.show(sender.tab.id);

    // Log event with Google Analytics
    console.log("Logging Filter event...");
    chrome.storage.sync.get({
      filter: 'default'
    }, function(items) {
      console.log("Filtering on " + items.filter + " setting.");
      ga('send', 'event', 'Filter', 'unsafeThingCount', items.filter);
    });
    sendResponse({});
  }
}

chrome.runtime.onMessage.addListener(onMessage);
