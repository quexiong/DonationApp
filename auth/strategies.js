'use strict';
const	// { Strategy: LocalStrategy } = require('passport-local'),
		{ Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'),
		//{ User } = require('../models/user'),
		{ JWT_SECRET } = require('../config');

// const localStrategy = new LocalStrategy({usernameField: 'EmailAddress'}, (EmailAddress, password, callback) => {
// 	let user;
//  	User.findOne({ EmailAddress })
//  		.then(_user => {
//  			user = _user;
//  			if (!user) {
//  				// Return a rejected promise so we break out of the chain of .thens.
//         		// Any errors like this will be handled in the catch block.
//         		return Promise.reject({
//         			reason: 'LoginError',
//           			message: 'Incorrect email address or password'
//           		});
//         	}

//         	return user.validatePassword(password);
//         })
//         .then(isValid => {
//         	if (!isValid) {
//         		return Promise.reject({
//         			reason: 'LoginError',
//           			message: 'Incorrect email address or password'
//           		});
//         	}

//         	return callback(null, user);
//         })
//         .catch(err => {
//         	if (err.reason === 'LoginError') {
//         		return callback(null, false, err);
//         	}

//         	return callback(err, false);
//         });
//     });

const jwtStrategy = new JwtStrategy({
	secretOrKey: JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
	algorithms: ['HS256']
	},

	(payload, done) => {
		done(null, payload.user);
});

module.exports =  jwtStrategy;