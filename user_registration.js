const express = require('express');
const oracledb = require('oracledb');
const fs = require('fs');
const properties = require('properties');
const winston = require('winston');
const crypto = require('crypto');

// Initialize Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// If not in production, also log to console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

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

function encryptPassword(password) {
	const config = readPropertiesFile();
	const encryptionKey=config.enc_key;
	const iv=config.enc_iv;
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));
	let encrypted = cipher.update(password, 'utf-8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}


// Function to establish connection to Oracle database
async function connectToDatabase() {
    const config = readPropertiesFile();
    const db_username = config.db_username;
    const db_password = decryptPassword();
    const db_connection_string = config.db_connection_string;

    try {
        const connection = await oracledb.getConnection({ user: db_username, password: db_password, connectString: db_connection_string });
        return connection;
    } catch (error) {
        logger.error(`Error connecting to the database: ${error.message}`);
        throw error;
    }
}

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    try {
        const connection = await connectToDatabase();

        const { username, password, confirmPassword, firstname, lastname, email, phone, address1, address2, city, state, zipcode, officePhone } = req.body;

        const passwordenc = encryptPassword(password);
		
		// Server-side validation

        // Insert user data into the database
        const result = await connection.execute(
            `INSERT INTO nodejs_users (username, password, firstname, lastname, email, phone, address1, address2, city, state, zipcode, office_phone) 
            VALUES (:username, :passwordenc, :firstname, :lastname, :email, :phone, :address1, :address2, :city, :state, :zipcode, :officePhone)`,
            {
                username,
                passwordenc,
                firstname,
                lastname,
                email,
                phone,
                address1,
                address2,
                city,
                state,
                zipcode,
                officePhone
            },
            { autoCommit: true }
        );

        await connection.close();

        res.status(200).send("User registered successfully!");
    } catch (error) {
        logger.error(`Error handling user registration: ${error.message}`);
        res.status(500).send("An error occurred while registering the user");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
