chrome.action.onClicked.addListener(() => switchToLastTab());
chrome.commands.onCommand.addListener((command, senderTab) => {
    if (command === "switch-to-last-tab") switchToLastTab();
})
chrome.tabs.onRemoved.addListener(onTabClose);

function switchToLastTab(updateIcon = true){
    chrome.tabs.query({ currentWindow: true, active: false }, (tabs) => {
        if (tabs.length < 2) return;
        const previousTab = tabs
            .reduce((latest, current) => current.lastAccessed > latest.lastAccessed ? current : latest);

        if (previousTab?.id) {
            if (updateIcon) chrome.tabs.onActivated.removeListener(onTabActivated);

            chrome.tabs.update(previousTab.id, { active: true }, function(){
                if (updateIcon) chrome.tabs.onActivated.addListener(onTabActivated);
            });

            if (updateIcon){
                const currentTitle = chrome.action.getTitle({}, (title) => {
                    if (title === "Switch to Last Tab") {
                        chrome.action.setTitle({ title: "Switch Back to Last Tab" });
                        // chrome.action.setIcon({ path: "icon-reverse.png"});
                        // chrome.action.setBadgeText({ text: "⮣" });
                        // chrome.action.setBadgeText({ text: "→" });
                        chrome.action.setBadgeText({ text: "🡢" });
                        chrome.action.setBadgeBackgroundColor({ color: "rgb(102, 181, 54)" });
                        chrome.action.setBadgeTextColor({ color: "white" });
                    } else {
                        chrome.action.setTitle({ title: "Switch to Last Tab" });
                        // chrome.action.setIcon({ path: "icon.png"});
                        chrome.action.setBadgeText({ text: "" });
                    }
                });
            }
        } 
    });
}

function onTabActivated(activeInfo) {
    chrome.windows.get(activeInfo.windowId, { populate: false }, (window) => {
        if (window && window.type === "normal") {
            // chrome.action.setIcon({ path: "icon.png"});
            chrome.action.setTitle({ title: "Switch to Last Tab" });
            chrome.action.setBadgeText({ text: "" });
            chrome.tabs.onActivated.removeListener(onTabActivated)
        }
    });
}

function onTabClose(tabId, removeInfo) {
    if (!removeInfo || !removeInfo.isWindowClosing) {
        switchToLastTab(false);
    }
}