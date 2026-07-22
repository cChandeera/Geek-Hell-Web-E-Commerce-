import mongoose from 'mongoose';
import { ENV } from '../config/env.config';
import { Product } from '../models/Product';
import { logger } from '../utils/logger';

const initialProducts = [
  {
    name: 'Marvel Iron Man Mark 85 Arc Reactor Oversized Tee',
    description: 'Luxury heavy 280GSM cotton oversized T-shirt featuring reactive glowing Arc Reactor chest graphic.',
    category: 'Marvel',
    price: 65,
    images: ['/models/tshirt_front_back.glb'],
    availableColors: ['#09090b', '#ed1d24', '#ffffff'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    stock: 50,
  },
  {
    name: 'DC Batman Dark Knight Stealth Armor Graphic Tee',
    description: 'Obsidian black tactical cotton T-shirt featuring 3D embossed Batman chest emblem.',
    category: 'DC',
    price: 70,
    images: ['/models/tshirt_front_back.glb'],
    availableColors: ['#09090b', '#18181b', '#0476f2'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
  },
  {
    name: 'Marvel Spider-Man Web-Slinger Cyberpunk Tee',
    description: 'Cyberpunk neon red web-patterned apparel line crafted for high durability and comfort.',
    category: 'Marvel',
    price: 60,
    images: ['/models/tshirt_front_back.glb'],
    availableColors: ['#ed1d24', '#09090b'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 60,
  },
  {
    name: 'DC The Flash Speed Force Neon Bolt Tee',
    description: 'Electric crimson apparel line featuring reflective Speed Force lightning accents.',
    category: 'DC',
    price: 65,
    images: ['/models/tshirt_front_back.glb'],
    availableColors: ['#ed1d24', '#f5c518', '#09090b'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    stock: 40,
  },
];

const seed = async () => {
  try {
    if (!ENV.MONGODB_URI) {
      logger.error('MONGODB_URI is required to run database seeder');
      process.exit(1);
    }
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('Connected to MongoDB for database seeding...');

    await Product.deleteMany({});
    logger.info('Cleared existing product collection');

    const created = await Product.insertMany(initialProducts);
    logger.info(`Successfully seeded ${created.length} superhero apparel products!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seed();
