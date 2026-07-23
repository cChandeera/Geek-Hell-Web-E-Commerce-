import { Product, IProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validators/product.validator';
import { IPaginatedResult } from '../types/models';

export const getProducts = async (query: ProductQueryInput): Promise<IPaginatedResult<IProduct>> => {
  const { page, limit, search, category, gender, isFeatured, isActive, minPrice, maxPrice, sortBy, sortOrder } = query;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (gender) {
    filter.gender = gender;
  }

  if (typeof isFeatured === 'boolean') {
    filter.isFeatured = isFeatured;
  }

  if (typeof isActive === 'boolean') {
    filter.isActive = isActive;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.basePrice = {};
    if (minPrice !== undefined) (filter.basePrice as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.basePrice as Record<string, number>).$lte = maxPrice;
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortDirection };

  const skip = (page - 1) * limit;

  const [docs, totalDocs] = await Promise.all([
    Product.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / limit) || 1;

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }
  return product;
};

export const getProductBySlug = async (slug: string): Promise<IProduct> => {
  const product = await Product.findOne({ slug: slug.toLowerCase() });
  if (!product) {
    throw new ApiError(404, `Product not found with slug '${slug}'`);
  }
  return product;
};

export const createProduct = async (input: CreateProductInput): Promise<IProduct> => {
  if (input.slug) {
    const existing = await Product.findOne({ slug: input.slug.toLowerCase() });
    if (existing) {
      throw new ApiError(400, `A product with slug '${input.slug}' already exists`);
    }
  }

  const product = await Product.create(input);
  return product;
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }

  if (input.slug && input.slug.toLowerCase() !== product.slug) {
    const existing = await Product.findOne({ slug: input.slug.toLowerCase() });
    if (existing) {
      throw new ApiError(400, `A product with slug '${input.slug}' already exists`);
    }
  }

  Object.assign(product, input);
  await product.save();
  return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }
};
