const Crypto = require('crypto');

console.log("Start");

function Hashable()
{
    return new Promise(function(resolve, reject)
    {
        var hash2 = Crypto.createHash("sha256");
        hash2.write('tst');
        hash2.end();

        hash2.on('readable',function()
        {
            resolve(hash2.read());
        });

    });
}

var tim1 = Date.now();
var hash = Crypto.createHash('sha256');
hash.write('tst');
hash.on('readable',function()
{
    console.log("Event: ");
    console.log('hash: ' + hash.read().toString('hex'));
    console.log("Time: " + (Date.now() - tim1).toString());
});
hash.end();

var tim2 = Date.now();
Hashable().then(
    data => 
    {
        console.log("Promise:");
        console.log(data.toString());
        console.log("Time: " + (Date.now() - tim2).toString());
        return "OK";
    },

    error =>
    {

    }
).then(function(data)
    {
        console.log(data);
    }
);
console.log("End");

function Test()
{
    return new Promise((resolve,reject) =>
    {
        reject("test_err");
    });
}

Test()
.then(
    result => {console.log(result); return "test2";},
    error => {console.log(error); throw error+1;}
)
.then(
    result => {console.log(result);}
)
.catch(
    error => console.log(error)
);