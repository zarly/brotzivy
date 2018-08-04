
const API_BASE = 'http://localhost:9000/v1';

function formatDate (date) {
    const Y = date.substr(0, 4);
    const M = date.substr(5, 2);
    const D = date.substr(8, 2);
    return D + '.' + M + '.' + Y;
}

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
                const apiUrl = new URL(API_BASE + '/reports/list');
                apiUrl.searchParams.append('host', pageUrl.host);
                apiUrl.searchParams.append('page', pageUrl.pathname);

                const res = await fetch(apiUrl);
                const data = await res.json();
                this.reports = data.rows.map(report => {
                    const mark = ('number' === typeof report.mark) ? (report.mark - 5) : 0;
                    return {
                        author: report.author || 'Аноним',
                        date: formatDate(report.createdAt),
                        message: report.message,
                        mark: (mark > 0) ? ('+' + mark) : ('' + mark),
                        markColor: (mark > 3) ? '#0a8' : 
                                   (mark < -3) ? '#c44' : 
                                   (mark > 0 || mark < 0) ? '#aa0' :
                                   'transparent',
                    };
                });
                this.totalCount = data.count;
            },
            async sendReport (mark) {
                if (!mark && !this.message) {
                    alert('Бро, оцени страницу или напиши что-нибудь');
                    return;
                }

                this.reportSendingStage = 1;
                await fetch(API_BASE + '/reports/write', {
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
