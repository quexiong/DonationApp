'use strict';

const 	chai = require('chai'),
		chaiHttp = require('chai-http'),
		faker = require('faker'),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser');

const expect = chai.expect;
const should = chai.should();
const jsonParser = bodyParser.json();

const { app, runServer, closeServer } = require('../server');
const { TEST_DB_URL } = require('../config');
const { User } = require('../models/user');
const { Donation } = require('../models/donation');

chai.use(chaiHttp);

// clear the data from DB before each test
const destroyDB = () => {
	return new Promise((resolve, reject) => {
		console.warn('Destroying DB now');
		mongoose.connection.dropDatabase()
			.then(result => resolve(result))
			.catch(error => reject(error));
	});
};

// Generate some fake user data with faker
const generateFakeUsers = () => {
	const fakeData = [];

	for(let i = 0; i < 5; i++) {
		fakeData.push({
			username: faker.name.firstName() + faker.random.number(),
			password: '123456',
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()	
		});
	};

	console.log(fakeData);

	return User.insertMany(fakeData);
};

const generateFakeDonations = () => {
	const fakeData = [];

	for(let i = 0; i < 10; i++) {
		fakeData.push({
			userID: faker.random.words(),
			purpose: faker.random.words(),
			donation: faker.random.number(),
			date: faker.random.words()
		});
	};

	return Donation.insertMany(fakeData);
};

describe('users endpoint', function() {
	before(function() {
		return runServer(TEST_DB_URL);
	});

	beforeEach(function() {
		return generateFakeUsers();
	});

	afterEach(function() {
		return destroyDB();
	});

	after(function() {
		return closeServer();
	});

	// Test user get route
	describe('GET route', function() {
		it('should return all users in DB', function() {
			let res;

			return chai.request(app)
				.get('/users')
				.then(_res => {
					res = _res;
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);

					return User.count();
				})
				.then(count => {
					res.body.should.have.length(count);
				});
		});
	});

	// Test user post route
	describe('POST route', function newUser() {
		it('should create and add new user to DB', function() {
			let res;
			let newTestUser = {
				username: faker.name.firstName() + faker.random.number(),
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				password: '123456'
			};

			return chai.request(app)
				.post('/users')
				.send(newTestUser)
				.then(_res => {
					res = _res;
					res.should.have.status(201);
					res.body.should.be.an('object');
					res.body.should.include.keys('id', 'username', 'firstName', 'lastName');
					res.body.id.should.not.be.null;
				});
			});
	});
});

// test DONATION routes
describe('doantions endpoint', function() {
	before(function() {
		return runServer(TEST_DB_URL);
	});

	beforeEach(function() {
		return generateFakeDonations();
	});

	afterEach(function() {
		return destroyDB();
	});

	after(function() {
		return closeServer();
	});

	// Test event GET route
	describe('GET route', function() {
		it('should return all donations created by the user in DB', function() {
			let res;

			return chai.request(app)
				.get('/donations')
				.then(_res => {
					res = _res;

					console.log(res.body);
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);

					return Donation.count();
				})
				.then(count => {
					res.body.should.have.length(count);
				});
		});
	});

	describe('POST route', function createNewDonation() {
			it('should create a new donation and add to DB', function() {
				let res;
				let newTestDonation = {
					userID: faker.random.words(),
					purpose: faker.random.words(),
					donation: faker.random.number(),
					date: faker.random.words()
				};

				return chai.request(app)
					.post('/donations')
					.send(newTestDonation)
					.then(_res => {
						res = _res;
						res.should.have.status(201);
						res.body.should.be.an('object');
						res.body.should.include.keys('userID', 'purpose', 'donation', 'date', 'id');
						res.body.id.should.not.be.null;
				})
		});
	});

	describe('PUT route', function() {
		it('should edit the donation by id in the DB', function() {
			let res;
			let updateDonation = {
					userID: '1290343',
					purpose: 'my buddys wedding',
					donation: faker.random.number(),
					date: '4/30/2018'
			};

			return Donation
				.findOne()
				.then(function(randomDonation) {
					updateDonation.id = randomDonation.id;

					return chai.request(app)
						.put(`/donations/${randomDonation.id}`)
						.send(updateDonation);
				})
				.then(function(res) {
					res.should.have.status(201);

					return Donation.findById(updateDonation.id);
				})
				.then(function(donation) {
					expect(donation.DonationName).to.equal(updateDonation.DonationName);
				})
		});
	});

	describe('DELETE route', function() {
		it('should delete the donation by id in the DB', function() {
			let donation;

			return Donation
				.findOne()
				.then(function (_donation) {
					donation = _donation;

					return chai.request(app).delete(`/donations/${donation.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);

					return Donation.findById(donation.id);
				})
				.then(function(donation) {
					expect(donation).to.be.null;
				});
		});
	});
});