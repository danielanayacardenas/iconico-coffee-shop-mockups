export interface ProductSpecs {
  origin: string;
  roast: 'claro' | 'medio' | 'oscuro';
  process: string;
  altitude: string;
  flavorNotes: string[];
  score?: number;
  varietal?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'best-seller' | 'pack' | 'subscription';
  type: 'blend' | 'single-origin' | 'decaf' | 'microlot' | 'special';
  price: number;
  subscriptionPrice?: number;
  unit: string;
  description: string;
  specs: ProductSpecs;
  tags: string[];
  image: string;
  badge?: string;
  inStock: boolean;
  isNew?: boolean;
  isDecaf?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
}

export type ShopMode = 'explorador' | 'experto';
export type ShopSection = 'todos' | 'best-seller' | 'pack' | 'subscription';
