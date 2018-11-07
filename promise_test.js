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
        console.log(data.toString('hex'));
        console.log("Time: " + (Date.now() - tim2).toString());
    },

    error =>
    {

    }
)
console.log("End");