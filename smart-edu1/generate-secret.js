// Generate a secure NEXTAUTH_SECRET
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log('Your NEXTAUTH_SECRET:');
console.log(secret);
console.log('\nCopy this value and paste it in Vercel Environment Variables');
