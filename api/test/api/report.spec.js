
process.env.NODE_ENV = 'testing';

let {Report} = require('../../models/report');

let config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let {init} = require('../..');

chai.use(chaiHttp);
const API_PATH = `/v${config.apiVersion}`;

describe('Report', () => {
    beforeEach(async () => {
        if (!global.server) {
            const {db, server} = await init();
            global.server = server;
            global.db = db;
        }
        global.db.Report.destroy({
            where: {},
            truncate: true
        }, (err) => {
           done();
        });
    });

    describe('/GET list', () => {
        it('it should return list of reports', (done) => {
            chai.request(global.server)
                .get(`${API_PATH}/reports/list?`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.count.should.be.equal(0);
                    res.body.rows.should.be.an('array');
                    done();
                });
        });
    });
});
