var should = require("should");
var sinon = require("sinon");
var request = require("request");

describe("Get SMS", function() {

    var sms;

    beforeEach(function(done) {
        sms = require('../lib/sms').create("/foo", 9090);
        sms.init(done);
    });

    afterEach(function(done) {
        sms.stop(done);
    });

    it("will have a http server that responds with a text when called on every endpoint but one", function(done) {
        
        request.get("http://localhost:9090/foo", function(err, res, body) {
            body.should.containEql("This is the endpoint");
            done();
        });

    });


    it("will emit an event when a POST request is requested to the endpoint", function(done) {

        sms.on("incoming", function(smsItem) {
            smsItem.from.should.equal("0707776018");
            done();
        });

        request.post("http://localhost:9090/foo", { form: { from: "707776018" } } );

    });

});


