
process.env.NODE_ENV = 'testing';

let config = require('config');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let {init} = require('../..');

chai.use(chaiHttp);
const API_PATH = `/v${config.apiVersion}`;

describe('API Service', () => {
    beforeEach(async () => {
        if (!global.server) {
            const {db, server} = await init();
            global.server = server;
            global.db = db;
        }
    });

    describe('/GET ping', () => {
        it('it should respond pong', (done) => {
            chai.request(global.server)
                .get(`${API_PATH}/ping`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.pong.should.be.equal(true);
                    done();
                });
        });
    });
});
