const fs = require('fs');
const path = require('path');

const pw = require('./passwords');

const dbPath = path.join(__dirname, '..', 'database', 'users.json');
let db = JSON.parse(fs.readFileSync(dbPath));

const roles = JSON.parse(
	fs.readFileSync(path.join(__dirname, '..', 'database', 'roles.json'))
);

function addUser(name, password, email, instagram, role = 'guest') {
	for (const [roleName, users] of Object.entries(roles)) {
		if (users.includes(name)) {
			role = roleName;
			break;
		}
	}

	password = pw.encrypt(password);

	var user = {
		name,
		role,
		contact: email,
		instagram,
		pw: password,
	};

	db.push(user);

	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
	return;
}

function authorizeUser(name, password) {
	var user = db.find((u) => u.name == name);
	if (!user) return;

	return password == pw.decrypt(user.pw);
}

function getUser(name) {
	return db.find((user) => user.name == name);
}

module.exports = {
	addUser,
	authorizeUser,
	getUser,
};
