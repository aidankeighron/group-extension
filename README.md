# Group Extension
 
This a google chrome extension created to help transfer tab data across devices. Google has a feature where you can group tabs together (you can create a group by right-clicking on a tab and selecting "Add tab to group"). I use this feature heavily and I often have many groups each with a set of tabs related to the group name. When I switch from my laptop to my desktop or any other computer I have to re-open all of the grouped tabs which can take a while and is an overall hassle. So I made this extension to help with that.

# How to use

When you click on the extension it opens a popup allowing you to select a group to save or load. On the load table you will see a list of every group that is currently active (even groups in other windows) selecting any of the groups will save them to your "GroupExtension" folder (if the folder does not exist a new one will be created). All saved groups will appear in load. Clicking any of them will load the saved group in your current window. Clear will delete all saved groups.

# How to install

First download the source code for the extension. Next you need to add it to your extensions. Go to [chrome://extensions/](chrome://extensions/) (turn on developer developer mode in the top right corner if you don't already have it on) and select "Load unpacked". This should open a file prompt where you can select the folder of the extension. Once you have loaded the extension you are all good to go.