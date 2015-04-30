var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var fs = require('fs');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(request, response) {
    var obj = JSON.parse(fs.readFileSync('master.json', 'utf8'));
    var result = ' ';
    var times = process.env.TIMES || 5;
    for (i = 0; i < times; i++)
        result += cool();
    response.send(obj);
});

// POST method route
app.post('/', function (request, response) { // Return only private msg of user!!!!!

    var fest = JSON.parse(fs.readFileSync('master.json', 'utf8'));
    var user = request["body"]["user"];
    var componentName = request["body"]["componentName"];
    var action = request["body"]["action"];
    var resource = request["body"]["resource"];
    var resource2 = request["body"]["resource2"];
    

    if( action == "login"){
        var username = String(resource.username);
        var password = resource.password;
        var profiles = JSON.parse(fs.readFileSync('profiles.json', 'utf8'));
        if(username in profiles){
            if(profiles[username].password == password){
                fest["profile"] = profiles[username];
                user = username;
                
                // set user private thoughts
                var pvtThoughts4Usr = fest.thoughtJar.filter(function (element) {
                        return (element.name.toLowerCase() == String(user).toLowerCase() || element.name2.toLowerCase() == String(user).toLowerCase());
                });
                fest.thoughtJar = pvtThoughts4Usr;
                response.send(fest);
            }
            else{
                response.send({"failure": "true"});
            }
        }
        else{
            response.send({"failure": "true"});
        }
        
    }
    else if( action == "signup"){
        var profiles = JSON.parse(fs.readFileSync('profiles.json', 'utf8'));
        profiles.unshift(resource);
        var wstream = fs.createWriteStream('master.json');
        wstream.write(JSON.stringify(profiles));
            wstream.end();
        response.send(fest);
    }
    else{
        
        if(componentName == "thoughtCollector" && action == "append"){
            
            fest.thoughtCollector.unshift(resource);
            var wstream = fs.createWriteStream('master.json');
            wstream.write(JSON.stringify(fest));
            wstream.end();
        }
        else if(componentName == "thoughtJar" && action == "append"){
            var idxThread = -1;
            for(var i = 0; i < fest.thoughtJar.length; i++){
                if(resource.name.toLowerCase() == fest.thoughtJar[i].name.toLowerCase()){
                    console.log(fest.thoughtJar[i].name  + " " + i);
                    idxThread = i;
                }
            }
            
            if(idxThread > -1){
                fest.thoughtJar[idxThread].thoughts.unshift(resource.thoughts[0]);
                var wstream = fs.createWriteStream('master.json');
                wstream.write(JSON.stringify(fest));
                wstream.end();
            }
            else{
                fest.thoughtJar.unshift(resource);
                var wstream = fs.createWriteStream('master.json');
                wstream.write(JSON.stringify(fest));
                wstream.end();
            }
            
        }
        else if(componentName == "thoughtFest"){
            if(action == "add"){
                resource.id = Math.floor((Math.random() * 100000) + 1); 
                fest.thoughtFest.unshift(resource);
                var wstream = fs.createWriteStream('master.json');
                wstream.write(JSON.stringify(fest));
                wstream.end();
            }
            else{
                for (var i = 0; i < fest.thoughtFest.length; i++) {
                    if (fest.thoughtFest[i].id === resource2) {
                        fest.thoughtFest[i].thoughts.unshift(resource);
                    }
                }
                var wstream = fs.createWriteStream('master.json');
                wstream.write(JSON.stringify(fest));
                wstream.end();
            }
        }
        
        // set user private thoughts
        var pvtThoughts4Usr = fest.thoughtJar.filter(function (element) {
                return (element.name.toLowerCase() == String(user).toLowerCase() || element.name2.toLowerCase() == String(user).toLowerCase());
        });
        fest.thoughtJar = pvtThoughts4Usr;
        console.log(fest);
        response.send(fest);
    }
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


