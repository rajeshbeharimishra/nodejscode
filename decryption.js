const crypto = require('crypto');
const properties = require('properties');
const winston = require('winston');
const fs = require('fs');

// Initialize Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error_decrypt.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined_decrypt.log' })
    ]
});

// Function to read properties from the config file
function readPropertiesFile() {
    try {
        const config = properties.parse(fs.readFileSync('config.properties', 'utf8'));
        return config;
    } catch (error) {
        logger.error(`Error reading properties file: ${error.message}`);
        throw error;
    }
}

// Decrypting the Encrypted String
function decryptPassword() {
	const config = readPropertiesFile();
	const encryptedPassword=config.enc_pwd;
	const encryptionKey=config.enc_key;
	const iv=config.enc_iv;
	
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
	logger.info('Encrypted Password is successfully decrypted');
}

const decryptedPassword = decryptPassword();
console.log('Decrypted Password:', decryptedPassword);


