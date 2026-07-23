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

    // Ensure default dev admin exists in development
    if (ENV.NODE_ENV === 'development') {
      const { User } = await import('../models/User');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        await User.create({
          _id: new mongoose.Types.ObjectId('660000000000000000000000'),
          name: 'Admin Developer',
          email: 'admin@geekhell.com',
          password: 'Password123!',
          role: 'admin',
          isVerified: true,
          status: 'active',
        });
        logger.info('Default development admin user seeded.');
      }
    }
  } catch (error) {
    logger.error('MongoDB Atlas connection failure:', error);
  }
};
