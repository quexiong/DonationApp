'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Donation } = require('../models/donation');

router.get('/', (req, res) => {
	Donation
		.find()
		.then(donations => {
			res.json(donations.map(donations => donations.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'an error occurred'});
		});
});

router.get('/:userId', (req, res) => {
	let userId = req.params.userId;
	Donation
		.find({userId: userId})
		.then(donations => {
			res.json(donations.map(donations => donations.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'an error occurred'});
		});
});

router.post('/', (req, res) => {
	let 
		userId = req.body.userId,
		purpose = req.body.purpose,
		donation = req.body.donation,
		date = req.body.date

	Donation
		.create({
				userId, 
				purpose,
				donation,
				date
		})
		.then(donation => res.status(201).json(donation.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'an error occurred'});
		});

router.delete('/:id', (req, res) => {
	Donation
		.findByIdAndRemove(req.params.id)
		.then(() => {
			console.log(`Deleted donation with id \`${req.params.id}\``);
				res.status(204).end();
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'an error occurred'});
		});
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['id', 'purpose', 'donation', 'date'];
  	for (let i = 0; i < requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in request body`
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}

  	if (req.params.id !== req.body.id) {
    	const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
    	console.error(message);
    	return res.status(400).send(message);
  	}

  	const updatedItem = {
	    id: req.body.id,
	    purpose: req.body.purpose,
	    donation: req.body.donation,
	    date: req.body.date,
  	};

  	console.log(updatedItem);

  	Donation
  		.findByIdAndUpdate(req.params.id, updatedItem, { new: true })
    	.then(updatedItem => {
      	console.log(updatedItem);
      	res.status(201).json(updatedItem.serialize())
    	})
    	.catch(err => {
      	console.error(err);
      	res.status(500).json({ error: 'an error occurred' });
    });
});

});

module.exports = router;