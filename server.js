'use strict';

const 	express = require('express'),
		    bodyParser = require('body-parser'),
    		morgan = require('morgan'),
    		mongoose = require('mongoose'),
        passport = require('passport');
		
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { User } = require('./models/user');

const 	userRouter = require('./routes/userRouter'),
		    donationRouter = require('./routes/donationRouter'),
        login = require('./routes/login');

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));
app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/contributions', contributionRouter);
app.use('/login', login);

app.use('*', function (req, res) {
  res.send('Page requested does not exist');
});

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
};

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
