'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const donationSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},

	purpose: {
		type: String,
		required: false
	},

	donation: {
		type: Number,
		required: true
	},

	date: {
		type: String,
		required: false
	}
});

donationSchema.methods.serialize = function() {
	return {
		id: this._id,
		userId: this.userId,
		purpose: this.purpose,
		donation: this.donation,
		date: this.date
	};
};



const Donation = mongoose.model('Donation', donationSchema);

module.exports = { Donation };