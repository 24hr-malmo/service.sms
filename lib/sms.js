var querystring = require('querystring');
var events = require('events');
var http = require('http');

var defaultOptions = {
    port: 80
};


function Sms(endpoint, port) {

    this._endpoint = endpoint;
    this._port = port || defaultOptions.port;

    events.EventEmitter.call(this);

}

Sms.prototype.__proto__ = events.EventEmitter.prototype;

Sms.prototype.smsRoute = function(req, res) {

    var self = this;

    var data = "";

    req.on("data", function(chunk) {
        data += chunk;
    });

    req.on("end", function() {

        var body = querystring.parse(data);

        var from = body.from ? "0" + body.from.replace(/\D/g, '').replace(/^46/g, '') : null;
        var to = body.to ? "0" + body.to.replace(/\D/g, '').replace(/^46/g, '') : null;

        res.end("");

        self.emit('incoming', {
            from: from,
            to: to,
            message: body.message
        });

    });

}

Sms.prototype.stop = function(next) {
    this.server.close(next);
}

Sms.prototype.init = function(next) {

    var self = this;

    self.server = http.createServer(function (req, res) {

        res.writeHead(200, {'Content-Type': 'text/plain'});

        if (req.path == self.endpoint && req.method == "POST") {
            self.smsRoute(req, res);
        } else {
            res.end('This is the endpoint for the sms service');
        }

    });

    self.server.listen(self._port, next);

};

exports.create = function(endpoint, port) {
    return new Sms(endpoint, port);
}
