var express = require('express');
const bodyParser = require("body-parser");

var app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.post('/login',urlencodedParser, function(req,res)
{
    //res.send("post");
    console.log(req.get('content-type'));
    console.log(req.header('content-type'));
    console.log(req.body);
    res.send("Received: " + req.body.login + req.body.pass);
});

app.get('/login',function(req,res)
{
    res.send('<head></head>\
    <body>\
    <h1 id="test1">test</h1>\
    <form enctype="application/x-www-form-urlencoded" action="http://127.0.0.1:1337/login" method="POST">\
        <input type="text" size="80" name="login">\
        <input type="password" name="pass">\
        <input type="submit" value="send">\
    </form>\
    </body>');
    console.log(req.params);
});

app.listen(1337);