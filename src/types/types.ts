// Path: src\types\types.ts
export interface User {
  id: string;
  email: string;
  username?: string;
  fullname?: string;
  website?: string;
  avatar_url?: string;
}
interface Image {
  src: string;
  alt?: string; // Optional alt text
}
export interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  stock_status: string;
  images: Image[];
  price: number;
  category: string;
  image_url: string;
  discountPrice: number;
  quantity: number;
  imageUrl: string;
}
export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  quantity: number;
}
export interface Zuivel {
  id: string;
  name: string;
  description: string;
  short_description: string;
  stock_status: string;
  images: Image[]; // Correctly typing images as an array of Image objects
  price: number;
  category: string;
  quantity: number;
  image_url: string; // If this is redundant with src, you might want to review its usage
}
export interface Vlees {
  id: string;
  name: string;
  description: string;
  short_description: string;
  stock_status: string;
  images: Image[]; // Correctly typing images as an array of Image objects
  price: number;
  category: string;
  quantity: number;
  image_url: string; // If this is redundant with src, you might want to review its usage
}

export interface Kaas {
  id: string;
  name: string;
  description: string;
  short_description: string;
  stock_status: string;
  images: Image[]; // Correctly typing images as an array of Image objects
  price: number;
  category: string;
  quantity: number;
  image_url: string; // If this is redundant with src, you might want to review its usage
}
