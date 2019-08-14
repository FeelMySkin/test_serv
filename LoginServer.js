const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const session = require('express-session');
const User = require('./DataBaseController');
const pgSession = require('connect-pg-simple')(session);

var opfile;

fs.open("./test_site.html","r",(err,fd) => 
{
    
    fs.readFile(fd,(err,data) =>
    {
        opfile = data.toString();
    });
});
var app = express();
app.set('trust proxy',1);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'secret', store: new pgSession({pool: User.pool}),resave: false, cookie: {maxAge: 30*24*60*60*1000}}));

app.post('/login', function(req,res)
{
    console.log(req.body);
    var tst = req.body;
    console.log(tst.type);
    if(tst.type == undefined || tst.login == undefined || tst.pass == undefined) res.send("Error post request");
    else
    {
        if(tst.type == "login")
        {
            User.UserExists(req.body.login).then(resolver => {
                if(resolver)
                {
                    res.setHeader('set-cookie',cookie.serialize('login',req.body.login, {maxAge: 30*24*60*60*1000}));
                    res.send("Login exists");
                }
                else res.send("Login not exists");
            });
        }
        else if(req.body.type == 'register')
        {
            console.log('reg_init');
            User.RegisterUser(req.body.login,req.body.pass)
            .then( success => {console.log(success); res.send(" Register " + success + ": " + req.body.login + req.body.pass);},
                    exists => {console.log(exists); res.send(exists);});
        }
    }
    
});

app.get('/',function(req,res)
{
    res.setHeader('set-cookie',cookie.serialize('name3','test3', { maxAge: 60*60*24*7}));
    res.setHeader('set-cookie',cookie.serialize('name2','test2', { maxAge: 60*60*24*7}));
    console.log(req.cookies);
    console.log(req.signedCookies);
    console.log(req.session);
    console.log(req.sessionID);
    console.log(req.cookies.sessionID);
    res.send(opfile);

});

app.get('/test',function(req,res)
{
    User.GetAllRows('test_table').then(resolve => {
        console.log(resolve);
        res.send(resolve);
    });
    
});

app.listen(1337);
