function saveOptions() {
  var selectedFilter = document.getElementById('selectedFilter').value;

  chrome.storage.sync.set({
    filter: selectedFilter
  }, function() {
    var status = document.getElementById('saveMessage');
    status.textContent = 'Filter selected - ' + selectedFilter;
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function getOptions(callback) {
  chrome.storage.sync.get({
    filter: 'mild',
    unsafeThingCount: 0,
    pages: 0
  }, function(items) {
    document.getElementById('selectedFilter').value = items.filter;
    document.getElementById('unsafeThingCount').textContent = items.unsafeThingCount;
    document.getElementById('pagecount').textContent = items.pages;
    callback(items.filter);
    return items.filter;
  });
}

function restoreOptions() {
  getOptions(function(filter) {
    document.getElementById('selectedFilter').value = filter;
  });
  document.getElementById('selectedFilter').addEventListener('change', saveOptions);
}

function addUnsafeThing() {
  var thingText = document.getElementById('thingToRemove').value;
  chrome.storage.sync.get({
    unsafeThings: []
  }, function(items) {
    var tempItems = items.unsafeThings;
    tempItems.push(thingText)
    chrome.storage.sync.set({
      unsafeThings: tempItems,
    });
    var status = document.getElementById('addedMessage');
    status.textContent = 'Added unsafe thing  - ' + thingText;
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
