'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
		
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''}
});

userSchema.methods.serialize = function() {
    return {
  	    id: this._id,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName
    };
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};