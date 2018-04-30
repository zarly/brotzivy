
const frame = {
    element: null,
    init: function () {
        this.element = document.getElementById('sandboxFrame');
    },
    onLoaded: function () {
        return new Promise(function (resolve, reject) {
            if (this.isLoaded()) return resolve();

            this.element.addEventListener('load', function () {
                resolve();
            });
            this.element.addEventListener('error', function (error) {
                reject(error);
            });
        }.bind(this));
    },
    isLoaded: function () {
        var iframeDoc = this.element.contentDocument || this.element.contentWindow.document;
        return iframeDoc.readyState === 'complete';
    },
    postMessage: function (msg) {
        this.element.contentWindow.postMessage(msg, '*');
    }
};

function init () {
    frame.init();

    var port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function(msg) {
        console.log('message recieved:', msg);
        frame.onLoaded().then(function () {
            frame.postMessage(msg, '*');
            console.log('message sent');
        });
    });
}

window.addEventListener('DOMContentLoaded', init);
// setTimeout(init, 10000);
