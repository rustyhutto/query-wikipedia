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
    query = req.query['params']

    console.log("hit /, query is ", query)
    // console.log(res)

    // res.send("query was = " + query)
    // queryWiki(query, processText.bind(null, res))
    queryWiki(query, processText)

});

function queryWiki(query, cb) {
    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    console.log(cb)
    console.log("inside queryWiki, query=" + query)

    path = '/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles=' + query
    var options = {
        host: 'en.wikipedia.org',
        path: path
    };
    https.request(options, callback).end();
    function callback(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function() {
            obj = JSON.parse(str)
            var text = obj.query.pages[Object.keys(obj.query.pages)[0]].extract
            console.log("inside queryWiki callback, text is: ", text)
            cb(text, sendProcessedText)
        });
    }
}

function processText(text, cb) {
  console.log("inside processText text="+text)
  console.log(cb)
  deleteAroundParenthesis(text, cb)
}

function sendProcessedText(processedText, cb) {
  console.log("inside sendProcessedText, processedText="+processedText)
  // res.send(processedText)
}

function deleteAroundParenthesis(str, cb) {
    var re = / \(.*\)/
    var processedText = str.replace(re, "")
    console.log("inside deleteAroundParenthesis stripped is: " + processedText)
    cb(processedText, cb)
}

var port = process.argv[2] || process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Example app listening on port ' + port);
});
