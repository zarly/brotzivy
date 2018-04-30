
function init () {
    console.group('Init');
    var app = new Vue({
        el: '#app',
        data: {
            url: '-',
            message: 'Hello Vue!'
        }
    });
    console.groupEnd('Init');
}

window.addEventListener('load', init);
