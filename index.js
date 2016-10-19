// https://en.wikipedia.org/w/api.php\?action\=query\&prop\=extracts\&exintro\&explaintext\&titles\=Boulder,_Colorado
var express = require('express');
var app = express();
var https = require('https');

// http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function(req, res) {
    // console.log(req.query['params'])
    query = req.query['params']
    console.log("hit /, query is ", query)

    queryWikipedia(query, function(text) {
        console.log("inside cb ", text.substring(0, 15))
        stripSpecialChars(text, function(stripped){
        res.send(stripped)
        })
    })

    // res.send("hello world");
});

var port = process.argv[2] || process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Example app listening on port ' + port);
});


function queryWikipedia(query, cb) {
    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    console.log("inside queryWikipedia, query is ", query)
    path = '/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles=' + query
    // console.log("path ", path)
    var options = {
        host: 'en.wikipedia.org',
        path: path
    };

    callback = function(response) {
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });
        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            // console.log("inside https.request callback ", str.substring(0, 15));
            // console.log("typeof ", typeof str)
            // console.log("typeof ", typeof JSON.parse(str))
            obj = JSON.parse(str)
            // console.log(obj)
            // console.log("text? ", obj.query.pages[Object.keys(obj.query.pages)[0]].extract)
            var text = obj.query.pages[Object.keys(obj.query.pages)[0]].extract
            console.log("inside queryWikipedia callback, text is: ", text)
            cb(text)
        });
    }
    https.request(options, callback).end();
}


function stripSpecialChars(str, cb) {
    var re = / \(.*\)/
    // console.log(str.replace(re, ""))
    var stripped = str.replace(re, "")

    console.log("inside stripSpecialChars stripped is: " + stripped)
    cb(stripped)
}
