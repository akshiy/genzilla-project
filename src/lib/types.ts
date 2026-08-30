export interface Product {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  badge: string | null;
  featured: boolean;
  stock: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderPayload {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: { id: string; name: string; price: number; qty: number }[];
  total: number;
}
