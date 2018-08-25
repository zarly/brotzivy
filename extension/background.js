
fetch('http://localhost:9000/v1/reports/brief');

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
    fetch('http://localhost:9000/v1/reports/brief');

    
    port.onMessage.addListener(function(msg) {
        chrome.tabs.getSelected(null, function(tab) {
            const authToken = localStorage.getItem('authToken') || null;            
            port.postMessage({
                url: tab.url,
                authToken,
                user: {},
            });
        });
    });
});
