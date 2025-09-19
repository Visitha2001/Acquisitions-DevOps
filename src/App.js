import express from 'express';
import logger from '#config/logger.js';
import helmet from "helmet";
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from '#routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined' , { stream: { write: (message) => logger.info(message.trim())}}));
app.use(cookieParser());

app.get('/', (req, res) => {
  logger.info('Request received, Hello from acquisitions!');
  res.status(200).send('Hello from acquisitions!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime(), memoryUsage: process.memoryUsage()
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'OK', message: 'Acquisitions API is running...'
  });
});

app.use('/api/auth', authRoutes);

export default app;