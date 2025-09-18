import express from 'express';
import logger from '#config/logger.js';

import helmet from "helmet";

const app = express();

app.use(helmet());

app.get('/', (req, res) => {
  logger.info('Request received, Hello from acquisitions!');
  res.status(200).send('Hello from acquisitions!');
});

export default app;
