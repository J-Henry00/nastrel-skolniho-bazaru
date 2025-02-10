require('dotenv').config();

const express = require('express');

const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');

const app = express();

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

// custom tools
const logger = require('./logger');
const posts = require('./functions/posts');
const features = require('./functions/features');
const users = require('./functions/users');
const storage = multer.diskStorage({
	destination: (req, file, cb) =>
		cb(null, `${require('path').join(__dirname, 'uploads')}`),
	filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });
const checkUserSession = (req, res, next) => {
	if (!req.session.user) {
		return res.redirect('/');
	}
	next();
};

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
app.use('/images', express.static(__dirname + '/uploads'));

app.set('view engine', 'ejs');
app.set('views', './views');

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
		allowPostAddition: features.getOne('allowPostAddition'),
	});
});
app.post('/admin', (req, res) => {
	if (!users.authorizeUser(req.body.username, req.body.password))
		return res.render('admin', {
			instance: 'admin_LogIn_failed',
			user: req.session.user,
			allowUserRegistration: features.getOne('allowUserRegistration'),
			allowPostAddition: features.getOne('allowPostAddition'),
		});

	req.session.user = users.getUser(req.body.username);
	res.render('admin', {
		instance: 'admin_LoggedIn',
		user: req.session.user,
		allowUserRegistration: features.getOne('allowUserRegistration'),
		allowPostAddition: features.getOne('allowPostAddition'),
	});
});
app.get('/odhlasit-se', checkUserSession, (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error(err);
			return res.sendStatus(500);
		}
		return res.redirect('/admin');
	});
});
app.post('/admin/features', checkUserSession, (req, res) => {
	if (req.session.user.role != 'admin') return res.redirect('/');
	const data = {
		allowUserRegistration: req.body.allowUserRegistration == 'on',
		allowPostAddition: req.body.allowPostAddition == 'on',
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
app.get('/pridat', checkUserSession, (req, res) =>
	req.session.user.role != 'guest'
		? res.render('pridat', {
				instance: 'addPost',
				user: req.session.user,
				allowPostAddition: features.getOne('allowPostAddition'),
		  })
		: res.redirect('/')
);

app.post(
	'/pridat',
	checkUserSession,
	(req, res, next) => {
		if (req.session.user.role == 'guest') {
			return res.redirect('/');
		}
		next();
	},
	upload.array('images'),
	(req, res) => {
		let data = {
			description: req.body.description,
			url: req.body.instagram,
			images: [],
		};
		req.files.forEach((img) => {
			data.images.push(`/images/${img.filename}`);
		});
		var id = posts.addOne(data);
		return res.redirect(`/post/${id}`);
	}
);
app.get(
	'/odstranit/:id',
	checkUserSession,
	(req, res, next) => {
		if (req.session.user.role == 'guest') {
			return res.redirect('/');
		}
		next();
	},
	(req, res) => {
		posts.removeOne(req.params.id);
		return res.redirect('/');
	}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.log(`Listening on port ${PORT}`));
