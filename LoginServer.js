var express = require('express');

var app = express();

app.get('/login',function(req,res)
{
    res.send("test");
    console.log(req);
    console.log(res);
})

app.listen(1337);