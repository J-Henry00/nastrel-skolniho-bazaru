const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

const key = Buffer.from(process.env.ENC_KEY, 'hex');

function encrypt(password) {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let encryptedPw = cipher.update(password, 'utf8', 'hex');
	encryptedPw += cipher.final('hex');

	return `${iv.toString('hex')}:${encryptedPw}`;
}

function decrypt(encryptedData) {
	const parts = encryptedData.split(':');
	const iv = Buffer.from(parts.shift(), 'hex');
	const encryptedPw = parts.join(':');

	const decipher = crypto.createDecipheriv(algorithm, key, iv);

	let password = decipher.update(encryptedPw, 'hex', 'utf8');
	password += decipher.final('utf8');

	return password;
}

module.exports = {
	encrypt,
	decrypt,
};
