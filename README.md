# Group Extension
 
![Demo image](https://github.com/aidankeighron/group-extension/blob/main/demo_image.png)

This Google Chrome extension was created to help transfer tab data across devices. Google has a feature where you can group tabs together (you can create a group by right-clicking on a tab and selecting "Add tab to group"). I use this feature heavily, and I often have many groups, each with a set of tabs related to the group name. When I switch from my laptop to my desktop or any other computer, I have to re-open all of the grouped tabs, which can take a while and is an overall hassle. So I made this extension to help with that.

# How to use

When you click on the extension, a popup appears in which you can select a group to save or load. The save table displays a list of all current groups (including groups in other windows); clicking one of the buttons saves the corresponding group. Any of the buttons in the load table will load the saved group. The X next to each load button removes the group. All saved groups will be deleted if the clear button is pressed.

# How to install

The easiest way is to install it through the [chrome web store](https://chrome.google.com/webstore/detail/group-management/mipeplimdkiijcfjjkdgkhemfcpoaied?hl=en&authuser=0). Alternatively, you can download the source code for the extension. To add it to your extensions. Go to [chrome://extensions/](chrome://extensions/) (turn on developer mode in the top right corner if you don't already have it on) and select "Load unpacked". This should open a file prompt where you can select the folder for the extension. Once you have loaded the extension, you are all good to go.
