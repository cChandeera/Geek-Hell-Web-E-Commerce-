export type FranchiseTag = 'Marvel' | 'DC' | 'GeekOriginal' | 'Anime';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL';

export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Printing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface GarmentColorVariant {
  name: string;
  hex: string;
  textureMapUrl?: string;
}

export interface ProductItem {
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
}

export interface DecalTransform {
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number };
  rotation: number;
  decalImageUrl: string;
  printSide: 'front' | 'back' | 'left_sleeve' | 'right_sleeve';
}

export interface Custom3DDesign {
  id: string;
  designTitle: string;
  baseProductId: string;
  selectedColor: string;
  decals: DecalTransform[];
  previewImageUrl: string;
}

export interface CartItem {
  id: string;
  productId: string;
  customDesignId?: string;
  title: string;
  selectedColor: string;
  selectedSize: GarmentSize;
  unitPrice: number;
  quantity: number;
  previewUrl: string;
}
