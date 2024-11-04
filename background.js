let counter = {};

let changeTabReset = false;

const updateBadge =  (count) => {
    let color = (changeTabReset) ? "#00cccc" : "#00cc00"
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: color });
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        console.log("Request:", details);

        if(!counter[details.tabId]){
            counter[details.tabId] = 0;
        }

        //counter[details.tabId]++;

        chrome.tabs.get(details.tabId, (tab) => {
            if(tab.active){
                updateBadge(counter[details.tabId]);
            }
        });
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.log("Completed?:", details);

        if(!counter[details.tabId]){
            counter[details.tabId] = 0;
        }

        if(details.statusCode >=200 && details.statusCode <400) counter[details.tabId]++;

        chrome.tabs.get(details.tabId, (tab) => {
            if(tab.active){
                updateBadge(counter[details.tabId]);
            }
        });
    },
    { urls: ["<all_urls>"] }
);

chrome.tabs.onActivated.addListener((activeInfo) => {
    if(changeTabReset){
        counter[activeInfo.tabId] = 0;
    }
    else{
        let c = counter[activeInfo.tabId];
        if(c == undefined){
            counter[activeInfo.tabId] = 0;
        }
    }

    updateBadge(counter[activeInfo.tabId]);
});


chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
        let c = counter[tab.id];
        if(c == undefined){
            counter[tab.id] = 0;
        }
        updateBadge(counter[tab.id]);
    });
});

chrome.action.onClicked.addListener((tab) => {
    changeTabReset = !changeTabReset;
    let c = counter[tab.id];
    if(c == undefined){
        counter[tab.id] = 0;
    }
    updateBadge(counter[tab.id]);
});
