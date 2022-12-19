const crypto = require('crypto');

const generated = crypto.randomBytes(64).toString('hex');

console.log(generated);
