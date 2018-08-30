
const API_BASE = 'http://89.108.103.218/v1';

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.browserAction.setPopup({popup: 'popup/index.html'});

    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function (tabs){
            alert(tabs[0].url);
        }
    );
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    updateActiveTabCounter();
  }
});

chrome.tabs.onActivated.addListener(updateActiveTabCounter);

chrome.extension.onConnect.addListener(async function(port) {
    port.onMessage.addListener(async function (msg) {
        switch (msg.type) {
            case 'init':
                const tab = await getSelectedTab();      
                port.postMessage({
                    type: 'sandboxInit',
                    url: tab.url,
                });
                break;
            default:
                port.postMessage({
                    type: 'echo',
                    data: msg,
                });
        }
    });
});

async function getSelectedTab () {
    return new Promise((resolve, reject) => {
        chrome.tabs.getSelected(null, function(tab) {
            resolve(tab);
        });
    });
}

async function updateActiveTabCounter () {
    try {
        const tab = await getSelectedTab();
        const url = new URL(tab.url);
        const data = await askBrief(url.hostname, url.pathname);

        if (data.page) {
            chrome.browserAction.setBadgeText({text: `${data.page}`});
            chrome.browserAction.setBadgeBackgroundColor({color: "#4E76A6"}, res => {});
        // } else if (data.host) {
        //     chrome.browserAction.setBadgeText({text: `${data.host}`});
        //     chrome.browserAction.setBadgeBackgroundColor({color: "#888888"}, res => {});
        } else {
            chrome.browserAction.setBadgeText({text: ``});
        }
    } catch (e) {
        chrome.browserAction.setBadgeText({text: ``});
        console.warn(e);
    }
}

async function askBrief (host, page) {
    const apiUrl = new URL(API_BASE + '/reports/brief');
    apiUrl.searchParams.append('host', host);
    apiUrl.searchParams.append('page', page);

    const res = await fetch(apiUrl);
    return await res.json();
}

