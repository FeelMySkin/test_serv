const Crypto = require('crypto');

var hash = Crypto.createHash('sha256');
hash.write('tst');

hash.on('ready',function()
{
    console.log('hash: ' + hash.read().toString('hex'));
});

hash.end();