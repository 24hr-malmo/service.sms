var zmq = require('zmq');
var zonar = require('zonar');

// setup
var z = zonar.create({ net: '24hr', name: 'sms.consumer' });
var socket = zmq.socket('sub');

z.on('found', function(serviceInfo) {

    console.log("FOUND");

    var address = "tcp://" + serviceInfo.address + ":" + serviceInfo.payload.pub;
    //console.log(address);

    socket.connect(address);

    socket.subscribe('all');

    socket.on('message', function(data) {
        console.log('received data ' + data.toString());
    });

});

z.listen();
//\function(err) {
    //console.log("df");        
//});

// Greacefully quit
process.on('SIGINT', function() {
    console.log("");
    z.stop(function() {
        console.log("Zonar has stoped");
        socket.close(function() { });
        process.exit(0);
    });
});



