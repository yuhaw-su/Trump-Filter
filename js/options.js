function saveOptions() {
  var selectedFilter = document.getElementById('selectedFilter').value;

  chrome.storage.sync.set({
    filter: selectedFilter
  }, function() {
    var status = document.getElementById('saveMessage');
    status.textContent = 'Filter selected - ' + selectedFilter;
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

function getOptions(callback) {
  chrome.storage.sync.get({
    filter: 'mild',
    unsafeThingCount: 0,
    pages: 0,
    unsafeThing1: ''
  }, function(items) {
    document.getElementById('selectedFilter').value = items.filter;
    document.getElementById('unsafeThingCount').textContent = items.unsafeThingCount;
    document.getElementById('pagecount').textContent = items.pages;
    if (items.unsafeThing1)
    {
      document.getElementById('unsafeThing1').textContent = items.unsafeThing1;
    }
    else
    {
      document.getElementById('unsafeThing1').textContent = "fuck";
    }
    callback(items.filter);
    return items.filter;
  });
}

function addUnsafeThing() {
  var thingText = document.getElementById('thingToRemove').value;
  // var tempItems;
  // chrome.storage.sync.get({
  //   unsafeThing1: ''
  // }, function(items) {
  //   tempItems = items.unsafeThingsList.slice();
  // });
  // tempItems.push(thingText);
  chrome.storage.sync.set({
    unsafeThing1: thingText
  }, function() {
    var status = document.getElementById('addedMessage');
    status.textContent = 'Added unsafe thing  - ' + thingText;
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
  getOptions();
}

function clearSettings() {
  chrome.storage.sync.clear();
  getOptions(function(filter) {
    var status = document.getElementById('clearMessage');
    status.textContent = 'Safespace cleared.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

function restoreOptions() {
  getOptions(function(filter) {
    document.getElementById('selectedFilter').value = filter;
  });
  document.getElementById('selectedFilter').addEventListener('change', saveOptions);
  document.getElementById('submitButton').addEventListener('click', addUnsafeThing);
  document.getElementById('clearButton').addEventListener('click', clearSettings);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
