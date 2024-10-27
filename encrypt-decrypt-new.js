const crypto = require('crypto');
const fs = require('fs');

function encryptPassword(password, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(password, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const password = 'fms_schema1';
const key = crypto.randomBytes(32); // Generate a random 256-bit key
const iv = crypto.randomBytes(16); // Generate a random 128-bit IV

const encryptedPassword = encryptPassword(password, key, iv);

console.log('Encrypted Password:', encryptedPassword);

// Save the key and IV securely
fs.writeFileSync('key.txt', key.toString('hex'));
fs.writeFileSync('iv.txt', iv.toString('hex'));
