
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
    },
};

const remoteFunctions = {
    setItem (name, value) {
        const strValue = JSON.stringify(value);
        localStorage.setItem(name, strValue);
    },
    getItem (name) {
        const strValue = localStorage.getItem(name);
        return JSON.parse(strValue);
    },
};

async function init () {
    await frame.init();

    var port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.onMessage.addListener(function(msg) {
        if (msg.type === 'sandboxInit') {
            msg.authToken = remoteFunctions.getItem('authToken');
            msg.user = remoteFunctions.getItem('user');
        }
        frame.postMessage(msg, '*');
    });
    port.postMessage({type: 'init'});

    window.addEventListener('message', async function ({data, source}) {
        if (source !== frame.element.contentWindow) throw new Error('Unknown source of the message');

        switch (data.type) {
            case 'call':
                const result = await remoteFunctions[data.name].apply(remoteFunctions, data.args);
                frame.postMessage({
                    type: 'callback',
                    callbackIndex: data.callbackIndex,
                    result,
                }, '*');
            case 'save':
                localStorage.setItem(data.name, data.value);
                break;
            case 'load':
                const value = localStorage.getItem(data.name);
                frame.postMessage({
                    type: 'load_answer',
                    name: data.name,
                    value: value,
                }, '*');
                break;
            default:
                console.warn('Unknown message type', data.type, data);
        }
    });
}

window.addEventListener('DOMContentLoaded', init);
// setTimeout(init, 10000);
