import { Product, IProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';

export const getProducts = async (category?: string, search?: string) => {
  const filter: Record<string, unknown> = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return products;
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }
  return product;
};

export const createProduct = async (productData: Partial<IProduct>) => {
  const product = await Product.create(productData);
  return product;
};
