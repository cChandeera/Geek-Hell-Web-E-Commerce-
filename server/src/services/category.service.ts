import mongoose from 'mongoose';
import { Category, ICategory } from '../models/Category';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { CreateCategoryInput, UpdateCategoryInput, CategoryQueryInput } from '../validators/category.validator';
import { IPaginatedResult } from '../types/models';

export const getCategories = async (query: CategoryQueryInput): Promise<IPaginatedResult<ICategory>> => {
  const { page, limit, search, isActive, parentCategory, sortBy, sortOrder } = query;

  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (typeof isActive === 'boolean') {
    filter.isActive = isActive;
  }

  if (parentCategory !== undefined) {
    if (parentCategory === 'null') {
      filter.parentCategory = null;
    } else {
      filter.parentCategory = parentCategory;
    }
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortDirection };

  const skip = (page - 1) * limit;

  const [docs, totalDocs] = await Promise.all([
    Category.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
    Category.countDocuments(filter),
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

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, `Category not found with id ${id}`);
  }
  return category;
};

export const getCategoryBySlug = async (slug: string): Promise<ICategory> => {
  const category = await Category.findOne({ slug: slug.toLowerCase() });
  if (!category) {
    throw new ApiError(404, `Category not found with slug '${slug}'`);
  }
  return category;
};

export const createCategory = async (input: CreateCategoryInput): Promise<ICategory> => {
  const slugToCheck = input.slug || input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const existingSlug = await Category.findOne({ slug: slugToCheck });
  if (existingSlug) {
    throw new ApiError(400, `A category with slug '${slugToCheck}' already exists`);
  }

  const existingName = await Category.findOne({ name: { $regex: `^${input.name}$`, $options: 'i' } });
  if (existingName) {
    throw new ApiError(400, `A category with name '${input.name}' already exists`);
  }

  if (input.parentCategory) {
    const parent = await Category.findById(input.parentCategory);
    if (!parent) {
      throw new ApiError(404, `Parent category not found with id ${input.parentCategory}`);
    }
  }

  const category = await Category.create(input);
  return category;
};

export const updateCategory = async (id: string, input: UpdateCategoryInput): Promise<ICategory> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, `Category not found with id ${id}`);
  }

  if (input.name && input.name !== category.name) {
    const existingName = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${input.name}$`, $options: 'i' },
    });
    if (existingName) {
      throw new ApiError(400, `A category with name '${input.name}' already exists`);
    }
  }

  if (input.slug && input.slug.toLowerCase() !== category.slug) {
    const existingSlug = await Category.findOne({
      _id: { $ne: id },
      slug: input.slug.toLowerCase(),
    });
    if (existingSlug) {
      throw new ApiError(400, `A category with slug '${input.slug}' already exists`);
    }
  }

  if (input.parentCategory) {
    if (input.parentCategory === id) {
      throw new ApiError(400, 'A category cannot be its own parent');
    }
    const parent = await Category.findById(input.parentCategory);
    if (!parent) {
      throw new ApiError(404, `Parent category not found with id ${input.parentCategory}`);
    }
  }

  Object.assign(category, input);
  await category.save();
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, `Category not found with id ${id}`);
  }

  // Prevent delete if any category is a child
  const childCategory = await Category.findOne({ parentCategory: id });
  if (childCategory) {
    throw new ApiError(400, `Cannot delete category: it is a parent to category '${childCategory.name}'`);
  }

  // Prevent delete if products are associated
  const categoryObjectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
  const productFilter: Record<string, any>[] = [
    { category: id },
    { category: category.slug },
    { category: category.name },
  ];
  if (categoryObjectId) {
    productFilter.push({ category: categoryObjectId });
  }

  const linkedProduct = await Product.findOne({ $or: productFilter });
  if (linkedProduct) {
    throw new ApiError(400, `Cannot delete category: it has associated product '${linkedProduct.name}'`);
  }

  await Category.findByIdAndDelete(id);
};
