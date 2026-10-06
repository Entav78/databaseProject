const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'Hotel API',
    description: 'Documentation for our hotel application.',
  },
  host: 'localhost:3000',
  definitions: {
    Hotel: {
      $Name: 'Street Hotel',
      $Location: 'Chicago',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./bin/www');
});
