document.getElementById("save").addEventListener("click", saveGroup);
document.getElementById("load").addEventListener("click", loadGroup);

async function loadGroup() {
  groupName = "Test";
  chrome.tabs.create(
    { url: "https:\\asana.com", active: false },
    function (tab) {
      chrome.tabs.group(
        { tabIds: [tab.id] },
        function (group) {
          chrome.tabGroups.update(group, {title: groupName});
        }
      );
    }
  );
  chrome.bookmarks.getTree(function (rootNode) {
    rootNode[0].children[0].children.forEach(function (folder) {
      if (folder.title == "GroupExtension") {
        folder.children.forEach(function (group) {
          if (group.title == groupName) {
            group.children.forEach(async function (site) {
              chrome.tabs.create(
                { url: site.url, active: false },
                function (tab) {
                  chrome.tabGroups.query(
                    { title: groupName, collapsed: false },
                    function (group) {
                      chrome.tabs.group(
                        { tabIds: [tab.id], groupId: group[0].id }
                      );
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

function saveGroup() {
  const groupName = "Test";
  const siteNames = [
    "https:\\\\www.pcgamer.com",
    "https:\\\\www.youtube.com",
    "https:\\\\www.google.com",
  ];
  chrome.tabGroups.query(
    { title: groupName },
    function (group) {
      chrome.tabs.query({groupId: group[0].id},
        function (tabs) {
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
                    console.log(tabs);
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
        })
    }
  );

  // chrome.bookmarks.search("GroupExtension", function (matches) {
  //     console.log(matches[0]);
  //     chrome.bookmarks.create(
  //         { parentId: matches[0].id, title: groupName },
  //         function (newFolder) {
  //             console.log("added folder: " + newFolder.title);
  //             siteNames.forEach(function (site) {
  //                 chrome.bookmarks.create({
  //                     parentId: newFolder.id,
  //                     title: site,
  //                     url: site,
  //                 });
  //                 console.log("added site: " + site);
  //             });
  //         }
  //     );
  // });
}
