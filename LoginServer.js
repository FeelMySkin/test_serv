const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var opfile;

fs.open("./test_site.html","r",(err,fd) => 
{
    
    fs.readFile(fd,(err,data) =>
    {
        opfile = data.toString();
    });
});
var app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.post('/login',urlencodedParser, function(req,res)
{
    console.log(req.body);
    var tst = req.body;
    console.log(tst.type);
    if(tst.type == undefined) res.send("Error post request");
    else
    {
        if(tst.type == "login") res.send("Received: " + req.body.login + req.body.pass);
        else if(req.body.type == 'register') res.send("Register: " + req.body.login + req.body.pass);
    }
    
});

app.listen(1337);
