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
const { Contribution } = require('../models/contribution');
const { Event } = require('../models/event');