
const API_BASE = 'http://localhost:9000';

function init () {
    console.group('Init');
    var app = new Vue({
        el: '#app',
        data () {
            window.addEventListener('message', function (msg) {
                data.url = msg.data;
            });
            var data = {
                url: '-',
                message: '',
                reports: [1,2,3],
            };
            return data;
        },
        async created () {
            const res = await fetch(API_BASE + '/reports');
        },
        methods: {
            sendReport () {
                console.log('FFF');
                alert(this.message);
            }
        },
    });
    console.groupEnd('Init');
}

window.addEventListener('DOMContentLoaded', init);
