const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

var opfile;

fs.open("./test_site.html","r",(err,fd) => 
{
    
    fs.readFile(fd,(err,data) =>
    {
        opfile = data.toString();
    });
});
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/login', function(req,res)
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

app.get('/',function(req,res)
{
    res.setHeader('set-cookie',cookie.serialize('name','test', { maxAge: 60*60*24*7}));
    res.setHeader('set-cookie',cookie.serialize('name2','test2', { maxAge: 60*60*24*7}));
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.send(opfile);

});

app.listen(1337);
