document.getElementById("clear").addEventListener("click", () => {
  clearSave();
});
refreshUI();

function addToTable(name, tableID) {
  try {
    var table = document.getElementById(tableID);
    for (let i in table.rows) {
      let row = table.rows[i];
      for (let j in row.cells) {
        let col = row.cells[j];
        try {
          if (col.innerHTML.includes(name)) {
            return;
          }
        } catch (error) {}
      }
    }
    var row = table.insertRow(-1);
    // add delete button
    row.insertCell(0).innerHTML =
      '<td><button id="' + name + tableID + '">'+(name.length<=15?name:name.substring(0,14)+"&hellip;")+"</button></td>";
    document.getElementById(name + tableID).addEventListener("click", () => {
      if (tableID == "loadTable") {
        loadGroup(name);
      } else {
        saveGroup(name);
      }
    });
  } catch (error) {
    // alert("Error");
    console.log(error);
  }
}

function refreshUI() {
  console.log("Refreshing UI")
  chrome.tabGroups.query({}, function (groups) {
    groups.forEach(function (group) {
      addToTable(group.title, "saveTable");
    });
  });

  chrome.bookmarks.getTree(function (rootNode) {
    rootNode[0].children[0].children.forEach(function (folder) {
      if (folder.title == "GroupExtension") {
        folder.children.forEach(function (group) {
          addToTable(group.title, "loadTable");
        });
      }
    });
  });
}

function loadGroup(groupName) {
  console.log("Loading Group:" + groupName);
  chrome.tabs.create(
    { url: "https:\\asana.com", active: false },
    function (tab) {
      chrome.tabs.group({ tabIds: [tab.id] }, function (group) {
        chrome.tabGroups.update(group, { title: groupName });
      });
    }
  );
  chrome.bookmarks.getTree(function (rootNode) {
    rootNode[0].children[0].children.forEach(function (folder) {
      if (folder.title == "GroupExtension") {
        folder.children.forEach(function (group) {
          if (group.title == groupName) {
            group.children.forEach(function (site) {
              chrome.tabs.create(
                { url: site.url, active: false },
                function (tab) {
                  chrome.tabGroups.query(
                    { title: groupName, collapsed: false },
                    function (group) {
                      chrome.tabs.group({
                        tabIds: [tab.id],
                        groupId: group[0].id,
                      });
                    }
                  );
                }
              );
            });
          }
        });
      }
    });
  });
}

function clearSave() {
  console.log("Clearing Save")
  chrome.bookmarks.getTree(function (rootNode) {
    rootNode[0].children[0].children.forEach(function (folder) {
      if (folder.title == "GroupExtension") {
        folder.children.forEach(function (group) {
          chrome.bookmarks.removeTree(group.id);
        });
        document.getElementById("loadTable").innerHTML = '<table id="loadTable" border="2px solid black"><th>Load</th></table>';
      }
    });
  });
}

function saveGroup(groupName) {
  // TODO use google sync
  console.log("Saving Group: " + groupName);
  chrome.tabGroups.query({ title: groupName }, function (group) {
    chrome.tabs.query({ groupId: group[0].id }, function (tabs) {
      chrome.bookmarks.getTree(function (rootNode) {
        rootNode[0].children[0].children.forEach(function (folder) {
          if (folder.title == "GroupExtension") {
            folder.children.forEach(function (group) {
              if (group.title == groupName) {
                chrome.bookmarks.removeTree(group.id);
              }
            });
            chrome.bookmarks.create(
              { parentId: folder.id, title: groupName },
              function (newFolder) {
                tabs.forEach(function (tab) {
                  chrome.bookmarks.create({
                    parentId: newFolder.id,
                    title: tab.title,
                    url: tab.url,
                  });
                });
              }
            );
          }
        });
      });
    });
  });
  setTimeout(refreshUI, 100);
}
