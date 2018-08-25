
fetch('http://localhost:9000/v1/reports/brief');

let count = 1;

chrome.browserAction.setBadgeText({text: '' + count++});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.browserAction.setBadgeText({text: '' + count++});
    chrome.browserAction.setPopup({popup: 'popup/index.html'});

    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function(tabs){
            alert(tabs[0].url);
        }
    );
});

chrome.extension.onConnect.addListener(function(port) {
    chrome.browserAction.setBadgeText({text: '' + count++});
    console.log("Connected .....");
    fetch('http://localhost:9000/v1/reports/brief');

    
    port.onMessage.addListener(function(msg) {
        switch (msg.type) {
            case 'init':
                chrome.tabs.getSelected(null, function(tab) {
                    const authToken = localStorage.getItem('authToken') || null;            
                    port.postMessage({
                        type: 'sandboxInit',
                        url: tab.url,
                    });
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
