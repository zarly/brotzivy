
const API_BASE = 'http://localhost:9000/v1';

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
    const tab = await getSelectedTab();
    const url = new URL(tab.url);
    const apiUrl = new URL(API_BASE + '/reports/brief');
    apiUrl.searchParams.append('host', url.hostname);
    apiUrl.searchParams.append('page', url.pathname);

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.page) {
        chrome.browserAction.setBadgeText({text: `${data.page}`});
        chrome.browserAction.setBadgeBackgroundColor({color: "#4444FF"}, res => {});
    } else if (data.host) {
        chrome.browserAction.setBadgeText({text: `${data.host}`});
        chrome.browserAction.setBadgeBackgroundColor({color: "#888888"}, res => {});
    } else {
        chrome.browserAction.setBadgeText({text: ``});
    }
}

