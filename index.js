var zmq = require('zmq');
var zonar = require('zonar');
var scraper = require('./lib/scrape-with-hitta');

var smsServer = require('./lib/sms').create('/46elks/sms', 8787);

// configs
var port = 6010;
var helpPort = 6011;
var address = "tcp://0.0.0.0:" + port;
var helpAddress = "tcp://0.0.0.0:" + helpPort;

// setup
var broadcaster = zonar.create({ net: '24hr', name: 'sms.pub' });

var socket = zmq.socket('pub');

broadcaster.payload = { 'pub': port, 'doc': helpPort };

smsServer.init(function() {

    socket.bind(address, function(err) {

        if (err) throw err;

        console.log("SMS publishing service started");

        broadcaster.start(function() {
            console.log("Broadcasting sms.pub");        
        });

        smsServer.on('incoming', function(sms) {


            if (sms.from) {

                scraper.get(sms.from, function(err, result) {

                    if (result) {
                        sms.name = result;
                    }

                    console.log(sms);

                    socket.send('all' + JSON.stringify(sms));
                    socket.send(sms.from + ' ' + JSON.stringify(sms));

                });

            }

        });

    });

});


// Greacefully quit
process.on('SIGINT', function() {
    console.log("");
    broadcaster.stop(function() {
        console.log("Zonar has stoped");
        socket.close(function() { });
        process.exit(0);
    });
});


// Help part
// ---------
// This is just a request-response pattern to serve the help
var helpSocket = zmq.socket('rep');
helpSocket.bind(helpAddress, function(err) {

    if (err) throw err;

    helpSocket.on('message', function(data) {
        socket.send(
            ''
            + ''
        );
    });

});
