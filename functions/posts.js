const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');

const dbPath = path.join(__dirname, '..', 'database', 'posts.json');
let db = JSON.parse(fs.readFileSync(dbPath));

function getData() {
	return db;
}

function getOne(id) {
	return db.find((item) => item.id == id);
}

function addOne(data) {
	const post = { ...data, id: v4() };
	db.push(post);
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
	return post.id;
}

function removeOne(id) {
	db.find((item) => item.id == id).images.forEach((img) => {
		fs.rmSync(
			path.join(__dirname, '..', 'uploads', img.replace('/images/', ''))
		);
	});
	db = db.filter((item) => item.id != id);
	fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
	return;
}

module.exports = {
	getData,
	getOne,
	addOne,
	removeOne,
};
