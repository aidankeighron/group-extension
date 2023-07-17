document.getElementById("clear").addEventListener("click", () => {
  clearSave();
});
refreshUI();

function addToTable(name, tableID) {
  try {
    const table = document.getElementById(tableID);
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
    const row = table.insertRow(-1);
    const button = '<button id="'+name+tableID+'">'+(name.length<=15?name:name.substring(0, 14)+"&hellip;")+"</button>";
    if (tableID == "loadTable") {
      const deleteButton = '<button class="delete" id="btn'+name+tableID+'">&#10006;</button>';
      row.insertCell(0).innerHTML = '<td><div class="row">'+button+deleteButton+"</div></td>";
      document.getElementById("btn"+name+tableID).addEventListener("click", () => {
          document.getElementById(name+tableID).remove();
          document.getElementById("btn"+name+tableID).remove();
          chrome.bookmarks.getTree(function (rootNode) {
            rootNode[0].children[0].children.forEach(function (folder) {
              if (folder.title == "GroupExtension") {
                folder.children.forEach(function (group) {
                  if (group.title == name) {
                    chrome.bookmarks.removeTree(group.id);
                  }
                });
              }
            });
          });
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
  } catch (error) {
    console.log(error);
  }
}

function refreshUI() {
  console.log("Refreshing UI");
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
  
  chrome.bookmarks.getTree(function (rootNode) {
    rootNode[0].children[0].children.forEach(function (folder) {
      if (folder.title == "GroupExtension") {
        folder.children.forEach(function (group) {
          if (group.title == groupName) {
            const sites = group.children.map((site) => site.url);
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
              });
            });
          }
        });
      }
    });
  });
}

function clearSave() {
  console.log("Clearing Save");
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
                  chrome.bookmarks.create({parentId: newFolder.id,title: tab.title,url: tab.url});
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
