
const API_BASE = 'http://localhost:9000';

function init () {
    console.group('Init');
    var app = new Vue({
        el: '#app',
        data () {
            var data = {
                initPromise: new Promise(function (resolve, reject) {
                    window.addEventListener('message', function (msg) {
                        data.url = msg.data;
                        resolve();
                    });
                }),
                url: '',
                message: '',
                reportSendingStage: 0,

                reports: [],
                totalCount: null,
            
            };
            return data;
        },
        computed: {
            reportsWithMessages () {
                return this.reports.filter(o => o.message);
            }
        },
        async created () {
            await this.initPromise;
            await this.update();
        },
        methods: {
            async update () {
                const pageUrl = new URL(this.url);
                const apiUrl = new URL(API_BASE + '/reports');
                apiUrl.searchParams.append('host', pageUrl.host);
                apiUrl.searchParams.append('page', pageUrl.pathname);

                const res = await fetch(apiUrl);
                const data = await res.json();
                this.reports = data.rows;
                this.totalCount = data.count;
            },
            async sendReport (mark) {
                if (!mark && !this.message) {
                    alert('Бро, оцени страницу или напиши что-нибудь');
                    return;
                }

                this.reportSendingStage = 1;
                await fetch(API_BASE + '/write', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: this.url,
                        message: this.message,
                        mark,
                    }),
                });

                this.reportSendingStage = 2;

                await this.update();
            }
        },
    });
    console.groupEnd('Init');
}

window.addEventListener('DOMContentLoaded', init);
