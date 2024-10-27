const crypto = require('crypto');

// Encryption
function encryptPassword(password, encryptionKey, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');
    return encryptedPassword;
}

// Decryption
function decryptPassword(encryptedPassword, encryptionKey, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf-8');
    decryptedPassword += decipher.final('utf-8');
    return decryptedPassword;
}

// Example usage
const password = 'Data360@DQ+';
const encryptionKey = crypto.randomBytes(32); // Generate a random key
console.log('encryptionKey:', encryptionKey)
const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
console.log('Initialization Vector:', iv)

const encryptedPassword = encryptPassword(password, encryptionKey, iv);
console.log('Encrypted Password:', encryptedPassword);

const decryptedPassword = decryptPassword(encryptedPassword, encryptionKey, iv);
console.log('Decrypted Password:', decryptedPassword);
