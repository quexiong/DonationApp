'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:123456@ds119350.mlab.com:19350/sunshine-fund';
exports.TEST_DB_URL = process.env.TEST_DB_URL || 'mongodb://tester:testtest@ds119350.mlab.com:19350/sunshine-fund-test';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';