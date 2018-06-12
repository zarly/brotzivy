
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
            sendReport (mark) {
                if (!mark && !this.message) {
                    alert('Бро, оцени страницу или напиши что-нибудь');
                    return;
                }
                fetch(API_BASE + '/receive', {
                    method: 'POST',
                    body: JSON.stringify({
                        url: this.url,
                        message: this.message,
                        mark,
                    }),
                });
            }
        },
    });
    console.groupEnd('Init');
}

window.addEventListener('DOMContentLoaded', init);
