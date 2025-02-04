const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'posts.json');
let db = JSON.parse(fs.readFileSync(dbPath));

function getData() {
	return db;
}

function getOne(i) {
	return db[i];
}

module.exports = {
	getData,
	getOne,
};
