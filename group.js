document.getElementById("clear").addEventListener("click", () => {
  clearSave();
});
refreshUI();
console.log("Loading Done")

function addToTable(name, tableID) {
  const table = document.getElementById(tableID);
  for (let i in table.rows) {
    let row = table.rows[i];
    for (let j in row.cells) {
      let col = row.cells[j];
      try {
        if (col.innerHTML.includes(name)) {
          console.log("I do something")
          return;
        }
      } catch (error) {}
    }
  }
  const row = table.insertRow(-1);
  const button = '<button id="'+name+tableID+'">'+(name.length<=15?name:name.substring(0, 14)+"&hellip;")+"</button>";
  if (tableID == "loadTable") {
    const deleteButton = '<button class="delete" id="btn'+name+tableID+'">&#10006;</button>';
    row.insertCell(0).innerHTML = '<td><div class="row">'+button+deleteButton+"</div></td>";
    document.getElementById("btn"+name+tableID).addEventListener("click", () => {
        document.getElementById(name+tableID).remove();
        document.getElementById("btn"+name+tableID).remove();
        chrome.storage.sync.remove(name);
      });
  } else {
    row.insertCell(0).innerHTML = "<td>"+button+"</td>";
  }
  document.getElementById(name + tableID).addEventListener("click", () => {
    if (tableID == "loadTable") {
      loadGroup(name);
    } else {
      saveGroup(name);
    }
  });
}

function refreshUI() {
  console.log("Refreshing UI");
  chrome.tabGroups.query({}, function (groups) {
    groups.forEach(function (group) {
      addToTable(group.title, "saveTable");
    });
  });
  chrome.storage.sync.get(null).then((groups) => {
    Object.keys(groups).forEach((group) => {
      addToTable(group, "loadTable");
    });
  });
}

function loadGroup(groupName) {
  console.log("Loading Group:" + groupName);
  chrome.storage.sync.get(groupName).then((savedGroups) => {
    Object.keys(savedGroups).forEach((savedGroup) => {
      const sites = savedGroups[savedGroup];
      chrome.tabs.create(
        { url: sites.shift(), active: false},
        function (firstTab) {
          chrome.tabs.group({ tabIds: [firstTab.id] }, function (group) {
            chrome.tabGroups.update(group, { title: groupName, collapsed: true});
            sites.forEach(function (site) {
              chrome.tabs.create(
                { url: site, active: false },
                function (tab) {
                  chrome.tabs.group({tabIds: [tab.id],groupId: group});
                }
              );
          });
        }
      );
      });
    })
  })
}

function clearSave() {
  console.log("Clearing Save");
  chrome.storage.sync.clear().then(() => {
    document.getElementById("loadTable").innerHTML = '<table id="loadTable" border="2px solid black"><th>Load</th></table>';
  });
}

function saveGroup(groupName) {
  console.log("Saving Group: " + groupName);
  chrome.tabGroups.query({ title: groupName }, function (group) {
    chrome.tabs.query({ groupId: group[0].id }, function (tabs) {
      chrome.storage.sync.remove(groupName);
      chrome.storage.sync.set({ [groupName]: tabs.map((site) => site.url)});
    });
  });

  setTimeout(refreshUI, 100);
}
