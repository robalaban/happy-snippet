import express from 'express'
import config from './config'

async function startServer() {
  const app = express();

  // dependency injection with passportJS?
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    console.log(`Listening on port: ${config.port}`)
  }).on('error', err => {
    process.exit(1);
  });
}

startServer();
