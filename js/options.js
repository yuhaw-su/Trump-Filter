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
    filter: 'aggro',
    unsafeThingCount: 0,
    pages: 0,
    unsafeThing1: '',
    unsafeThing2: '',
    unsafeThing3: '',
    unsafeThing4: '',
    unsafeThing5: ''
  }, function(items) {
    document.getElementById('selectedFilter').value = items.filter;
    document.getElementById('unsafeThingCount').textContent = items.unsafeThingCount;
    document.getElementById('pagecount').textContent = items.pages;
    var list = document.getElementById('filters');
    document.getElementById('submitButton').disabled = false;
    if (items.unsafeThing1.length === 0)
    {
      document.getElementById('restrictingHeader').innerText = "No Safespace created.";
      while( list.firstChild )
      {
        list.removeChild( list.firstChild );
      }
    }
    else
    {
      document.getElementById('restrictingHeader').innerText = "Restricting:";
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(items.unsafeThing1));
      list.appendChild(entry);
    }
    if (items.unsafeThing2)
    {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(items.unsafeThing2));
      list.appendChild(entry);
    }
    if (items.unsafeThing3)
    {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(items.unsafeThing3));
      list.appendChild(entry);
    }
    if (items.unsafeThing4)
    {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(items.unsafeThing4));
      list.appendChild(entry);
    }
    if (items.unsafeThing5)
    {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(items.unsafeThing5));
      list.appendChild(entry);

      document.getElementById('restrictingHeader').innerText = "Restricting (maximum number of filters being used):";
      document.getElementById('submitButton').disabled = true;
    }
    callback(items.filter);
    return items.filter;
  });
}

function addUnsafeThing() {
  var thingText = document.getElementById('thingToRemove').value;
  // var tempItems;
  chrome.storage.sync.get({
    unsafeThing1: '',
    unsafeThing2: '',
    unsafeThing3: '',
    unsafeThing4: '',
    unsafeThing5: ''
  }, function(items) {
    if (items.unsafeThing1.length === 0)
    {
      items.unsafeThings1 = thingText;
    }
    else if (items.unsafeThing2.length === 0)
    {
      items.unsafeThings2 = thingText;
    }
    else if (items.unsafeThing3.length === 0)
    {
      items.unsafeThings3 = thingText;
    }
    else if (items.unsafeThing4.length === 0)
    {
      items.unsafeThings4 = thingText;
    }
    else if (items.unsafeThing5.length === 0)
    {
      items.unsafeThings5 = thingText;
    }

    chrome.storage.sync.set({
      unsafeThing1: items.unsafeThings1,
      unsafeThing2: items.unsafeThings2,
      unsafeThing3: items.unsafeThings3,
      unsafeThing4: items.unsafeThings4,
      unsafeThing5: items.unsafeThings5
    });
    getOptions();
  });

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
