'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const donationSchema = new mongoose.Schema({
	userId: {
		// this is the unique id from event db that we need to attach to every donation so that donations for 
		// the event are attached to event
		type: String,
		required: true
	},

	purpose: {
		type: String,
		required: false
	}

	donation: {
		type: Number,
		required: true
	},

	date: {
		type: String,
		required: false
	}
});

contributionSchema.methods.serialize = function() {
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