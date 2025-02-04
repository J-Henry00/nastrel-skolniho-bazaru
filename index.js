require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// custom tools
const logger = require('./logger');
const posts = require('./functions/posts');
const features = require('./functions/features');
const users = require('./functions/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		secret: 'gfhgiujewrghgherhtrh5656tr4h9tr4h89tr4h89tr4jhytrjyt4j89yt4',
		cookie: {
			maxAge: 1000 * 60,
			secure: false,
		},
		resave: false,
		saveUninitialized: false,
	})
);
app.use('/', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', './views');

function loadData() {
	return examplePosts;
}

app.get('/', async (req, res) => {
	var data = posts.getData();

	res.render('index', {
		data,
		instance: 'homepage',
		user: req.session.user,
	});
});

app.get('/post/:id', async (req, res) => {
	var data = posts.getOne(req.params.id);

	res.render('post', {
		data,
		instance: 'post',
		user: req.session.user,
	});
});

app.get('/o-nas', (req, res) => {
	res.render('about', {
		instance: 'about',
		user: req.session.user,
	});
});
app.get('/kontakt', (req, res) => {
	res.render('contact', {
		instance: 'contact',
		user: req.session.user,
	});
});
app.get('/admin', (req, res) => {
	res.render('admin', {
		instance: req.session.user ? 'admin_LoggedIn' : 'admin_LogIn',
		user: req.session.user,
		allowUserRegistration: features.getOne('allowUserRegistration'),
	});
});
app.post('/admin', (req, res) => {
	if (!users.authorizeUser(req.body.username, req.body.password))
		return res.render('admin', {
			instance: 'admin_LogIn_failed',
			user: req.session.user,
			allowUserRegistration: features.getOne('allowUserRegistration'),
		});

	req.session.user = req.body.username;
	res.render('admin', {
		instance: 'admin_LoggedIn',
		user: req.session.user,
		allowUserRegistration: features.getOne('allowUserRegistration'),
	});
});
app.get('/pridat', (req, res) => res.render('pridat'));
app.get('/odhlasit-se', (req, res) => {
	if (req.session.user)
		req.session.destroy((err) => {
			if (err) {
				console.error(err);
				return res.sendStatus(500);
			}
			return res.redirect('/admin');
		});
	else return res.redirect('/');
});
app.post('/admin/features', (req, res) => {
	const data = {
		allowUserRegistration: req.body.allowUserRegistration == 'on',
	};

	features.setMultiple(data);
	return res.redirect('/');
});
app.get('/registrace', (req, res) => {
	if (req.session.user) return res.redirect('/');

	res.render('registrace', {
		allowUserRegistration: features.getOne('allowUserRegistration'),
		instance: 'register',
		user: req.session.user,
	});
});
app.post('/registrace', (req, res) => {
	var { username, password, instagram, email } = req.body;
	users.addUser(username, password, email, instagram);
	res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.log(`Listening on port ${PORT}`));
