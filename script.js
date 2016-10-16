// A $( document ).ready() block.
$(document).ready(function() {
    // https://en.wikipedia.org/w/api.php\?action\=query\&prop\=extracts\&exintro\&explaintext\&titles\=Boulder,_Colorado
    queryWikipedia("Martinez, California", stripSpecialChars)
});

function queryWikipedia(query, cb) {
    // make ajax request
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            titles: query,
            redirects: true,
            format: 'json',
            section: 0
        },
        dataType: 'jsonp',
        success: function(response) {
            // console.log(response);
            // debugger
            text = response.query.pages[Object.keys(response.query.pages)[0]].extract
            $(".container").html(text)
            cb(text)
        }
    });
    // return string
}

function stripSpecialChars(str) {
    var re = / \(.*\)/
    console.log(str.replace(re, ""))
}
