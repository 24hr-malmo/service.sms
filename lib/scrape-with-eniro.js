var miniRequest = require('./lib/mini-request');

exports.get = function get(cellNr, callback) {

    var searchUrl = "http://personer.eniro.se/resultat/" + cellNr + "/";

    miniRequest.get(searchUrl, function(err, body) {

        if (err) {
            return callback(err);
        }

        var re = /class="org">(.+?)</gi;
        var matches = re.exec(body);
        var name = matches ? matches[1] : "";

        if (name != '') {
            console.log("found org")
            callback(name);
        }
        else {

            re = /given-name">(.+?)</gi;
            matches = re.exec(body);

            var firstName = matches ? matches[1] : "";

            var lastRe = /class="family-name">(.+?)</gi;
            matches = lastRe.exec(body);

            var familyName = matches ? matches[1] : "";

            if (firstName != "" || familyName != "") {
                callback(firstName + " " + familyName);
            }
            else {
                callback("");
            }
        }


    });
}


