var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var fs = require('fs');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    var obj = JSON.parse(fs.readFileSync('master.json', 'utf8'));
    var result = ' ';
    var times = process.env.TIMES || 5;
    for (i = 0; i < times; i++)
        result += cool();
    response.send(obj);
});

// POST method route
app.post('/', function (request, response) {
    var festJson = JSON.parse(fs.readFileSync('master.json', 'utf8'));
    response.send(festJson);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
