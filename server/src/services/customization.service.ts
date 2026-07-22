import { Customization } from '../models/Customization';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { CreateCustomizationInput } from '../validators/customization.validator';

export const createCustomization = async (userId: string, input: CreateCustomizationInput) => {
  const product = await Product.findById(input.productId);
  if (!product) {
    throw new ApiError(404, 'Associated product not found');
  }

  const customization = await Customization.create({
    userId,
    productId: input.productId,
    shirtColor: input.shirtColor,
    designImage: input.designImage,
    position: input.position,
    scale: input.scale,
    rotation: input.rotation,
  });

  return customization;
};

export const getCustomizationById = async (id: string) => {
  const customization = await Customization.findById(id).populate('productId').populate('userId', 'name email');
  if (!customization) {
    throw new ApiError(404, `Customization configuration not found with id ${id}`);
  }
  return customization;
};
