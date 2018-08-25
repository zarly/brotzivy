
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
                    window.addEventListener('message', function ({data}) {
                        console.log('init', data)
                        data.url = data.url;
                        data.authToken = data.authToken;
                        resolve();
                    });
                }),
                url: '',
                message: '',
                reportSendingStage: 0,
                
                user: null,
                authToken: null,

                reports: [],
                totalCount: null,
            
                page: {
                    header: true,
                    reports: true,
                    footer: true,
                    send: false,
                    login: false,

                    name: 'reports',
                },

                story: {
                    lastAction: null,
                },

                loginForm: {
                    displayName: '',
                    inviteCode: '',
                    error: '',
                }
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

                this.reportSendingStage = 0;
                this.message = '';
                this.page.send = false;
                this.page.footer = true;

                await this.update();
            },
            onLeaveReportClick () {
                if (this.user) {
                    this.page.footer = false;
                    this.page.send = true;
                } else {
                    this.goLogin();
                    this.story.lastAction = 'leaveReport';
                }
            },
            goLogin () {
                this.page.name = 'login';
            },
            goInvite () {
                this.page.name = 'invite';
            },
            goProfile () {
                this.page.name = 'me';
            },
            returnReports () {
                this.page.name = 'reports';
            },
            goAbout () {
                alert('БРОтзывы это отзывы для своих');
            },

            setAuthToken (token) {
                this.authToken = token;
                // localStorage.setItem('authToken', token || '');
            },

            async onLoginSubmit () {
                const response = await fetch(API_BASE + '/user/signup', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            displayName: this.loginForm.displayName,
                            inviteCode: this.loginForm.inviteCode,
                        }),
                    })
                    .then(res => res.json())
                    .catch(err => ({message: err.toString()}));

                const {user, error, token} = response;
                if (error) {
                    this.loginForm.error = error.message;
                } else {
                    this.loginForm.displayName = '';
                    this.loginForm.inviteCode = '';
                    this.loginForm.error = '';
                    this.user = user;
                    this.setAuthToken(token);
                    this.returnReports();
                }
            }
        },
    });
    console.groupEnd('Init');
}

window.addEventListener('DOMContentLoaded', init);
