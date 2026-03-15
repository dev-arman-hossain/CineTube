import { Server } from 'http';
import app from './app';
import config from './config/index';

let server: Server;

async function main() {
  try {
    console.log('Attempting to start server...');
    server = app.listen(config.port, () => {
      console.log(`CineTube server listening on port ${config.port}`);
    });
    server.on('error', (err) => {
      console.error('Server error event:', err);
    });
    server.on('close', () => {
      console.log('Server closed');
    });
  } catch (err) {
    console.error('Catch block error:', err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
