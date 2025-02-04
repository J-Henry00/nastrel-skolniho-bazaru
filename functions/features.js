const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'features.json');
let db = JSON.parse(fs.readFileSync(dbPath));

function getAll() {
	return db;
}

function getOne(id) {
	return db[id];
}

function set(id, value) {
	db[id] = value;
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
	return true;
}

function setMultiple(object) {
	for (const obj in object) db[obj] = object[obj];
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
	return true;
}

module.exports = {
	getAll,
	getOne,
	set,
	setMultiple,
};
