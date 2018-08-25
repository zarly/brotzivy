
const API_BASE = 'http://localhost:9000/v1';

const popup = {
    _counter: 0,
    _handlers: {},
    _callbacks: [],
    init () {
        window.addEventListener('message', this._onMessage.bind(this));
    },
    on (event, handler) {
        if (!this._handlers[event]) this._handlers[event] = [];
        this._handlers[event].push(handler);
    },
    call (name, args) {
        return new Promise((resolve, reject) => {
            this._callbacks.push((msg) => {
                this._callbacks[this.callbackIndex] = undefined;
                resolve(msg.result);
            });
            const callbackIndex = this._callbacks.length - 1;

            this._send({
                type: 'call',
                callbackIndex,
                name,
                args,
            });
        });
    },
    _send (msg) {
        window.top.postMessage(msg, '*');
    },
    _onMessage (msg) {
        const {data} = msg;
        console.log('message', data);

        if (data.type === 'callback') {
            this._callbacks[data.callbackIndex](data);
        }
        if (this._handlers[data.type]) {
            this._handlers[data.type].forEach(h => h(data));
        }
    },
    setItem (name, value) {
        return this.call('setItem', [name, value]);
    },
    getItem (name) {
        return this.call('getItem', [name]);
    },
};

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
            var appData = {
                initPromise: new Promise(function (resolve, reject) {
                    popup.init();
                    popup.on('sandboxInit', function (data) {
                        console.log('sandboxInit', appData)
                        appData.url = data.url;
                        appData.authToken = data.authToken;
                        appData.user = data.user;
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
            return appData;
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
                await this.initPromise;

                console.log('this.url', this.url);
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
                        'X-Auth': `Token ${this.authToken}`,
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
                    popup.setItem('user', user);

                    this.authToken = token;
                    popup.setItem('authToken', token);

                    this.returnReports();
                }
            },

            singOut () {
                this.user = null;
                popup.setItem('user', null);

                this.authToken = null;
                popup.setItem('authToken', null);

                this.returnReports();
            },
        },
    });
    console.groupEnd('Init');
}

window.addEventListener('DOMContentLoaded', init);
