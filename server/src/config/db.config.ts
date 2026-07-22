import mongoose from 'mongoose';
import { ENV } from './env.config';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!ENV.MONGODB_URI) {
      logger.warn('MONGODB_URI not provided. Database connection deferred.');
      return;
    }
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('MongoDB Atlas connected successfully.');
  } catch (error) {
    logger.error('MongoDB Atlas connection failure:', error);
  }
};
