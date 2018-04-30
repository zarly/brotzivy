
const frame = {
    element: null,
    init: function () {
        this.element = document.getElementById('sandboxFrame');
        this.element.src = '../sandbox/index.html';
        return new Promise(function (resolve, reject) {
            this.element.addEventListener('load', function () {
                resolve();
            });
            this.element.addEventListener('error', function (error) {
                reject(error);
            });
        }.bind(this));
    },
    postMessage: function (msg) {
        this.element.contentWindow.postMessage(msg, '*');
    }
};

async function init () {
    await frame.init();

    var port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function(msg) {
        frame.postMessage(msg, '*');
    });
}

window.addEventListener('DOMContentLoaded', init);
// setTimeout(init, 10000);
