let settings = {
  changeBadge: true,
  activateOnClose: false,
};

chrome.storage.sync.get(settings, (items) => {
    settings = items;

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.changeBadge) settings.changeBadge = changes.changeBadge.newValue;
        if (changes.activateOnClose) settings.activateOnClose = changes.activateOnClose.newValue;
    });

    chrome.action.onClicked.addListener(() => switchToLastTab());
    chrome.tabs.onRemoved.addListener(onTabClose);
    chrome.tabs.onActivated.addListener(onTabActivated);
    chrome.commands.onCommand.addListener((command) => {
        if (command === "switch-to-last-tab") switchToLastTab();
    })
});


function switchToLastTab(updateIcon = true){
    chrome.tabs.query({ currentWindow: true, active: false }, (tabs) => {
        if (tabs.length < 2) return;
        
        const previousTab = tabs
            .reduce((latest, current) => current.lastAccessed > latest.lastAccessed ? current : latest);

        if (previousTab?.id) {
            if (updateIcon && settings.changeBadge) chrome.tabs.onActivated.removeListener(onTabActivated);
            chrome.tabs.update(previousTab.id, { active: true }, function(){
                if (updateIcon && settings.changeBadge) {
                    chrome.tabs.onActivated.addListener(onTabActivated);
                    chrome.storage.session.set({ lastActiveTabId: previousTab.id });

                    chrome.action.getBadgeText({}, (text) => {
                        if (text === "") {
                            setIcon(true);
                        } else {
                            setIcon(false);
                        }
                    });
                }
            });
        } 
    });
}

function onTabActivated(activeInfo) {
    chrome.windows.get(activeInfo.windowId, { populate: false }, (window) => {
        if (window && window.type === "normal") {
            if (settings.changeBadge) setIcon(false);
        }

        /// delayed by windows.get to avoid race condition with onTabClose
        chrome.storage.session.set({ lastActiveTabId: activeInfo.tabId });
    });
}

function onTabClose(tabId, removeInfo) {
    if (removeInfo && removeInfo.isWindowClosing) return;

    chrome.storage.session.get("lastActiveTabId", (data) => {
        if (data.lastActiveTabId === tabId && settings.activateOnClose) {
            switchToLastTab(false);
        }
    });
}

function setIcon(showBadge = true){
    if (!settings.changeBadge) {
        chrome.action.setTitle({ title: "Switch to Last Tab" });
        chrome.action.setBadgeText({ text: "" });
        return;
    }
    if (showBadge) {
        chrome.action.setTitle({ title: "Switch Back to Last Tab" });
        chrome.action.setBadgeText({ text: "🡢" });
        chrome.action.setBadgeBackgroundColor({ color: "rgb(102, 181, 54)" });
        chrome.action.setBadgeTextColor({ color: "white" });
    } else {
        chrome.action.setTitle({ title: "Switch to Last Tab" });
        chrome.action.setBadgeText({ text: "" });
    }
}