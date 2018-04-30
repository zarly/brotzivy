
chrome.browserAction.setBadgeText({text: '1'});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.browserAction.setBadgeText({text: '2'});
    chrome.browserAction.setPopup({popup: 'popup/index.html'});

    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function(tabs){
            alert(tabs[0].url);
        }
    );
});

chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");

    
    port.onMessage.addListener(function(msg) {
        chrome.tabs.getSelected(null, function(tab) {
            port.postMessage(tab.url);
        });
    });
});
