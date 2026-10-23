export interface BrandProduct {
  name: string;
  category: string;
  description: string;
  canonicalDna: string;
  materials: string[];
  colors: { name: string; hex: string }[];
  logoDetails: string;
  tagline: string;
  masterImage?: string; // base64 or url
}

export type MediumType =
  | 'billboard'
  | 'newspaper'
  | 'social'
  | 'subway'
  | 'magazine'
  | 'storefront'
  | 'pedestal'
  | 'kiosk'
  | 'custom';

export interface MediumConfig {
  id: MediumType;
  title: string;
  subtitle: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4' | '9:16';
  description: string;
  iconName: string;
  selected: boolean;
}

export interface GeneratedShot {
  id: string;
  medium: MediumType;
  mediumTitle: string;
  aspectRatio: string;
  imageUrl: string;
  promptUsed: string;
  modelUsed: string;
  timestamp: number;
  customTweak?: string;
  isLoading?: boolean;
  error?: string;
}

export interface ProductPreset {
  id: string;
  label: string;
  category: string;
  tagline: string;
  product: BrandProduct;
}
