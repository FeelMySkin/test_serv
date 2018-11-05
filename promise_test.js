const Crypto = require('crypto');

var hash = Crypto.createHash('sha256');
hash.write('tst');

console.log("Start");


hash.on('readable',function()
{
    console.log('hash: ' + hash.read().toString('hex'));
});

hash.end();
console.log("End");