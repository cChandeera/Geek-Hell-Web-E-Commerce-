export type UserRole = 'user' | 'admin';

export type FranchiseTag = 'Marvel' | 'DC' | 'GeekOriginal' | 'Anime';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL';

export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Printing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface GarmentColorVariant {
  name: string;
  hex: string;
  textureMapUrl?: string;
}

export interface ProductDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  franchiseTag: FranchiseTag;
  baseModelUrl: string;
  availableColors: GarmentColorVariant[];
  availableSizes: GarmentSize[];
  stockInventory: number;
  ratingsAverage: number;
  ratingsQuantity: number;
}

export interface DecalTransformDTO {
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number };
  rotation: number;
  decalImageUrl: string;
  printSide: 'front' | 'back' | 'left_sleeve' | 'right_sleeve';
}

export interface CustomDesignDTO {
  id: string;
  designTitle: string;
  baseProductId: string;
  selectedColor: string;
  decals: DecalTransformDTO[];
  previewImageUrl: string;
}

export interface ApiResponseDTO<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors: unknown | null;
  meta: {
    timestamp: string;
    page?: number;
    limit?: number;
    total?: number;
  };
}
