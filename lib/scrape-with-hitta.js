var miniRequest = require('./mini-request');

exports.get = function getFromHitta(cellNr, callback) {

    var url = "http://www.hitta.se/" + cellNr + "/f%C3%B6retag_och_personer";

    miniRequest.get(url, function (err, body, response) {

        if (err) {
            return callback(err);
        }

        var searchUrl = response.headers.location;
        var nameRe = /www\.hitta\.se\/(.*?)\//gi;
        var matches = nameRe.exec(searchUrl);
        var name = matches ? matches[1] : "";
        var name = decodeURI(name).replace(/\+/g, " ");

        callback(null, name);

        return;

    });

}

