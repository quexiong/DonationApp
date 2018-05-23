'use strict';

const	express = require('express'),
		bodyParser = require('body-parser'),
		jsonParser = bodyParser.json(),
		router = express.Router(),
		{User} = require('../models/user'),
		path = require('path'),
		passport = require('passport'),
		jwt = require('jsonwebtoken'),
		bcrypt = require('bcryptjs'),
		{JWT_SECRET, JWT_EXPIRY} = require('../config'),
		jwtStrategy = require('../auth/strategies');

router.get('/', (req, res) => {
	res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});

const createAuthToken = function(user) {
	return 	jwt.sign({user}, JWT_SECRET, {
			subject: user.username,
			expiresIn: JWT_EXPIRY,
			algorithm: 'HS256'
	});
};

router.post('/', jsonParser, (req, res) => {
	let user;
  	return User.findOne({username: req.body.username})
		.then(_user => {
			user = _user;
			if (!user) {
				return Promise.reject({
					code: 404,
					message: 'user not found',
					location: 'username'
				});
			}
			return user.validatePassword(req.body.password);
		})
		.then(passwordIsValid => {
			if (!passwordIsValid) {
				return Promise.reject({
					code: 403,
					message: 'username or password incorrect'
				});
			}
			const authToken = createAuthToken(user.serialize());
			return res.json({authToken});
		})
		.catch(err => {
			return res.status(err.code).json(err);
		});
});

passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/refresh', jwtAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
  	res.json({authToken});
});

module.exports = router;