import { Product, IProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '../validators/product.validator';
import { IPaginatedResult } from '../types/models';
import { uploadBufferToCloudinary, deleteImageFromCloudinary } from './cloudinary.service';
import { logger } from '../utils/logger';


export const getProducts = async (query: ProductQueryInput): Promise<IPaginatedResult<IProduct>> => {
  const {
    page,
    limit,
    search,
    category,
    gender,
    isFeatured,
    isActive,
    minPrice,
    maxPrice,
    color,
    size,
    inStock,
    sortBy,
    sortOrder,
  } = query;

  const filter: Record<string, any> = {};

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

  if (color) {
    filter.availableColors = color;
  }

  if (size) {
    filter.availableSizes = size;
  }

  if (typeof inStock === 'boolean') {
    if (inStock) {
      filter.stock = { $gt: 0 };
    } else {
      filter.stock = 0;
    }
  }

  // Map sort keys
  let sortField = sortBy;
  if (sortBy === 'newest') {
    sortField = 'createdAt';
  } else if (sortBy === 'price') {
    sortField = 'basePrice';
  } else if (sortBy === 'popularity') {
    sortField = 'reviewCount';
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortField]: sortDirection };

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

/**
 * Uploads multiple images to Cloudinary and appends them to the product.
 * Rollback: If any upload fails, deletes any succeeded uploads from Cloudinary.
 */
export const uploadProductImages = async (
  id: string,
  files: Express.Multer.File[]
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }

  const results = await Promise.allSettled(
    files.map((file) => uploadBufferToCloudinary(file.buffer, 'products'))
  );

  const succeeded = results
    .filter(
      (r): r is PromiseFulfilledResult<{ publicId: string; url: string; thumbnail?: string }> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value);

  const failed = results.filter((r) => r.status === 'rejected');

  if (failed.length > 0) {
    // Delete successfully uploaded files from Cloudinary to avoid orphaned files
    await Promise.all(
      succeeded.map((asset) => deleteImageFromCloudinary(asset.publicId).catch(() => {}))
    );
    const reason = (failed[0] as PromiseRejectedResult).reason;
    throw new ApiError(500, `Failed to upload product images: ${reason?.message || reason}`);
  }

  if (!product.images) {
    product.images = [];
  }

  product.images.push(...succeeded);
  await product.save();

  return product;
};

/**
 * Replaces an existing image on a product with a new uploaded image.
 */
export const updateProductImage = async (
  id: string,
  oldPublicId: string,
  file: Express.Multer.File
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }

  const imageIndex = product.images.findIndex((img) => {
    if (typeof img === 'string') {
      return false;
    }
    return img.publicId === oldPublicId;
  });

  if (imageIndex === -1) {
    throw new ApiError(404, `Original image with publicId ${oldPublicId} not found on this product`);
  }

  let newAsset: { publicId: string; url: string; thumbnail?: string };
  try {
    newAsset = await uploadBufferToCloudinary(file.buffer, 'products');
  } catch (error) {
    throw new ApiError(500, `Failed to upload new image to Cloudinary: ${(error as Error).message}`);
  }

  try {
    await deleteImageFromCloudinary(oldPublicId);
  } catch (error) {
    // Rollback uploaded new asset to prevent orphans
    await deleteImageFromCloudinary(newAsset.publicId).catch(() => {});
    throw new ApiError(500, `Failed to delete old image from Cloudinary: ${(error as Error).message}`);
  }

  product.images[imageIndex] = newAsset;
  product.markModified('images');
  await product.save();

  return product;
};

/**
 * Deletes a product image from Cloudinary and removes it from the product catalog.
 */
export const deleteProductImage = async (id: string, publicId: string): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }

  const imageIndex = product.images.findIndex((img) => {
    if (typeof img === 'string') {
      return false;
    }
    return img.publicId === publicId;
  });

  if (imageIndex === -1) {
    throw new ApiError(404, `Image with publicId ${publicId} not found on this product`);
  }

  try {
    await deleteImageFromCloudinary(publicId);
  } catch (error) {
    throw new ApiError(500, `Failed to delete image from Cloudinary: ${(error as Error).message}`);
  }

  product.images.splice(imageIndex, 1);
  product.markModified('images');
  await product.save();

  return product;
};

/**
 * Direct adjustment of a product's stock.
 */
export const updateProductStock = async (
  id: string,
  quantity: number,
  action: 'increase' | 'decrease' | 'set' = 'set'
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, `Product not found with id ${id}`);
  }

  let newStock = product.stock;
  if (action === 'increase') {
    newStock += quantity;
  } else if (action === 'decrease') {
    newStock -= quantity;
  } else {
    newStock = quantity;
  }

  if (newStock < 0) {
    throw new ApiError(400, `Insufficient stock. Stock level cannot be negative.`);
  }

  product.stock = newStock;

  // Alerts
  const LOW_STOCK_THRESHOLD = 5;
  if (product.stock === 0) {
    logger.warn(`[Out of Stock Alert] Product '${product.name}' (ID: ${product._id}) is now out of stock.`);
  } else if (product.stock <= LOW_STOCK_THRESHOLD) {
    logger.warn(
      `[Low Stock Alert] Product '${product.name}' (ID: ${product._id}) is low on stock: ${product.stock} left.`
    );
  }

  await product.save();
  return product;
};

