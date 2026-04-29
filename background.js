let settings = {
  changeBadge: false,
  changeIcon: true,
  activateOnClose: false,
};

chrome.action.onClicked.addListener(() => switchToLastTab());
chrome.commands.onCommand.addListener((command) => {
    if (command === "switch-to-last-tab") switchToLastTab();
});
chrome.tabs.onRemoved.addListener(onTabClose);
chrome.tabs.onActivated.addListener(onTabActivated);

chrome.storage.sync.get(settings, (items) => {
    settings = items;

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.changeBadge) settings.changeBadge = changes.changeBadge.newValue;
        if (changes.activateOnClose) settings.activateOnClose = changes.activateOnClose.newValue;
        if (changes.changeIcon) settings.changeIcon = changes.changeIcon.newValue;
    });
});

function switchToLastTab(updateIcon = true){
    chrome.tabs.query({ currentWindow: true, active: false }, (tabs) => {
        if (tabs.length < 2) return;
        
        const previousTab = tabs
            .reduce((latest, current) => current.lastAccessed > latest.lastAccessed ? current : latest);

        if (previousTab?.id) {
            const iconChangeAllowed = updateIcon && (settings.changeBadge || settings.changeIcon);
            if (iconChangeAllowed) chrome.tabs.onActivated.removeListener(onTabActivated);

            chrome.tabs.update(previousTab.id, { active: true }, function(){
                if (iconChangeAllowed) {
                    chrome.tabs.onActivated.addListener(onTabActivated);
                    chrome.storage.session.set({ lastKnownActiveTabId: previousTab.id });

                    chrome.action.getTitle({}, (text) => {
                        setIcon(text === "Switch to Last Tab");
                    });
                }
            });
        } 
    });
}

function onTabActivated(activeInfo) {
    chrome.windows.get(activeInfo.windowId, { populate: false }, (window) => {
        if (window && window.type === "normal") {
            if (settings.changeBadge || settings.changeIcon) setIcon(false);
        }

        /// delayed by windows.get to avoid race condition with onTabClose
        chrome.storage.session.set({ lastKnownActiveTabId: activeInfo.tabId });
    });
}

function onTabClose(tabId, removeInfo) {
    if (removeInfo && removeInfo.isWindowClosing) return;

    /// check if closed tab was the active tab before closing
    chrome.storage.session.get("lastKnownActiveTabId", (data) => {
        if (data.lastKnownActiveTabId === tabId && settings.activateOnClose) {
            switchToLastTab(false);
        }
    });
}

function setIcon(shouldChange = true){
    chrome.action.setTitle({ title: shouldChange ? "Switch Back to Previous Tab" : "Switch to Last Tab" });

    if (settings.changeBadge) {
        if (shouldChange){
            chrome.action.setBadgeText({ text: "🡢" });
            chrome.action.setBadgeBackgroundColor({ color: "rgb(102, 181, 54)" });
            chrome.action.setBadgeTextColor({ color: "white" });
        } else {
            chrome.action.setBadgeText({ text: "" });
        }
    }

    if (settings.changeIcon) {
        chrome.action.setIcon({ path: shouldChange ? "./icon-red.png" : "./icon.png" });
    }
}