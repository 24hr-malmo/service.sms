var http = require('http');

exports.get = function getUrlContent(url, callback) {

    var parsedUrl = url.replace(/htt.*?\:\/\//, "");

    var urlParts = parsedUrl.split("/");
    var host = urlParts[0];
    var path = parsedUrl.replace(host, "");

    var body = "";
    var data = null;
    var bodyLength = 0;

    var request = http.request({
        port: 80,
        host: host, 
        path: path,
        'user-agent': "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.15) Gecko/20110303 Firefox/3.6.15"
    });

    request.on('response', function (response) {

        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on("error", function() {
            callback(err);
        })
 
        response.on("end", function() {
            callback(null, body, response);
        })
    });

    request.end();
}

