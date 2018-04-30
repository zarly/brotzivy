
function init () {
    console.group('Init');
    var app = new Vue({
        el: '#app',
        data () {
            window.addEventListener('message', function (msg) {
                data.url = msg.data;
                alert(msg.data);
            });
            var data = {
                url: '-',
                message: 'Hello Vue!'
            };
            return data;
        },
    });
    console.groupEnd('Init');
}

window.addEventListener('DOMContentLoaded', init);
