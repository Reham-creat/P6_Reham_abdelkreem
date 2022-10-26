const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);


const mongoose = require('mongoose');
const DB_MONGODB = process.env.DB_CODE;


    mongoose.connect(DB_MONGODB,
        {useNewUrlParser : true,
        useUnifiedTopology : true})
    .then( () => {
        console.log(`MongoDB connected.`);
    })
    .catch( () => {
        console.log('MongoDB failed!');
    });
/* 
The structure of the back-end is made like this:
  - the front-end seeking to communicate with the back-end will seek
  its default entry point, which is the server.js
  - server.js will then process and send the request to app.js
  - app.js will send the request to the routes; here we create a folder
  for routes since there may be several.
  - these routes will then first pass through an authentication system
  of usage, in the middleware folder, which contains the two files
  auth.js and multer.js
  - we will then move on to the controllers, which will do the most work
  CRUD: create, read, update, delete; communication with the database
  is done here.
  - the models folder is a guide for what is possible to do with it
  the DB.
*/